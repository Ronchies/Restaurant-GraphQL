import { gql } from "@apollo/client";

const GET_USERS = gql`
  query useQuery {
    users {
      user_id
      user_type
      username
    }
  }
`;

export default GET_USERS;
