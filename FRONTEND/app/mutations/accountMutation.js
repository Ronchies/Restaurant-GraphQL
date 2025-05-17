import { gql } from "@apollo/client";

export const ADD_USER = gql`
mutation Mutation($user: AddUserInput!, $adminId: Int!) {
  addUser(user: $user, admin_id: $adminId) {
    content {
      user_id
      user_type
      username
    }
    message
    type
  }
}
`;

export const UPDATE_USER = gql`
mutation Mutation($editUserId: Int!, $user: EditUserInput!, $adminId: Int!) {
  editUser(id: $editUserId, user: $user, admin_id: $adminId) {
    content {
      user_id
      user_type
      username
    }
    message
    type
  }
}
`;

export const DELETE_USER = gql`
mutation Mutation($deleteUserId: Int!, $adminId: Int!) {
  deleteUser(id: $deleteUserId, admin_id: $adminId) {
    content {
      user_id
      user_type
      username
    }
    message
    type
  }
}
`;

// Add default export that combines all mutations
const AccountMutations = {
  ADD_USER,
  UPDATE_USER,
  DELETE_USER
};

export default AccountMutations;