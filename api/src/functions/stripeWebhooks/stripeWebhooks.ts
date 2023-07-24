import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import {
  getStripeEvent,
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionUpdated,
  handleInvoicePaymentSucceeded,
} from "src/lib/StripeService";

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: stripeWebhooks function`)

  let stripeEvent
  try {
    console.log(process.env.STRIPE_WEBHOOK_SECRET)
    stripeEvent = await getStripeEvent(event)
  } catch (err) {
    //logger.error(err)
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    }
  }
  // Handle the event
  switch (stripeEvent.type) {
    case 'customer.subscription.created':
      await handleCustomerSubscriptionCreated(stripeEvent)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(stripeEvent)
      break
    case 'customer.subscription.deleted':
      await handleCustomerSubscriptionDeleted(stripeEvent)
      break
    case 'customer.subscription.updated':
      await handleCustomerSubscriptionUpdated(stripeEvent)
      break
    default:
      logger.info(`Unhandled event type ${stripeEvent.type}`)
  }


  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'stripeWebhooks function',
    }),
  }
}
