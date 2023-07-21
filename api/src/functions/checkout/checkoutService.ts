const Stripe = require('stripe')

const stripe = Stripe("sk_test_51NU6MuHjkj0WoObL0VePy1f0xdIe7iF2xVK8T1tlLTHQNkwoWfxGCn19n6ANz1gP7ipHwVYeHC7ZLwrQkVPo7wnz00ohRki5rs");
const DOMAIN = 'http://localhost:8910';

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
  });
}

export const upgradeSession = ({ id }) => {

}

export const updateUserSubscription = async ({ priceId, subscription }) => {
  return await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: false,
    proration_behavior: 'create_prorations',
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });
}

export const getStripeSubscription = ({ id }) => {
  return stripe.subscriptions.retrieve(id)
}
