import { gql } from "@apollo/client";

export const ADD_MENU = gql`
mutation AddMenu($menu: AddMenuInput!, $adminId: Int!) {
  addMenu(menu: $menu, admin_id: $adminId) {
    content {
      menu_id
      menu_name
      price
      discount
      preparation_time
      is_available
    }
    message
    type
  }
}
`;

export const UPDATE_MENU = gql`
mutation Mutation($menuId: Int!, $menu: EditMenuInput!, $adminId: Int!) {
  editMenu(menu_id: $menuId, menu: $menu, admin_id: $adminId) {
    content {
      menu_id
      menu_name
      price
      discount
      preparation_time
      is_available
    }
    message
    type
  }
}
`;

export const DELETE_MENU = gql`
mutation Mutation($menuId: Int!, $adminId: Int!) {
  deleteMenu(menu_id: $menuId, admin_id: $adminId) {
    content {
      menu_id
      menu_name
      price
      discount
      preparation_time
      is_available
    }
    message
    type
  }
}
`;

// Add default export that combines all mutations
const MenuMutations = {
  ADD_MENU,
  UPDATE_MENU,
  DELETE_MENU
};

export default MenuMutations;