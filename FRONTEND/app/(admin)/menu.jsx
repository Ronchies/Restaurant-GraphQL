import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import globalStyles from "../../assets/styles/globalStyles";
import menuStyles from "../../assets/styles/menu";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import GET_MENUS from "../queries/menuQueries";
import { ADD_MENU, UPDATE_MENU, DELETE_MENU } from "../mutations/menuMutation";

export default function Menu() {
  // State for modals
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  // State for current menu item being edited or deleted
  const [currentMenu, setCurrentMenu] = useState(null);
  
  // State for form inputs
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [prepTime, setPrepTime] = useState("15");
  const [isAvailable, setIsAvailable] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin on component mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Function to check if the current user is an admin
  const checkAdminStatus = async () => {
    try {
      const userType = await SecureStore.getItemAsync("user_type");
      const userId = await SecureStore.getItemAsync("user_id");
      const token = await SecureStore.getItemAsync("user_token");
      
      console.log("Auth details:");
      console.log("- User type:", userType);
      console.log("- User ID:", userId);
      console.log("- Token exists:", !!token);
      
      // Check if we have valid credentials
      if (userType && userType.toLowerCase() === "admin" && userId) {
        console.log("✅ Valid admin credentials found");
        setIsAdmin(true);
        setAdminId(parseInt(userId));
      } else {
        // Set hardcoded admin for development/testing
        console.warn("⚠️ Admin check failed - USING FALLBACK ADMIN ID FOR TESTING");
        
        // DEVELOPMENT ONLY: Set fallback admin credentials
        // ⚠️ Remove this in production!
        setIsAdmin(true);
        setAdminId(1); // Using ID 1 as fallback admin ID
        
        // Alert developer about the issue
        Alert.alert(
          "Development Mode", 
          "Using fallback admin ID 1 for testing. In production, proper authentication will be required.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      
      // DEVELOPMENT ONLY: Set fallback admin credentials
      console.warn("⚠️ Setting fallback admin ID due to error");
      setIsAdmin(true);
      setAdminId(1);
    }
  };

  // Fetch menu data using Apollo Client with better error handling
  const { loading, error, data, refetch } = useQuery(GET_MENUS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("✅ Menu items fetched successfully:", data?.menus?.length || 0, "items found");
    },
    onError: (error) => {
      console.error("❌ Error fetching menu items:", error);
      Alert.alert("Error", "Failed to load menu items: " + error.message);
    }
  });

  // Get all menu items
  const menuItems = data?.menus || [];
  
  // Setup mutations with improved error handling
  const [addMenu, { loading: addLoading }] = useMutation(ADD_MENU, {
    onCompleted: (data) => {
      console.log("📥 Add menu response:", JSON.stringify(data, null, 2));
      if (data?.addMenu?.content) {
        Alert.alert("Success", "Menu item added successfully");
        refetch();
        resetForm();
        setAddModalVisible(false);
      } else {
        const errorMsg = data?.addMenu?.message || "Unknown error occurred";
        console.error("❌ Failed to add menu item:", errorMsg);
        Alert.alert("Failed to add menu item", errorMsg);
      }
    },
    onError: (error) => {
      console.error("❌ Error adding menu item:", error);
      Alert.alert("Error", "Failed to add menu item: " + error.message);
    }
  });
  
  const [updateMenu, { loading: updateLoading }] = useMutation(UPDATE_MENU, {
    onCompleted: (data) => {
      console.log("📥 Update menu response:", JSON.stringify(data, null, 2));
      // Fix: Check for editMenu instead of updateMenu in the response
      if (data?.editMenu?.content) {
        Alert.alert("Success", "Menu item updated successfully");
        refetch();
        resetForm();
        setEditModalVisible(false);
      } else {
        const errorMsg = data?.editMenu?.message || "Unknown error occurred";
        console.error("❌ Failed to update menu item:", errorMsg);
        Alert.alert("Failed to update menu item", errorMsg);
      }
    },
    onError: (error) => {
      console.error("❌ Error updating menu item:", error);
      Alert.alert("Error", "Failed to update menu item: " + error.message);
    }
  });
  
  const [deleteMenu, { loading: deleteLoading }] = useMutation(DELETE_MENU, {
    onCompleted: (data) => {
      console.log("📥 Delete menu response:", JSON.stringify(data, null, 2));
      if (data?.deleteMenu?.content) {
        Alert.alert("Success", "Menu item deleted successfully");
        refetch();
        setDeleteConfirmVisible(false);
        setCurrentMenu(null);
      } else {
        const errorMsg = data?.deleteMenu?.message || "Unknown error occurred";
        console.error("❌ Failed to delete menu item:", errorMsg);
        Alert.alert("Failed to delete menu item", errorMsg);
      }
    },
    onError: (error) => {
      console.error("❌ Error deleting menu item:", error);
      Alert.alert("Error", "Failed to delete menu item: " + error.message);
    }
  });

  // Function to reset form fields
  const resetForm = () => {
    setMenuName("");
    setPrice("");
    setDiscount("0");
    setPrepTime("15");
    setIsAvailable(true);
    setCurrentMenu(null);
  };

  // Function to open edit modal with current item data
  const handleEdit = (menuItem) => {
    console.log("Setting up edit form for menu item:", menuItem);
    setCurrentMenu(menuItem);
    setMenuName(menuItem.menu_name);
    setPrice(menuItem.price.toString());
    setDiscount(menuItem.discount ? menuItem.discount.toString() : "0");
    setPrepTime(menuItem.preparation_time.toString());
    setIsAvailable(menuItem.is_available);
    setEditModalVisible(true);
  };

  // Function to open delete confirmation
  const handleDeleteConfirm = (menuItem) => {
    console.log("Opening delete confirmation for menu item:", menuItem);
    setCurrentMenu(menuItem);
    setDeleteConfirmVisible(true);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      console.log("Logging out...");

      // Remove tokens from SecureStore
      await SecureStore.deleteItemAsync("user_token");
      await SecureStore.deleteItemAsync("user_type");
      await SecureStore.deleteItemAsync("user_id");

      console.log("Tokens removed successfully");

      // Navigate back to tabs index
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Function to submit new menu item with improved validation
  const handleAddSubmit = () => {
    if (!menuName || !price) {
      Alert.alert("Error", "Menu name and price are required");
      return;
    }
    
    if (!adminId) {
      console.error("Admin ID is missing:", adminId);
      Alert.alert("Error", "Admin ID not available. Please check console logs.");
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "Price must be a valid positive number");
      return;
    }
    
    console.log("📤 Sending add menu request with data:");
    console.log({
      menu_id: Math.floor(Math.random() * 1000),
      menu_name: menuName,
      price: priceValue,
      discount: parseFloat(discount || 0),
      preparation_time: parseInt(prepTime),
      is_available: isAvailable,
      adminId
    });
    
    addMenu({
      variables: {
        menu: {
          menu_id: Math.floor(Math.random() * 1000), // Generate random ID for new menu
          menu_name: menuName,
          price: priceValue,
          discount: parseFloat(discount || 0),
          preparation_time: parseInt(prepTime),
          is_available: isAvailable
        },
        adminId
      }
    });
  };

  // Function to submit edited menu item with improved validation
  const handleEditSubmit = () => {
    if (!menuName || !price) {
      Alert.alert("Error", "Menu name and price are required");
      return;
    }
    
    if (!adminId) {
      console.error("Admin ID is missing:", adminId);
      Alert.alert("Error", "Admin ID not available. Please check console logs.");
      return;
    }
    
    if (!currentMenu || !currentMenu.menu_id) {
      console.error("Current menu ID is missing:", currentMenu);
      Alert.alert("Error", "Menu ID for editing is missing");
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "Price must be a valid positive number");
      return;
    }
    
    console.log("📤 Sending update menu request:");
    console.log("- Menu ID:", currentMenu.menu_id);
    console.log("- Admin ID:", adminId);
    console.log("- Menu input:", {
      menu_name: menuName,
      price: priceValue,
      discount: parseFloat(discount || 0),
      preparation_time: parseInt(prepTime),
      is_available: isAvailable
    });
    
    updateMenu({
      variables: {
        menuId: currentMenu.menu_id,
        menu: {
          menu_name: menuName,
          price: priceValue,
          discount: parseFloat(discount || 0),
          preparation_time: parseInt(prepTime),
          is_available: isAvailable
        },
        adminId
      }
    });
  };

  // Function to execute delete with improved validation
  const handleDelete = () => {
    if (!adminId) {
      console.error("Admin ID is missing:", adminId);
      Alert.alert("Error", "Admin ID not available. Please check console logs.");
      return;
    }
    
    if (!currentMenu || !currentMenu.menu_id) {
      console.error("Current menu ID is missing:", currentMenu);
      Alert.alert("Error", "Menu ID for deletion is missing");
      return;
    }
    
    console.log("📤 Sending delete menu request:");
    console.log("- Menu ID:", currentMenu.menu_id);
    console.log("- Admin ID:", adminId);
    
    deleteMenu({
      variables: {
        menuId: currentMenu.menu_id,
        adminId
      }
    });
  };

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with Menu and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Menu</Text>
          </View>
          <View style={globalStyles.layout.headerRight}>
            {isAdmin && (
              <TouchableOpacity 
                style={menuStyles.addButton}
                onPress={() => {
                  resetForm();
                  setAddModalVisible(true);
                }}
              >
                <FontAwesome5 name="plus" size={20} color="white" />
                <Text style={menuStyles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
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

        {/* Loading or Error State with better UI feedback */}
        {loading && (
          <View style={menuStyles.loadingContainer}>
            <ActivityIndicator size="large" color={globalStyles.colors.primary} />
            <Text style={menuStyles.loadingText}>Loading menu items...</Text>
          </View>
        )}
        
        {error && (
          <View style={menuStyles.errorContainer}>
            <Text style={menuStyles.errorText}>
              Error loading menu items: {error.message}
            </Text>
            <TouchableOpacity 
              style={menuStyles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={menuStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu Items */}
        {data && (
          <View style={menuStyles.menuList}>
            {menuItems.length === 0 ? (
              <View style={menuStyles.emptyContainer}>
                <Text style={menuStyles.emptyText}>No menu items found. Add your first menu item!</Text>
              </View>
            ) : (
              menuItems.map((item, index) => (
                <View key={index} style={menuStyles.menuItemCard}>
                  <View style={menuStyles.menuItemContent}>
                    <View style={menuStyles.menuItemInfo}>
                      <Text style={menuStyles.menuItemName}>{item.menu_name}</Text>
                      <Text style={menuStyles.menuItemCategory}>
                        {item.preparation_time} min
                      </Text>
                      <Text style={menuStyles.menuItemPrice}>
                        ${parseFloat(item.price).toFixed(2)}
                        {item.discount > 0 && (
                          <Text style={menuStyles.discountText}> -{item.discount}% OFF</Text>
                        )}
                      </Text>
                    </View>

                    <View style={menuStyles.menuItemRight}>
                      <View style={[
                        menuStyles.availabilityBadge,
                        !item.is_available && menuStyles.soldOutBadge
                      ]}>
                        <Text style={[
                          menuStyles.availabilityText,
                          !item.is_available && menuStyles.soldOutText
                        ]}>
                          {item.is_available ? "Available" : "Sold Out"}
                        </Text>
                      </View>

                      {isAdmin && (
                        <View style={menuStyles.menuItemActions}>
                          <TouchableOpacity 
                            style={menuStyles.actionButton}
                            onPress={() => handleEdit(item)}
                          >
                            <FontAwesome5
                              name="edit"
                              size={20}
                              color="#007AFF"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={menuStyles.actionButton}
                            onPress={() => handleDeleteConfirm(item)}
                          >
                            <FontAwesome5 name="trash" size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
        
        {/* Add Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => {
            resetForm();
            setAddModalVisible(false);
          }}
        >
          <View style={menuStyles.modalOverlay}>
            <View style={menuStyles.modalView}>
              <Text style={menuStyles.modalTitle}>Add New Menu Item</Text>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Menu Name</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter menu name"
                  value={menuName}
                  onChangeText={setMenuName}
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Price ($)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Discount (%)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter discount percentage"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Preparation Time (minutes)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter preparation time"
                  value={prepTime}
                  onChangeText={setPrepTime}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={menuStyles.switchContainer}>
                <Text style={menuStyles.label}>Available</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isAvailable ? "#007AFF" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsAvailable}
                  value={isAvailable}
                />
              </View>
              
              <View style={menuStyles.modalActions}>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.cancelButton]}
                  onPress={() => {
                    resetForm();
                    setAddModalVisible(false);
                  }}
                >
                  <Text style={menuStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.saveButton]}
                  onPress={handleAddSubmit}
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={menuStyles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Edit Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => {
            resetForm();
            setEditModalVisible(false);
          }}
        >
          <View style={menuStyles.modalOverlay}>
            <View style={menuStyles.modalView}>
              <Text style={menuStyles.modalTitle}>Edit Menu Item</Text>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Menu Name</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter menu name"
                  value={menuName}
                  onChangeText={setMenuName}
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Price ($)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Discount (%)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter discount percentage"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={menuStyles.formGroup}>
                <Text style={menuStyles.label}>Preparation Time (minutes)</Text>
                <TextInput
                  style={menuStyles.input}
                  placeholder="Enter preparation time"
                  value={prepTime}
                  onChangeText={setPrepTime}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={menuStyles.switchContainer}>
                <Text style={menuStyles.label}>Available</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isAvailable ? "#007AFF" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsAvailable}
                  value={isAvailable}
                />
              </View>
              
              <View style={menuStyles.modalActions}>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.cancelButton]}
                  onPress={() => {
                    resetForm();
                    setEditModalVisible(false);
                  }}
                >
                  <Text style={menuStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.saveButton]}
                  onPress={handleEditSubmit}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={menuStyles.buttonText}>Update</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Delete Confirmation Dialog */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteConfirmVisible}
          onRequestClose={() => {
            setDeleteConfirmVisible(false);
            setCurrentMenu(null);
          }}
        >
          <View style={menuStyles.modalOverlay}>
            <View style={menuStyles.confirmDialog}>
              <Text style={menuStyles.confirmTitle}>Delete Menu Item</Text>
              <Text style={menuStyles.confirmText}>
                Are you sure you want to delete "{currentMenu?.menu_name}"? 
                This action cannot be undone.
              </Text>
              
              <View style={menuStyles.modalActions}>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.cancelButton]}
                  onPress={() => {
                    setDeleteConfirmVisible(false);
                    setCurrentMenu(null);
                  }}
                >
                  <Text style={menuStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[menuStyles.modalButton, menuStyles.deleteButton]}
                  onPress={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={menuStyles.buttonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}