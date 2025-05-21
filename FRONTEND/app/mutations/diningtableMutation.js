import { gql } from "@apollo/client";

export const ADD_DININGTABLE = gql`
mutation Mutation($diningTable: AddDiningTableInput!, $adminId: Int!) {
  addDiningTable(diningTable: $diningTable, admin_id: $adminId) {
    content {
      table_id
      table_name
      is_available
    }
    message
    type
  }
}
`;

export const UPDATE_DININGTABLE = gql`
mutation Mutation($tableId: Int!, $diningTable: EditDiningTableInput!, $adminId: Int!) {
  editDiningTable(table_id: $tableId, diningTable: $diningTable, admin_id: $adminId) {
    content {
      table_id
      table_name
      is_available
    }
    message
    type
  }
}
`;

export const DELETE_DININGTABLE = gql`
mutation Mutation($tableId: Int!, $adminId: Int!) {
  deleteDiningTable(table_id: $tableId, admin_id: $adminId) {
    content {
      table_id
      table_name
      is_available
    }
    message
    type
  }
}
`;

// Add default export that combines all mutations
const DiningTableMutations = {
  ADD_DININGTABLE,
  UPDATE_DININGTABLE,
  DELETE_DININGTABLE
};

export default DiningTableMutations;