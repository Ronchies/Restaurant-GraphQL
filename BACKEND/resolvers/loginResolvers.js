import bcrypt from "bcrypt";
import { client } from "../helpers/dbHelper.js";
import generateToken from "../helpers/tokenHelper.js"; 

export const loginResolver = {
  Mutation: {
    loginUser: async (_, { username, password }) => {
      try {
        // Query to get the user with the provided username
        const userQuery = {
          text: "SELECT * FROM users WHERE username = $1",
          values: [username],
        };
        
        const userResult = await client.query(userQuery);
        const user = userResult.rows[0];
        
        // If no user found with that username
        if (!user) {
          return {
            token: null,
            user: null,
            type: "ERROR",
            message: "Invalid username or password",
          };
        }
        
        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
          // Generate JWT token
          const token = await generateToken({
            username: user.username,
            user_type: user.user_type, // Assuming user_type exists in your user table
          });

          // Call the user_login function for consistency (if still needed)
          const loginQuery = {
            text: "SELECT public.fn_user_login($1, $2) as response",
            values: [username, user.password],
          };
          
          const result = await client.query(loginQuery);
          const pgResponse = result.rows[0].response;
          
          console.log("Login Result:", pgResponse);
          
          return {
            token, // Return the generated token
            user: pgResponse.content || user, // Use the user from pgResponse or the queried user
            type: pgResponse.type.toUpperCase(),
            message: pgResponse.message,
          };
        } else {
          return {
            token: null,
            user: null,
            type: "ERROR",
            message: "Invalid username or password",
          };
        }
      } catch (err) {
        console.error("Error:", err);
        return {
          token: null,
          user: null,
          type: "ERROR",
          message: "Failed to login: " + err.message,
        };
      }
    },
  },
};