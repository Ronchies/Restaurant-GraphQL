import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query useQuery {
    users {
      user_id
      user_type
      username
    }
  }
`;
