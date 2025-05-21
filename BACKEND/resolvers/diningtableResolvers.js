import { client } from "../helpers/dbHelper.js";

export const diningtableResolvers = {
    Query: {
        diningtables: async () => {
            console.log("Query: diningtables called");
            try {
                const query = {
                    // If is_table_available doesn't exist, just query the table directly
                    text: "SELECT * FROM diningtable",
                };
                const result = await client.query(query);
                
                // Set is_available for each row
                // Since we don't have the actual function implementation, 
                // we'll assume all tables are available for now
                return result.rows.map(row => ({
                    ...row,
                    is_available: true // You'll need to implement the actual availability logic
                }));
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch diningtables");
            }
        },

        diningtable: async (_, { table_id }) => {
            console.log("Query: diningtable called with table_id:", table_id);
            try {
                const query = {
                    text: "SELECT * FROM diningtable WHERE table_id = $1",
                    values: [table_id],
                };
                const result = await client.query(query);
                
                if (result.rows.length === 0) {
                    return null;
                }
                
                // Set is_available for the row
                return {
                    ...result.rows[0],
                    is_available: true // You'll need to implement the actual availability logic
                };
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch diningtable");
            }
        },

        isTableAvailable: async (_, { table_id }) => {
            console.log("Query: isTableAvailable called with table_id:", table_id);
            try {
                // If the PostgreSQL function doesn't exist, we can implement the logic here
                // For now, assuming all tables are available
                return true;
                
                // When you implement the PostgreSQL function, use this:
                /*
                const query = {
                    text: "SELECT fn_is_table_available($1) as is_available",
                    values: [table_id],
                };
                const result = await client.query(query);
                return result.rows[0].is_available;
                */
            } catch (err) {
                console.error("Error checking table availability:", err);
                throw new Error("Failed to check table availability");
            }
        },
    },
    
    Mutation: {
        addDiningTable: async (_, { diningTable, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                   content: []
                };
            }

            console.log("Mutation: addDiningTable called with params:", { diningTable, admin_id });
            try {
                const query = {
                    text: "SELECT * FROM fn_add_dining_table($1, $2, $3) as result",
                    values: [admin_id, diningTable.table_id, diningTable.table_name],
                };
                const result = await client.query(query);
                
                const pgResponse = result.rows[0].result;
                
                console.log("Add Dining Table Result:", pgResponse);
                
                // Add is_available to the response content
                const responseContent = pgResponse.content || [];
                
                // Ensure the response includes the is_available field
                const enhancedContent = {
                    ...responseContent,
                    is_available: true // Setting a default value for new tables
                };
                
                return {
                    content: enhancedContent,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error adding dining table:", err);
                throw new Error("Failed to add dining table: " + err.message);
            }
        },
        
        editDiningTable: async (_, { table_id, diningTable, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: editDiningTable called with params:", { table_id, diningTable, admin_id });
            try {
                const query = {
                    text: "SELECT fn_edit_dining_table($1, $2, $3) as result",
                    values: [admin_id, table_id, diningTable.table_name],
                };
                
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Edit Dining Table Result:", pgResponse);
                
                // Add is_available to the response content
                const responseContent = pgResponse.content || [];
                
                const enhancedContent = {
                    ...responseContent,
                    is_available: true // You can implement actual availability logic here
                };
                
                return {
                    content: enhancedContent,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error editing dining table:", err);
                throw new Error(err.message || "Failed to update dining table");
            }
        },
        
        deleteDiningTable: async (_, { table_id, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            console.log("Mutation: deleteDiningTable called with params:", { table_id, admin_id });
            try {
                const query = {
                    text: "SELECT fn_delete_dining_table($1, $2) as result",
                    values: [admin_id, table_id],
                };
                
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Delete Dining Table Result:", pgResponse);
                
                // For delete operations, we don't need to add is_available
                // as the table is being removed, but we'll include it for consistency
                const responseContent = pgResponse.content || [];
                
                const enhancedContent = {
                    ...responseContent,
                    is_available: false // Deleted tables are not available
                };
                
                return {
                    content: enhancedContent,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error deleting dining table:", err);
                throw new Error(err.message || "Failed to delete dining table");
            }
        },
    },
};