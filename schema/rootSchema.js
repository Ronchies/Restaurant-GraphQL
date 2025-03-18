export const rootSchema = `#graphql
    type Query {
        user(id: Int!): User
        users: [User]

        diningtable(table_id: ID!): DiningTable
        diningtables: [DiningTable]
        isTableAvailable(table_id: Int!): Boolean
        
        menu(menu_id: Int!): Menu
        menus: [Menu]
        calculateDiscountedPrice(menu_id: Int!): Float
        
        order(order_id: Int!): Order
        orders: [Order]

        orderitem(orderitem_id: Int!): OrderItem
        orderitems: [OrderItem]
        getUnpaidOrders: [UnpaidOrder]
    }

    type Mutation {
        loginUser(username: String!, password: String!): MutationResponse
    
        addUser(user: AddUserInput!, admin_id: Int!): MutationResponse
        editUser(id: Int!, user: EditUserInput!, admin_id: Int!): MutationResponse
        deleteUser(id: Int!, admin_id: Int!): MutationResponse
        
        addDiningTable(diningTable: AddDiningTableInput!, admin_id: Int!): DiningTableMutationResponse
        editDiningTable(table_id: Int!, diningTable: EditDiningTableInput!, admin_id: Int!): DiningTableMutationResponse
        deleteDiningTable(table_id: Int!, admin_id: Int!): DiningTableMutationResponse
        
        addMenu(menu: AddMenuInput!, admin_id: Int!): MenuMutationResponse
        editMenu(menu_id: Int!, menu: EditMenuInput!, admin_id: Int!): MenuMutationResponse
        deleteMenu(menu_id: Int!, admin_id: Int!): MenuMutationResponse
        
        addOrder(order: AddOrderInput!, user_id: Int!): OrderMutationResponse
        editOrder(order_id: Int!, order: EditOrderInput!, user_id: Int!): OrderMutationResponse
        deleteOrder(order_id: Int!, user_id: Int!): OrderMutationResponse

        addOrderItem(orderItem: AddOrderItemInput!, user_id: Int!): OrderItemMutationResponse
        editOrderItem(orderitem_id: Int!, orderItem: EditOrderItemInput!, user_id: Int!): OrderItemMutationResponse
        deleteOrderItem(orderitem_id: Int!, user_id: Int!): OrderItemMutationResponse
    }

    type MutationResponse {
        content: [User]
        type: String
        message: String
    }
    
    type DiningTableMutationResponse {
        content: DiningTable
        type: String
        message: String
    }
    
    type MenuMutationResponse {
        content: Menu
        type: String
        message: String
    }
    
    type OrderMutationResponse {
        content: Order
        type: String
        message: String
    }

    type OrderItemMutationResponse {
        content: OrderItem
        type: String
        message: String
    }
    
    scalar Time
    scalar DateTime
`;