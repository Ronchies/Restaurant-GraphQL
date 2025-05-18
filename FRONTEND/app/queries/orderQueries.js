import { gql } from "@apollo/client";

const GET_ORDERS = gql`
query Query {
  orders {
    order_id
    order_time
    status
    table_id
  }
}
`;

export default GET_ORDERS;
