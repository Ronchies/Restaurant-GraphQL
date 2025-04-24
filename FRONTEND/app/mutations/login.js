import { gql } from "@apollo/client"

const LOGIN_USER = gql`
mutation Mutation($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    message
    token
    type
    user {
      user_id
      username
      user_type
    }
  }
}`;

export default LOGIN_USER;