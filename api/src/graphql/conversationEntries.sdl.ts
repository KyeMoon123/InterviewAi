export const schema = gql`
  type ConversationEntry {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    conversation: Conversation!
    conversationId: String!
    speaker: Speaker!
    entry: String!
  }

  enum Speaker {
    user
    ai
  }

  type Query {
    conversationEntries(conversationId: String!): [ConversationEntry!]! @requireAuth
    conversationEntry(id: String!): ConversationEntry @requireAuth
  }

  input CreateConversationEntryInput {
    conversationId: String!
    speaker: Speaker!
    entry: String!
  }

  input UpdateConversationEntryInput {
    conversationId: String
    speaker: Speaker
    entry: String
  }

  type Mutation {
    createConversationEntry(
      input: CreateConversationEntryInput!
    ): ConversationEntry! @requireAuth
    updateConversationEntry(
      id: String!
      input: UpdateConversationEntryInput!
    ): ConversationEntry! @requireAuth
    deleteConversationEntry(id: String!): ConversationEntry! @requireAuth
  }
`
