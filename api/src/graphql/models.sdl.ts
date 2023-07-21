export const schema = gql`
  type Model {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    version: String
    reviews: [Review]!
  }

  type Query {
    models: [Model!]! @requireAuth
    model(id: String!): Model @requireAuth
  }

  input CreateModelInput {
    name: String!
    version: String
  }

  input UpdateModelInput {
    name: String
    version: String
  }

  type Mutation {
    createModel(input: CreateModelInput!): Model! @requireAuth
    updateModel(id: String!, input: UpdateModelInput!): Model! @requireAuth
    deleteModel(id: String!): Model! @requireAuth
  }
`
