export const menuSchema = `#graphql
    type Menu {
        menu_id: Int
        menu_name: String
        price: Float
        discount: Float
        preparation_time: Time
        is_available: Boolean
    }

    input AddMenuInput {
        menu_id: Int!
        menu_name: String!
        price: Float!
        discount: Float
        preparation_time: Time
        is_available: Boolean
    }

    input EditMenuInput {
        menu_name: String
        price: Float
        discount: Float
        preparation_time: Time
        is_available: Boolean
    }
`;