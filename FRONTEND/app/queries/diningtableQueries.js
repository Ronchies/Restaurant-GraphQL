import { gql } from "@apollo/client";

const GET_DININGTABLE = gql`
query Query {
  diningtables {
    table_id
    table_name
    is_available
  }
}
`;

export default GET_DININGTABLE;