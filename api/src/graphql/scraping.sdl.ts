export const schema = gql`
  type TriggerScrapeResponse {
    url: String!
    modelName: String!
    message: String!
  }

  type Mutation {
    triggerScrape(url: String!, modelName: String!, source:String!): TriggerScrapeResponse! @requireAuth
  }
`
