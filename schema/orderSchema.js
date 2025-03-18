export const orderSchema = `#graphql
    type Order {
        order_id: Int
        table_id: Int
        order_time: DateTime
        status: String
    }

    input AddOrderInput {
        order_id: Int!
        table_id: Int!
        status: String!
    }

    input EditOrderInput {
        table_id: Int
        status: String
    }
`;