export const schema = gql`
  type Conversation {
    id: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    entries:  [ConversationEntry!]!
    userId: String
    modelId: String!
  }

  enum Speaker {
    user
    ai
  }

  type Query {
    conversations: [Conversation!]! @requireAuth
    conversation(id: String!): Conversation @requireAuth
    modelConversations(modelId:String!): [Conversation!]! @requireAuth
  }

  input CreateConversationInput {
    userId: String!
    name: String!
    modelId: String!
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
