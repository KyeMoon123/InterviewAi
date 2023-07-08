export const schema = gql`
  type Conversation {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    speaker: Speaker!
    entry: String!
    userId: String
  }

  enum Speaker {
    user
    ai
  }

  type Query {
    conversations: [Conversation!]! @requireAuth
    conversation(id: String!): Conversation @requireAuth
  }

  input CreateConversationInput {
    speaker: Speaker!
    entry: String!
    userId: String
  }

  input UpdateConversationInput {
    speaker: Speaker
    entry: String
    userId: String
  }

  type Mutation {
    createConversation(input: CreateConversationInput!): Conversation!
      @requireAuth
    updateConversation(
      id: String!
      input: UpdateConversationInput!
    ): Conversation! @requireAuth
    deleteConversation(id: String!): Conversation! @requireAuth
  }
`
