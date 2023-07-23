import {db} from "src/lib/db";

const Stripe = require('stripe')

const stripe = Stripe("sk_test_51NU6MuHjkj0WoObL0VePy1f0xdIe7iF2xVK8T1tlLTHQNkwoWfxGCn19n6ANz1gP7ipHwVYeHC7ZLwrQkVPo7wnz00ohRki5rs");
const DOMAIN = process.env.DOMAIN
const endpointSecret = "whsec_7c8939f4937ffa667cf0f13cafce6d393a2e8875cf61cc54e63a41e1c7af589e";

export const newUserSession = async ({priceId}) => {
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${context.currentUser.sub}`,
    cancel_url: `${DOMAIN}?canceled=true`,
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
    success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${context.currentUser.sub}`,
    cancel_url: `${DOMAIN}?canceled=true`,
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

export const getStripeEvent = async (sig, body) => {
  return await stripe.webhooks.constructEvent(body, sig, endpointSecret)
}

export const handleCustomerSubscriptionCreated = async (stripeEvent) => {
  const subscription = stripeEvent.data.object

  const user = await db.user.findUnique({
    where: { stripeId: subscription.customer },
  })

  if (!user) {
    throw new Error(`User not found: ${subscription.customer}`)
  }

  console.log('subscription', subscription)
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
