import {db} from "src/lib/db";
import {logger} from "src/lib/logger";
import {APIGatewayEvent} from "aws-lambda";

const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const URL = `${process.env.PROTOCOL}${process.env.VERCEL_URL || process.env.VERCEL_BRANCH_URL || process.env.APP_URL}`

export const newUserSession = async ({priceId}) => {
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${URL}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${context.currentUser.sub}`,
    cancel_url: `${URL}?canceled=true`,
    metadata: {
      userId: context.currentUser.sub
    }
  });
}

export const existingUserSession = async ({stripeId, priceId}) => {
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: stripeId,
    mode: 'subscription',
    success_url: `${URL}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${context.currentUser.sub}`,
    cancel_url: `${URL}?canceled=true`,
    metadata: {
      userId: context.currentUser.sub
    }
  });
}

export const upgradeSession = ({ id }) => {

}

export const updateUserSubscription = async ({ priceId, subscription }) => {
  return await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: false,
    proration_behavior: 'none',
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    metadata: {
      userId: context.currentUser.sub
    }
  });
}

export const getStripeSubscription = ({ id }) => {
  return stripe.subscriptions.retrieve(id)
}

export const getStripeEvent = async (event: APIGatewayEvent) => {
  const parsedBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  return await stripe.webhooks.constructEvent(
    parsedBody,
    event.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  )
}

export const handleCustomerSubscriptionCreated = async (stripeEvent) => {
  const subscription = stripeEvent.data.object

  const user = await db.user.findUnique({
    where: { stripeId: subscription.customer },
  })

  if (!user) {
    throw new Error(`User not found: ${subscription.customer}`)
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      subscriptionName: subscription.plan.metadata.name,
    }
  })
}

export const handleInvoicePaymentSucceeded = async (stripeEvent) => {
  const invoice = stripeEvent.data.object

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription
  )

  const user = await db.user.findUnique({
    where: { stripeId: subscription.customer },
  })

  if (!user) {
    throw new Error(`User not found: ${subscription.customer}`)
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      credits: parseInt(String(user.credits)) + parseInt(String(subscription.plan.metadata.credits)),
    }
  })
}

export const handleCustomerSubscriptionUpdated = async (stripeEvent) => {
  const subscription = stripeEvent.data.object

  const user = await db.user.findUnique({
    where: { stripeId: subscription.customer },
  })

  if (!user) {
    throw new Error(`User not found: ${subscription.customer}`)
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      subscriptionName: subscription.plan.metadata.name,
    }
  })

}

export const handleCustomerSubscriptionDeleted = async (stripeEvent) => {
  const subscription = stripeEvent.data.object

  const user = await db.user.findUnique({
    where: { stripeId: subscription.customer },
  })

  if (!user) {
    throw new Error(`User not found: ${subscription.customer}`)
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: null,
      subscriptionName: null,
    }
  })
}


