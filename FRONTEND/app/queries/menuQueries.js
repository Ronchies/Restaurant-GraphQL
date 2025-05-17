import { gql } from "@apollo/client";

const GET_MENUS = gql`
  query Query {
  menus {
    discount
    is_available
    menu_id
    menu_name
    preparation_time
    price
  }
}
`;

export default GET_MENUS;