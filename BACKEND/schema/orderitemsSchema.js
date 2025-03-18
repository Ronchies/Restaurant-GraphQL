export const orderitemsSchema = `#graphql
type OrderItem {
    orderitem_id: Int
    order_id: Int
    menu_id: Int
    quantity: Int
    amount: Float
    is_paid: Boolean
}

type UnpaidOrder {
    order_id: Int
    table_id: Int
    total_amount: Float
}

input AddOrderItemInput {
    order_id: Int!
    menu_id: Int!
    quantity: Int!
    amount: Float!
}

input EditOrderItemInput {
    order_id: Int!
    menu_id: Int!
    quantity: Int!
    amount: Float!
    is_paid: Boolean!
}
`;
