import { client } from "../helpers/dbHelper.js";
import { TimeScalar } from "../helpers/scalarHandler.js";

export const menuResolver = {
    Query: {
        menus: async () => {
            console.log("Query: menus called");
            try {
                const query = {
                    text: "SELECT * FROM menu",
                };
                const result = await client.query(query);
                
                // Format the preparation_time before returning
                return result.rows.map(menu => {
                    if (menu.preparation_time && typeof menu.preparation_time === 'object') {
                        // Convert the interval object to a string format
                        const minutes = menu.preparation_time.minutes || 0;
                        const hours = menu.preparation_time.hours || 0;
                        menu.preparation_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
                    }
                    return menu;
                });
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch menu items");
            }
        },
        
        menu: async (_, { menu_id }) => {
            console.log("Query: menu called with menu_id:", menu_id);
            
            try {
                const query = {
                    text: "SELECT * FROM menu WHERE menu_id = $1",
                    values: [menu_id],
                };
                const result = await client.query(query);
                
                if (result.rows.length > 0) {
                    const menu = result.rows[0];
                    // Format the preparation_time
                    if (menu.preparation_time && typeof menu.preparation_time === 'object') {
                        const minutes = menu.preparation_time.minutes || 0;
                        const hours = menu.preparation_time.hours || 0;
                        menu.preparation_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
                    }
                    return menu;
                }
                return null;
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch menu item");
            }
        },

        calculateDiscountedPrice: async (_, { menu_id }) => {
            console.log("Query: calculateDiscountedPrice called with menu_id:", menu_id);
            try {
                const query = {
                    text: "SELECT public.fn_calculate_discounted_price($1) as discounted_price",
                    values: [menu_id],
                };
                const result = await client.query(query);
                
                if (result.rows.length > 0) {
                    return parseFloat(result.rows[0].discounted_price);
                }
                throw new Error("Failed to calculate discounted price");
            } catch (err) {
                console.error("Error calculating discounted price:", err);
                throw new Error("Failed to calculate discounted price: " + err.message);
            }
        },
    },
    
    Mutation: {
        addMenu: async (_, { menu, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: addMenu called with params:", { menu, admin_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_add_menu($1, $2, $3, $4, $5, $6, $7) as result",
                    values: [
                        admin_id, 
                        menu.menu_id, 
                        menu.menu_name, 
                        menu.price, 
                        menu.discount || 0, 
                        menu.preparation_time || '00:30:00', 
                        menu.is_available === undefined ? true : menu.is_available
                    ],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Add Menu Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error adding menu:", err);
                throw new Error("Failed to add menu: " + err.message);
            }
        },
        
        editMenu: async (_, { menu_id, menu, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: editMenu called with params:", { menu_id, menu, admin_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_edit_menu($1, $2, $3, $4, $5, $6, $7) as result",
                    values: [
                        admin_id, 
                        menu_id, 
                        menu.menu_name, 
                        menu.price, 
                        menu.discount, 
                        menu.preparation_time, 
                        menu.is_available
                    ],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Edit Menu Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error editing menu:", err);
                throw new Error("Failed to edit menu: " + err.message);
            }
        },
        
        deleteMenu: async (_, { menu_id, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: deleteMenu called with params:", { menu_id, admin_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_delete_menu($1, $2) as result",
                    values: [admin_id, menu_id],
                };
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Delete Menu Result:", pgResponse);
                
                return {
                    content: pgResponse.content,
                    type: pgResponse.type,
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error deleting menu:", err);
                throw new Error("Failed to delete menu: " + err.message);
            }
        }
    },
    
    Time: TimeScalar
};