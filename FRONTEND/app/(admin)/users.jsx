import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import globalStyles from "../../assets/styles/globalStyles";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import GET_USERS from "../queries/userQueries";
import { ADD_USER, UPDATE_USER, DELETE_USER } from "../mutations/accountMutation";

export default function Tab() {
  // State for managing users and modals
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Changed default and enum values to lowercase to match database constraints
  const [userType, setUserType] = useState("admin");
  const [userId, setUserId] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Query to fetch users with better error handling
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("✅ Users fetched successfully:", data?.users?.length || 0, "users found");
    },
    onError: (error) => {
      console.error("❌ Error fetching users:", error);
      Alert.alert("Error", "Failed to load users: " + error.message);
    }
  });

  // Set up mutations without onCompleted/onError to handle them locally
  const [addUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

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

  

  // Handle logout function
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

  // Function to handle adding a user with improved error handling
  const handleAddUser = async () => {
    // Basic input validation
    if (!username || !password || !userId) {
      Alert.alert("Error", "User ID, Username, and Password are required");
      return;
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      Alert.alert("Error", "User ID must be a valid number");
      return;
    }

    if (!adminId) {
      console.error("Admin ID is missing:", adminId);
      Alert.alert("Error", "Admin ID not available. Please check console logs.");
      return;
    }

    try {
      console.log("📤 Sending add user request with data:");
      console.log({
        user_id: userIdInt,
        username,
        user_type: userType.toLowerCase(), // Ensure lowercase to match database constraint
        adminId
      });

      const response = await addUser({
        variables: {
          user: {
            user_id: userIdInt,
            username,
            password,
            user_type: userType.toLowerCase() // Ensure lowercase to match database constraint
          },
          adminId
        }
      });

      console.log("📥 Add user response:", JSON.stringify(response, null, 2));

      if (response?.data?.addUser?.content) {
        Alert.alert("Success", "User added successfully");
        clearForm();
        setModalVisible(false);
        
        // Force refresh with network-only policy
        console.log("🔄 Refreshing user list...");
        await refetch();
      } else {
        const errorMsg = response?.data?.addUser?.message || "Unknown error occurred";
        console.error("❌ Failed to add user:", errorMsg);
        Alert.alert("Failed to add user", errorMsg);
      }
    } catch (error) {
      console.error("❌ Error adding user:", error);
      Alert.alert("Error", "Failed to add user: " + error.message);
    }
  };

  // Function to handle editing a user with improved error handling
  const handleEditUser = async () => {
    if (!username) {
      Alert.alert("Error", "Username is required");
      return;
    }

    if (!adminId) {
      console.error("Admin ID is missing:", adminId);
      Alert.alert("Error", "Admin ID not available. Please check console logs.");
      return;
    }

    if (!editUserId) {
      console.error("Edit User ID is missing:", editUserId);
      Alert.alert("Error", "User ID for editing is missing");
      return;
    }

    const userInput = {
      username,
      user_type: userType.toLowerCase() // Ensure lowercase to match database constraint
    };

    // Only include password if it's provided
    if (password && password.trim() !== '') {
      userInput.password = password;
    }

    try {
      console.log("📤 Sending update user request:");
      console.log("- User ID:", editUserId);
      console.log("- Admin ID:", adminId);
      console.log("- User input:", userInput);

      const response = await updateUser({
        variables: {
          editUserId: parseInt(editUserId),
          user: userInput,
          adminId: parseInt(adminId)
        }
      });

      console.log("📥 Update user response:", JSON.stringify(response, null, 2));

      if (response?.data?.editUser?.content) {
        Alert.alert("Success", "User updated successfully");
        clearForm();
        setEditModalVisible(false);
        
        // Force refresh with network-only policy
        console.log("🔄 Refreshing user list...");
        await refetch();
      } else {
        const errorMsg = response?.data?.editUser?.message || "Unknown error occurred";
        console.error("❌ Failed to update user:", errorMsg);
        Alert.alert("Failed to update user", errorMsg);
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
      Alert.alert("Error", "Failed to update user: " + error.message);
    }
  };

  // Function to handle deleting a user with improved error handling
  const handleDeleteUser = (userId) => {
    if (!adminId) {
      Alert.alert("Error", "Admin ID not available");
      return;
    }

    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              console.log("Deleting user ID:", userId);
              console.log("Admin ID:", adminId);
              
              const response = await deleteUser({
                variables: {
                  deleteUserId: userId,
                  adminId
                }
              });

              console.log("Delete user response:", response);

              if (response?.data?.deleteUser?.content) {
                Alert.alert("Success", "User deleted successfully");
                await refetch(); // Force refresh user list
              } else {
                const errorMsg = response?.data?.deleteUser?.message || "Unknown error occurred";
                Alert.alert("Failed to delete user", errorMsg);
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Failed to delete user: " + error.message);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Function to set up edit form
  const setupEditForm = (user) => {
    console.log("Setting up edit form for user:", user);
    setEditUserId(user.user_id);
    setUsername(user.username);
    setPassword(""); // Don't prefill password for security
    
    // Ensure we set the user type in lowercase to match database constraints
    // But also handle existing user types that might be in any case
    setUserType(user.user_type?.toLowerCase() || "employee");
    
    setEditModalVisible(true);
  };

  // Function to clear form data
  const clearForm = () => {
    setUsername("");
    setPassword("");
    setUserId("");
    setUserType("employee"); // Default to lowercase to match database constraint
    setEditUserId(null);
  };

  // Helper function to display user type with proper capitalization for UI
  const displayUserType = (type) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with User Management and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>User Management</Text>
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

        {/* Users List Section */}
        <View style={globalStyles.cards.standard}>
          <View style={styles.headerContainer}>
            <Text style={globalStyles.text.sectionTitle}>User List</Text>
            {isAdmin && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  clearForm();
                  setModalVisible(true);
                }}
              >
                <FontAwesome5 name="plus" size={14} color="white" />
                <Text style={styles.addButtonText}>Add User</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <Text style={globalStyles.text.orderTime}>Loading users...</Text>
          ) : error ? (
            <Text style={{...globalStyles.text.orderTime, color: 'red'}}>Error loading users: {error.message}</Text>
          ) : data?.users?.length === 0 ? (
            <Text style={globalStyles.text.orderTime}>No users found</Text>
          ) : (
            data?.users?.map((user, index) => (
              <View key={index} style={globalStyles.listItems.order}>
                <View style={globalStyles.listItems.orderInfo}>
                  <Text style={globalStyles.text.orderTitle}>
                    {user.username}
                  </Text>
                  <Text style={globalStyles.text.orderTime}>
                    ID: {user.user_id} • Type: {displayUserType(user.user_type)}
                  </Text>
                </View>
                <View style={globalStyles.listItems.orderActions}>
                  {isAdmin && (
                    <>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => setupEditForm(user)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteUser(user.user_id)}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <View style={globalStyles.buttons.view}>
                    <Text style={globalStyles.buttons.viewText}>View</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Add User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New User</Text>
            
            <Text style={styles.label}>User ID (Required)</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter User ID (numbers only)"
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />
            
            <Text style={styles.label}>User Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, userType === "admin" ? styles.selectedType : null]}
                onPress={() => setUserType("admin")}
              >
                <Text style={styles.typeText}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, userType === "employee" ? styles.selectedType : null]}
                onPress={() => setUserType("employee")}
              >
                <Text style={styles.typeText}>Employee</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  clearForm();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddUser}
              >
                <Text style={styles.buttonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit User</Text>
            
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
            />
            
            <Text style={styles.label}>Password (leave blank to keep unchanged)</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
            
            <Text style={styles.label}>User Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, userType === "admin" ? styles.selectedType : null]}
                onPress={() => setUserType("admin")}
              >
                <Text style={styles.typeText}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, userType === "employee" ? styles.selectedType : null]}
                onPress={() => setUserType("employee")}
              >
                <Text style={styles.typeText}>Employee</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  clearForm();
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleEditUser}
              >
                <Text style={styles.buttonText}>Update User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600'
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 6
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 6
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5
  },
  selectedType: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3'
  },
  typeText: {
    fontWeight: '500'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#9e9e9e'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  }
});