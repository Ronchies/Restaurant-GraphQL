export const userSchema = `#graphql
    type User {
        user_id: Int
        username: String
        user_type: String
    }

    input AddUserInput {
        user_id: Int!
        username: String!
        password: String!
        user_type: String!
    }

    input EditUserInput {
        username: String
        password: String
        user_type: String
    }
`;
