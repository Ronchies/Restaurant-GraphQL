export const loginSchema = `#graphql
  extend type Mutation {
    loginUser(username: String!, password: String!): MutationResponse
  }
`;