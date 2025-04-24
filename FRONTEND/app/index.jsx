// app/index.jsx
import { useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("user_token");
        const userType = await SecureStore.getItemAsync("user_type");

        if (!token || !userType) {
          router.replace("/(tabs)");
        } else if (userType === "user") {
          router.replace("/(user)/index");
        } else if (userType === "admin") {
          router.replace("/(admin)/index");
        } else {
          router.replace("/(tabs)");
        }
      } catch (e) {
        console.error("Error checking auth:", e);
        router.replace("/(tabs)");
      }
    };

    checkAuth();
  }, []);
}