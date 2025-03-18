export const diningtableSchema = `#graphql
    type DiningTable {
        table_id: Int
        table_name: String
        is_available: Boolean
    }

    input AddDiningTableInput {
        table_id: Int!
        table_name: String!
    }

    input EditDiningTableInput {
        table_name: String!
    }
`;