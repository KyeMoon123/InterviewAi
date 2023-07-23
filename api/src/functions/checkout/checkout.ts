import type {APIGatewayEvent, Context} from 'aws-lambda'

import {logger} from 'src/lib/logger'
import {useRequireAuth} from "@redwoodjs/graphql-server";
import {getCurrentUser} from "src/lib/auth";
import {authDecoder} from "@redwoodjs/auth-supabase-api";
import {db} from "src/lib/db";
import {
  existingUserSession,
  getStripeSubscription,
  newUserSession,
  updateUserSubscription
} from "src/lib/StripeService";


/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 */
export const checkoutHandler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: checkout function`)
  const {plan} = event.queryStringParameters
  const priceId = getPriceId(plan.toUpperCase())
  const currentUser = await db.user.findUnique({
    where: {id: String(context.currentUser.sub)},
  })

  if (!currentUser) {
    throw new Error('User not found')
  }

  console.log(currentUser)

  let session;
  if (currentUser.stripeId) {
    if (currentUser.subscriptionId) {
      //User already has subscription. hence treat this as an upgrade or downgrade of plan
      console.log("Upgrading or downgrading plan")
      const subscription = await getStripeSubscription({id: currentUser.subscriptionId})
      const upgrade = await updateUserSubscription({priceId: priceId, subscription: subscription})
    } else {
      // User has a stripe customerID in the system, but is not currently subscribed to anything
      console.log("Existing user, but not subscribed to anything")
      session = await existingUserSession({stripeId: currentUser.stripeId, priceId: priceId})
    }
  } else {
    // User does not have a stripe customerID in the system, so create a new customer and subscription
    console.log("New user")
    session = await newUserSession({priceId: priceId})
  }

  if(session){
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sessionUrl: session.url}),
    }
  }else {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify("upgraded"),
    }
  }

}

export const handler = useRequireAuth({
  handlerFn: checkoutHandler,
  getCurrentUser,
  authDecoder,
})

const getPriceId = (plan: string) => {
  switch (plan) {
    case 'HOBBY':
      return process.env.HOBBY_PRICE_ID
    case 'GROWTH':
      return process.env.GROWTH_PRICE_ID
    case 'STANDARD':
      return process.env.STANDARD_PRICE_ID
    case 'UNLIMITED':
      return process.env.UNLIMITED_PRICE_ID
  }
}


