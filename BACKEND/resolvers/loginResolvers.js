import bcrypt from "bcrypt";
import { client } from "../helpers/dbHelper.js";

export const loginResolver = {
  Mutation: {
    loginUser: async (_, { username, password }) => {
      try {
        // First query to get the user with the provided username
        const userQuery = {
          text: "SELECT * FROM users WHERE username = $1",
          values: [username],
        };
        
        const userResult = await client.query(userQuery);
        const user = userResult.rows[0];
        
        // If no user found with that username
        if (!user) {
          return {
            content: [],
            type: "ERROR",
            message: "Invalid username or password"
          };
        }
        
        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
          // Call the user_login function for consistency with your existing code
          const loginQuery = {
            text: "SELECT public.fn_user_login($1, $2) as response",
            values: [username, user.password], // Using the actual stored password here
          };
          
          const result = await client.query(loginQuery);
          const pgResponse = result.rows[0].response;
          
          console.log("Login Result:", pgResponse);
          
          let content = [];
          if (pgResponse.content) {
            // Wrap the user object in an array to match your response format
            content = [pgResponse.content];
          }
          
          return {
            content: content,
            type: pgResponse.type.toUpperCase(),
            message: pgResponse.message
          };
        } else {
          return {
            content: [],
            type: "ERROR",
            message: "Invalid username or password"
          };
        }
      } catch (err) {
        console.error("Error:", err);
        return {
          content: [],
          type: "ERROR",
          message: "Failed to login: " + err.message
        };
      }
    }
  }
};