export const schema = gql`
  type ModelRequest {
    id: String!
    createdAt: DateTime!
    userId: String!
    businessName: String!
    businessWebsite: String
  }

  type Query {
    modelRequests: [ModelRequest!]! @requireAuth
    modelRequest(id: String!): ModelRequest @requireAuth
  }

  input CreateModelRequestInput {
    userId: String!
    businessName: String!
    businessWebsite: String
  }

  input UpdateModelRequestInput {
    userId: String
    businessName: String
    businessWebsite: String
  }

  type Mutation {
    createModelRequest(input: CreateModelRequestInput!): ModelRequest!
      @requireAuth
    updateModelRequest(
      id: String!
      input: UpdateModelRequestInput!
    ): ModelRequest! @requireAuth
    deleteModelRequest(id: String!): ModelRequest! @requireAuth
  }
`
