import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import globalStyles from "../../assets/styles/globalStyles"; // Update the path as needed
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { 
  checkTokenExpiration, 
  startTokenExpirationCheck, 
  stopTokenExpirationCheck 
} from "../helpers/tokenExpirationHelper"; // Update the path as needed

export default function Tab() {
  const tokenCheckInterval = useRef(null);

  // Mock data
  const orderData = [
    { id: "1", table: "3", time: "10:30:00 AM", status: "Served" },
    { id: "1", table: "3", time: "10:30:00 AM", status: "Served" },
    { id: "1", table: "3", time: "10:30:00 AM", status: "Served" },
  ];

  // Check token expiration when component mounts
  useEffect(() => {
    const initializeTokenCheck = async () => {
      // Check token on mount
      const isValid = await checkTokenExpiration();
      
      if (isValid) {
        // Start periodic checking if token is valid
        tokenCheckInterval.current = startTokenExpirationCheck(30000); // Check every 30 seconds
      }
    };

    initializeTokenCheck();

    // Cleanup on unmount
    return () => {
      if (tokenCheckInterval.current) {
        stopTokenExpirationCheck(tokenCheckInterval.current);
      }
    };
  }, []);

  // Manual logout function (for the logout button)
  const handleLogout = async () => {
    try {
      console.log("Manual logout...");

      // Stop token checking
      if (tokenCheckInterval.current) {
        stopTokenExpirationCheck(tokenCheckInterval.current);
      }

      // Remove tokens from SecureStore
      await SecureStore.deleteItemAsync("user_token");
      await SecureStore.deleteItemAsync("user_type");

      console.log("Tokens removed successfully");

      // Navigate back to tabs index
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with Overview and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Overview</Text>
          </View>
          <View style={globalStyles.layout.headerRight}>
            <TouchableOpacity style={globalStyles.icons.bell}>
              <FontAwesome5 name="bell" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.icons.bell}
              onPress={handleLogout}
            >
              <FontAwesome5 name="sign-out-alt" size={24} color="black" />
            </TouchableOpacity>
            <View style={globalStyles.icons.profile}>
              <Text style={globalStyles.text.profileText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ marginBottom: globalStyles.spacing.large }}>
          <View style={globalStyles.layout.spaceBetween}>
            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text
                  style={{ fontSize: globalStyles.typography.fontSize.large }}
                >
                  📋
                </Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Active Orders</Text>
                <Text style={globalStyles.text.statsValue}>456</Text>
              </View>
            </View>

            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text
                  style={{ fontSize: globalStyles.typography.fontSize.large }}
                >
                  🍽️
                </Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>
                  Available Tables
                </Text>
                <Text style={globalStyles.text.statsValue}>10</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: globalStyles.spacing.large,
            }}
          >
            <View style={{
              ...globalStyles.cards.stats,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
              <View style={globalStyles.icons.statsBlue}>
                <Text
                  style={{ fontSize: globalStyles.typography.fontSize.large }}
                >
                  $
                </Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Total Revenue</Text>
                <Text style={globalStyles.text.statsValue}>50,000k</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Status Section */}
        <View style={globalStyles.cards.standard}>
          <Text style={globalStyles.text.sectionTitle}>Order Status</Text>

          {orderData.map((order, index) => (
            <View key={index} style={globalStyles.listItems.order}>
              <View style={globalStyles.listItems.orderInfo}>
                <Text style={globalStyles.text.orderTitle}>
                  Order #{order.id} - Table {order.table}
                </Text>
                <Text style={globalStyles.text.orderTime}>{order.time}</Text>
              </View>
              <View style={globalStyles.listItems.orderActions}>
                <View style={globalStyles.badges.success}>
                  <Text style={globalStyles.text.statusText}>
                    {order.status}
                  </Text>
                </View>
                <View style={globalStyles.buttons.view}>
                  <Text style={globalStyles.buttons.viewText}>View</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}