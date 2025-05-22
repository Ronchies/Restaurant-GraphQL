// helpers/tokenExpirationHelper.js
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Function to decode JWT token and check expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT token (base64 decode the payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Check if token is expired
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Consider invalid tokens as expired
  }
};

// Function to handle automatic logout
const handleAutoLogout = async () => {
  try {
    console.log("Token expired - Auto logging out...");

    // Remove tokens from SecureStore
    await SecureStore.deleteItemAsync("user_token");
    await SecureStore.deleteItemAsync("user_type");

    console.log("Tokens removed successfully");

    // Navigate back to tabs index
    router.replace("/(tabs)");
  } catch (error) {
    console.error("Error during auto logout:", error);
  }
};

// Main function to check token and handle expiration
export const checkTokenExpiration = async () => {
  try {
    const token = await SecureStore.getItemAsync("user_token");
    
    if (!token) {
      console.log("No token found");
      router.replace("/(tabs)");
      return false;
    }

    if (isTokenExpired(token)) {
      await handleAutoLogout();
      return false;
    }

    return true; // Token is valid
  } catch (error) {
    console.error("Error checking token expiration:", error);
    await handleAutoLogout();
    return false;
  }
};

// Function to set up periodic token checking
export const startTokenExpirationCheck = (intervalMs = 30000) => { // Check every 30 seconds
  const interval = setInterval(async () => {
    const isValid = await checkTokenExpiration();
    if (!isValid) {
      clearInterval(interval); // Stop checking if token is invalid
    }
  }, intervalMs);

  return interval; // Return interval ID so it can be cleared if needed
};

// Function to stop token expiration checking
export const stopTokenExpirationCheck = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

export default {
  checkTokenExpiration,
  startTokenExpirationCheck,
  stopTokenExpirationCheck,
};