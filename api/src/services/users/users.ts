import type {MutationResolvers, QueryResolvers} from 'types/graphql'

import {db} from 'src/lib/db'

const Stripe = require('stripe')
const stripe = Stripe("sk_test_51NU6MuHjkj0WoObL0VePy1f0xdIe7iF2xVK8T1tlLTHQNkwoWfxGCn19n6ANz1gP7ipHwVYeHC7ZLwrQkVPo7wnz00ohRki5rs");

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({id}) => {
  return db.user.findUnique({
    where: {id},
  })
}

export const userSignUp: MutationResolvers['userSignUp'] = async ({id}) => {

  const stripeUser = await stripe.customers.create()

  return await db.user.create({
    data: {
      id: id,
      credits: 12,
      stripeId: stripeUser.id,
    },
  })
}

export const createUser: MutationResolvers['createUser'] = ({input}) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({id, input}) => {
  return db.user.update({
    data: input,
    where: {id},
  })
}

// export const updateUserStripe: MutationResolvers['updateUserStripe'] = async ({id, sessionId}) => {
//
//   const user = await db.user.findUnique({
//     where: {id},
//   })
//   if (!user) {
//     throw new Error('User not found')
//   }
//     //
//     // const session = await stripe.checkout.sessions.retrieve(sessionId);
//     // console.log(session)
//     // const customer = await stripe.customers.retrieve(session.customer);
//     // console.log(customer)
//     // const subscription = await stripe.subscriptions.retrieve(session.subscription);
//     // console.log(subscription)
//     // const plan = await stripe.plans.retrieve(subscription.plan.id);
//     // console.log(plan)
//     //
//     // return await db.user.update({
//     //   data: {
//     //     stripeId: customer.id,
//     //     subscriptionId: subscription.id,
//     //     subscriptionName: plan.metadata.name,
//     //   },
//     //   where: {id},
//     // })
//   return user
// }

export const deleteUser: MutationResolvers['deleteUser'] = ({id}) => {
  return db.user.delete({
    where: {id},
  })
}

export const cancelSubscription: MutationResolvers['cancelSubscription'] = async () => {
  const user = await db.user.findUnique({
    where: {id: String(context.currentUser.sub)},
  })

  if (!user.subscriptionId) {
    throw new Error('User does not have a subscription')
  }

  try {
    await stripe.subscriptions.update(
      user.subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );
  } catch (e) {
    throw new Error('Error canceling subscription')
  }

  return user
}

export const getUserCredits = async (userId: string): Promise<number> => {
  const userCredits = await db.user.findUnique({
    where: {
      id: userId
    },
    select: {
      credits: true
    }
  })
  return userCredits.credits
}

