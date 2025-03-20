import bcrypt from "bcrypt";
import { client } from "../helpers/dbHelper.js";

await client.connect();

export const usersResolver = {
    Query: {
        users: async () => {
            try {
                const query = {
                    text: "SELECT * FROM users",
                };
                const result = await client.query(query);
                return result.rows;
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch users");
            }
        },

        user: async (_, { id }) => {
            try {
                const query = {
                    text: "SELECT * FROM users WHERE user_id = $1",
                    values: [id],
                };
                const result = await client.query(query);
                return result.rows[0];
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to fetch user");
            }
        },
    },

    Mutation: {
        addUser: async (_, { user, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            try {
                const hashedPassword = await bcrypt.hash(user.password, 10);
        
                const query = {
                    text: "SELECT fn_add_user($1, $2, $3, $4, $5) as result",
                    values: [admin_id, user.user_id, user.username, hashedPassword, user.user_type],
                };
                
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Add User Result:", pgResponse);
                
                let content = [];
                if (pgResponse.content) {
                    content = [pgResponse.content];
                }
                
                return {
                    content: content,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to add user: " + err.message);
            }
        },

        editUser: async (_, { id, user, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            try {
                let hashedPassword = null;
                
                if (user.password) {
                    hashedPassword = await bcrypt.hash(user.password, 10);
                }

                const query = {
                    text: "SELECT fn_edit_user($1, $2, $3, $4, $5) as result",
                    values: [admin_id, id, user.username, hashedPassword, user.user_type],
                };
                
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Edit User Result:", pgResponse);
                
                let content = [];
                if (pgResponse.content) {
                    content = [pgResponse.content];
                }
                
                return {
                    content: content,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error:", err);
                throw new Error(err.message || "Failed to update user");
            }
        },

        deleteUser: async (_, { id, admin_id }, context) => {
            // Check context for errors
            if (context?.type === "error") {
                return {
                    type: "ERROR",
                    message: context.message,
                    content: []
                };
            }

            try {
                const query = {
                    text: "SELECT fn_delete_user($1, $2) as result",
                    values: [admin_id, id],
                };
                
                const result = await client.query(query);
                const pgResponse = result.rows[0].result;
                
                console.log("Delete User Result:", pgResponse);
                
                let content = [];
                if (pgResponse.content) {
                    content = [pgResponse.content];
                }
                
                return {
                    content: content,
                    type: pgResponse.type.toUpperCase(),
                    message: pgResponse.message
                };
            } catch (err) {
                console.error("Error:", err);
                throw new Error(err.message || "Failed to delete user");
            }
        },
    },
};