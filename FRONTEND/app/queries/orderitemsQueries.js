import { gql } from "@apollo/client";

const GET_ORDERSITEMS = gql`
query Query {
  orderitems {
    orderitem_id
    order_id
    menu_id
    quantity
    amount
    is_paid
  }
}
`;

export default GET_ORDERSITEMS;
