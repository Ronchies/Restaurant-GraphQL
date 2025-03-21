import { client } from "../helpers/dbHelper.js";

export const orderitemsResolver = {
    Query: {
        orderitems: async () => {
            console.log("Query: orderitems called");
            try {
                const query = {
                    text: "SELECT * FROM public.orderitems",
                };
                const result = await client.query(query);
                return result.rows;
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch order items");
            }
        },

        orderitem: async (_, { orderitem_id }) => {
            console.log("Query: orderitem called with orderitem_id:", orderitem_id);
            try {
                const query = {
                    text: "SELECT * FROM public.orderitems WHERE orderitem_id = $1",
                    values: [orderitem_id],
                };
                const result = await client.query(query);
                return result.rows[0];
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch order item");
            }
        },

        getUnpaidOrders: async () => {
            console.log("Query: getUnpaidOrders called");
            try {
                const query = {
                    text: "SELECT * FROM public.fn_get_unpaid_orders()",
                };
                const result = await client.query(query);
                // Convert numeric total_amount to float for GraphQL
                return result.rows.map(row => ({
                    order_id: row.order_id,
                    table_id: row.table_id,
                    total_amount: parseFloat(row.total_amount)
                }));
            } catch (err) {
                console.error("Error fetching unpaid orders:", err);
                throw new Error("Failed to fetch unpaid orders: " + err.message);
            }
        },
    },

    Mutation: {
        addOrderItem: async (_, { orderItem, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: addOrderItem called with params:", { orderItem, user_id });
            try {
                const query = {
                    text: "SELECT * FROM public.fn_add_orderitems($1, $2, $3, $4, $5) as result",
                    values: [
                        user_id,
                        orderItem.order_id,
                        orderItem.menu_id,
                        orderItem.quantity,
                        orderItem.amount
                    ],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;

                console.log("Add Order Item Result:", pgResponse);

                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error adding order item:", err);
                throw new Error("Failed to add order item: " + err.message);
            }
        },

        editOrderItem: async (_, { orderitem_id, orderItem, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: editOrderItem called with params:", { orderitem_id, orderItem, user_id });
            try {
                const query = {
                    text: "SELECT * FROM public.fn_edit_orderitems($1, $2, $3, $4, $5, $6, $7) as result",
                    values: [
                        user_id,
                        orderitem_id,
                        orderItem.order_id,
                        orderItem.menu_id,
                        orderItem.quantity,
                        orderItem.amount,
                        orderItem.is_paid
                    ],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;

                console.log("Edit Order Item Result:", pgResponse);

                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error editing order item:", err);
                throw new Error("Failed to update order item: " + err.message);
            }
        },

        deleteOrderItem: async (_, { orderitem_id, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: deleteOrderItem called with params:", { orderitem_id, user_id });
            try {
                const query = {
                    text: "SELECT * FROM public.fn_delete_orderitems($1, $2) as result",
                    values: [user_id, orderitem_id],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;

                console.log("Delete Order Item Result:", pgResponse);

                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error deleting order item:", err);
                throw new Error("Failed to delete order item: " + err.message);
            }
        },
    },
};