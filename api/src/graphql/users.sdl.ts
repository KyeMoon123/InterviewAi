export const schema = gql`
  type User {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    credits: Int!
    stripeId: String
    subscriptionId: String
    subscriptionName: String
    subscriptionStatus: String
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    id: String!
    credits: Int!
  }


  input UpdateUserInput {
    credits: Int
  }

  type Mutation {
    userSignUp(id: String!): User! @skipAuth
    cancelSubscription: User! @requireAuth
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    updateUserStripe(id: String!, sessionId: String!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
