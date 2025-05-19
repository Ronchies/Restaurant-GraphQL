import { client } from "../helpers/dbHelper.js";
import { DateTimeScalar } from "../helpers/scalarHandler.js";

export const orderResolver = {
    Query: {
        orders: async () => {
            console.log("Query: orders called");
            try {
                const query = {
                    text: "SELECT * FROM orders",
                };
                const result = await client.query(query);
                
                return result.rows.map(order => {
                    if (order.order_time && typeof order.order_time === 'string') {
                        order.order_time = new Date(order.order_time);
                    }
                    return order;
                });
            } catch (err) {
                console.error("Error fetching orders:", err);
                throw new Error("Failed to fetch orders");
            }
        },
        
        order: async (_, { order_id }) => {
            console.log("Query: order called with order_id:", order_id);
            try {
                const query = {
                    text: "SELECT * FROM orders WHERE order_id = $1",
                    values: [order_id],
                };
                const result = await client.query(query);
                
                if (result.rows.length > 0) {
                    const order = result.rows[0];
                    if (order.order_time && typeof order.order_time === 'string') {
                        order.order_time = new Date(order.order_time);
                    }
                    return order;
                }
                return null;
            } catch (err) {
                console.error("Error fetching order:", err);
                throw new Error("Failed to fetch order");
            }
        },
    },
    
    Mutation: {
        addOrder: async (_, { order, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: addOrder called with params:", { order, user_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_add_order($1, $2, $3, $4) as result",
                    values: [
                        user_id,
                        order.order_id,
                        order.table_id,
                        order.status
                    ],
                };
                const result = await client.query(query);
                
                const pgResponse = result.rows[0].result;
                console.log("Add Order Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error adding order:", err);
                throw new Error("Failed to add order: " + err.message);
            }
        },
        
        editOrder: async (_, { order_id, order, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: editOrder called with params:", { order_id, order, user_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_edit_order($1, $2, $3, $4) as result",
                    values: [
                        user_id,
                        order_id,
                        order.table_id || null,
                        order.status || null
                    ],
                };
                const result = await client.query(query);
                
                const pgResponse = result.rows[0].result;
                console.log("Edit Order Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error editing order:", err);
                throw new Error("Failed to edit order: " + err.message);
            }
        },
        
        deleteOrder: async (_, { order_id, user_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: deleteOrder called with params:", { order_id, user_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_delete_order($1, $2) as result",
                    values: [
                        user_id,
                        order_id
                    ],
                };
                const result = await client.query(query);
                
                const pgResponse = result.rows[0].result;
                console.log("Delete Order Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error deleting order:", err);
                throw new Error("Failed to delete order: " + err.message);
            }
        },
    },
    
    DateTime: DateTimeScalar
};