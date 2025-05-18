import { gql } from "@apollo/client";

export const ADD_ORDER = gql`
mutation Mutation($order: AddOrderInput!, $userId: Int!) {
  addOrder(order: $order, user_id: $userId) {
    content {
      order_id
      table_id
      order_time
      status
    }
    message
    type
  }
}
`;

export const UPDATE_ORDER = gql`
mutation Mutation($orderId: Int!, $order: EditOrderInput!, $userId: Int!) {
  editOrder(order_id: $orderId, order: $order, user_id: $userId) {
    content {
      order_id
      table_id
      order_time
      status
    }
    message
    type
  }
}
`;

export const DELETE_ORDER = gql`
mutation Mutation($orderId: Int!, $userId: Int!) {
  deleteOrder(order_id: $orderId, user_id: $userId) {
    content {
      order_id
      table_id
      order_time
      status
    }
    message
    type
  }
}
`;

export const ADD_ORDERITEM = gql`
mutation Mutation($orderItem: AddOrderItemInput!, $userId: Int!) {
  addOrderItem(orderItem: $orderItem, user_id: $userId) {
    content {
      orderitem_id
      order_id
      menu_id
      quantity
      amount
      is_paid
    }
    message
    type
  }
}
`;

export const UPDATE_ORDERITEM = gql`
mutation Mutation($orderitemId: Int!, $orderItem: EditOrderItemInput!, $userId: Int!) {
  editOrderItem(orderitem_id: $orderitemId, orderItem: $orderItem, user_id: $userId) {
    content {
      orderitem_id
      order_id
      menu_id
      quantity
      amount
      is_paid
    }
  }
}
`;

export const DELETE_ORDERITEM = gql`
mutation Mutation($orderitemId: Int!, $userId: Int!) {
  deleteOrderItem(orderitem_id: $orderitemId, user_id: $userId) {
    content {
      orderitem_id
      order_id
      menu_id
      quantity
      amount
      is_paid
    }
    message
    type
  }
}
`;

// Add default export that combines all mutations
const OrderMutations = {
  ADD_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  ADD_ORDERITEM,
  UPDATE_ORDERITEM,
  DELETE_ORDERITEM
};

export default OrderMutations;