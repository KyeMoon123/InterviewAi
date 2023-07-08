export const schema = gql`
  type Review {
    id: BigInt!
    authoredAt: DateTime
    scrapedAt: DateTime!
    externalReference: String
    title: String
    body: String!
    source: String!
    rating: Int
  }

  type Query {
    reviews: [Review!]! @requireAuth
    review(id: BigInt!): Review @requireAuth
  }

  input CreateReviewInput {
    authoredAt: DateTime
    scrapedAt: DateTime
    externalReference: String
    title: String
    body: String!
    source: String!
    rating: Int
  }

  input UpdateReviewInput {
    authoredAt: DateTime
    scrapedAt: DateTime
    externalReference: String
    title: String
    body: String
    source: String
    rating: Int
  }

  type Mutation {
    createReview(input: CreateReviewInput!): Review! @requireAuth
    updateReview(id: BigInt!, input: UpdateReviewInput!): Review! @requireAuth
    deleteReview(id: BigInt!): Review! @requireAuth
  }
`
