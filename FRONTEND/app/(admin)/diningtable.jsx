import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import globalStyles from "../../assets/styles/globalStyles";
import diningtableStyles from "../../assets/styles/diningtable";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import GET_DININGTABLE from "../queries/diningtableQueries";
import { 
  ADD_DININGTABLE, 
  UPDATE_DININGTABLE, 
  DELETE_DININGTABLE 
} from "../mutations/diningtableMutation";

export default function DiningTable() {
  // State variables
  const [adminId, setAdminId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add", "edit"
  const [selectedTable, setSelectedTable] = useState(null);
  const [formStatus, setFormStatus] = useState({ show: false, type: "", message: "" });
  
  // Form inputs
  const [tableId, setTableId] = useState("");
  const [tableName, setTableName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  
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

  // Fetch dining table data
  const { loading, error, data, refetch } = useQuery(GET_DININGTABLE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("✅ Dining tables fetched successfully:", data?.diningtables?.length || 0, "tables found");
    },
    onError: (error) => {
      console.error("❌ Error fetching dining tables:", error);
      Alert.alert("Error", "Failed to load dining tables: " + error.message);
    }
  });

  // Get all dining tables
  const diningTables = data?.diningtables || [];

  // Apollo mutations
  const [addDiningTable, { loading: addLoading }] = useMutation(ADD_DININGTABLE, {
    onCompleted: (data) => {
      console.log("✅ Dining table added successfully:", data);
      handleCloseModal();
      showFormStatus("success", "Dining table added successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("❌ Error adding dining table:", error);
      showFormStatus("error", `Failed to add dining table: ${error.message}`);
    }
  });

  const [updateDiningTable, { loading: updateLoading }] = useMutation(UPDATE_DININGTABLE, {
    onCompleted: (data) => {
      console.log("✅ Dining table updated successfully:", data);
      handleCloseModal();
      showFormStatus("success", "Dining table updated successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("❌ Error updating dining table:", error);
      showFormStatus("error", `Failed to update dining table: ${error.message}`);
    }
  });

  const [deleteDiningTable, { loading: deleteLoading }] = useMutation(DELETE_DININGTABLE, {
    onCompleted: (data) => {
      console.log("✅ Dining table deleted successfully:", data);
      setDeleteModalVisible(false);
      showFormStatus("success", "Dining table deleted successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("❌ Error deleting dining table:", error);
      setDeleteModalVisible(false);
      showFormStatus("error", `Failed to delete dining table: ${error.message}`);
    }
  });

  // Helper function to show form status messages
  const showFormStatus = (type, message) => {
    setFormStatus({ show: true, type, message });
    // Hide the status message after 3 seconds
    setTimeout(() => {
      setFormStatus({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Function to handle add table button click
  const handleAddTableClick = () => {
    setFormMode("add");
    setTableId("");
    setTableName("");
    setIsAvailable(true);
    setModalVisible(true);
  };

  // Function to handle edit table button click
  const handleEditTableClick = (table) => {
    setFormMode("edit");
    setSelectedTable(table);
    setTableId(table.table_id.toString());
    setTableName(table.table_name);
    setIsAvailable(table.is_available);
    setModalVisible(true);
  };

  // Function to handle delete table button click
  const handleDeleteTableClick = (table) => {
    setSelectedTable(table);
    setDeleteModalVisible(true);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (formMode === "add") {
      // Validate inputs
      if (!tableId || !tableName) {
        Alert.alert("Error", "Table ID and Table Name are required");
        return;
      }

      // Check if table ID is a number
      const numTableId = parseInt(tableId);
      if (isNaN(numTableId)) {
        Alert.alert("Error", "Table ID must be a number");
        return;
      }

      // Add new dining table
      addDiningTable({
        variables: {
          diningTable: {
            table_id: numTableId,
            table_name: tableName
          },
          adminId: adminId
        }
      });
    } else if (formMode === "edit") {
      // Validate inputs
      if (!tableName) {
        Alert.alert("Error", "Table Name is required");
        return;
      }

      // Update dining table
      updateDiningTable({
        variables: {
          tableId: selectedTable.table_id,
          diningTable: {
            table_name: tableName
          },
          adminId: adminId
        }
      });
    }
  };

  // Function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (selectedTable) {
      deleteDiningTable({
        variables: {
          tableId: selectedTable.table_id,
          adminId: adminId
        }
      });
    }
  };

  // Function to close modal and reset form
  const handleCloseModal = () => {
    setModalVisible(false);
    setTableId("");
    setTableName("");
    setIsAvailable(true);
    setSelectedTable(null);
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

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with Dining Tables and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Dining Tables</Text>
          </View>
          <View style={globalStyles.layout.headerRight}>
            {isAdmin && (
              <TouchableOpacity 
                style={diningtableStyles.addButton}
                onPress={handleAddTableClick}
              >
                <FontAwesome5 name="plus" size={14} color="white" />
                <Text style={diningtableStyles.addButtonText}>Add</Text>
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

        {/* Form Status Message */}
        {formStatus.show && (
          <View style={[
            diningtableStyles.formStatus,
            formStatus.type === "success" ? diningtableStyles.formStatusSuccess : diningtableStyles.formStatusError
          ]}>
            <Text style={[
              diningtableStyles.formStatusText,
              formStatus.type === "success" ? diningtableStyles.formStatusTextSuccess : diningtableStyles.formStatusTextError
            ]}>
              {formStatus.message}
            </Text>
          </View>
        )}

        {/* Loading or Error State */}
        {loading && (
          <View style={diningtableStyles.loadingContainer}>
            <ActivityIndicator size="large" color={globalStyles.colors.primary} />
            <Text style={diningtableStyles.loadingText}>Loading dining tables...</Text>
          </View>
        )}
        
        {error && (
          <View style={diningtableStyles.errorContainer}>
            <Text style={diningtableStyles.errorText}>
              Error loading dining tables: {error.message}
            </Text>
            <TouchableOpacity 
              style={diningtableStyles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={diningtableStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dining Tables List */}
        {data && (
          <View style={diningtableStyles.menuList}>
            {diningTables.length === 0 ? (
              <View style={diningtableStyles.emptyContainer}>
                <Text style={diningtableStyles.emptyText}>No dining tables found.</Text>
                {isAdmin && (
                  <TouchableOpacity 
                    style={[diningtableStyles.retryButton, { marginTop: globalStyles.spacing.medium }]}
                    onPress={handleAddTableClick}
                  >
                    <Text style={diningtableStyles.retryButtonText}>Add Your First Table</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              diningTables.map((table, index) => (
                <View key={index} style={diningtableStyles.menuItemCard}>
                  <View style={diningtableStyles.menuItemContent}>
                    <View style={diningtableStyles.menuItemInfo}>
                      <Text style={diningtableStyles.menuItemName}>{table.table_name}</Text>
                      <Text style={diningtableStyles.menuItemCategory}>
                        Table ID: {table.table_id}
                      </Text>
                    </View>

                    <View style={diningtableStyles.menuItemRight}>
                      <View style={[
                        diningtableStyles.availabilityBadge,
                        !table.is_available && diningtableStyles.soldOutBadge
                      ]}>
                        <Text style={[
                          diningtableStyles.availabilityText,
                          !table.is_available && diningtableStyles.soldOutText
                        ]}>
                          {table.is_available ? "Available" : "Occupied"}
                        </Text>
                      </View>
                      
                      {isAdmin && (
                        <View style={diningtableStyles.menuItemActions}>
                          <TouchableOpacity 
                            style={diningtableStyles.actionButton}
                            onPress={() => handleEditTableClick(table)}
                          >
                            <FontAwesome5 name="edit" size={18} color={globalStyles.colors.action.edit} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={diningtableStyles.actionButton}
                            onPress={() => handleDeleteTableClick(table)}
                          >
                            <FontAwesome5 name="trash-alt" size={18} color={globalStyles.colors.action.delete} />
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

        {/* Add/Edit Table Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={diningtableStyles.modalOverlay}>
            <View style={diningtableStyles.modalView}>
              <Text style={diningtableStyles.modalTitle}>
                {formMode === "add" ? "Add New Dining Table" : "Edit Dining Table"}
              </Text>
              
              {formMode === "add" && (
                <View style={diningtableStyles.formGroup}>
                  <Text style={diningtableStyles.label}>Table ID</Text>
                  <TextInput
                    style={diningtableStyles.input}
                    placeholder="Enter Table ID"
                    value={tableId}
                    onChangeText={setTableId}
                    keyboardType="numeric"
                    editable={formMode === "add"}
                  />
                </View>
              )}
              
              <View style={diningtableStyles.formGroup}>
                <Text style={diningtableStyles.label}>Table Name</Text>
                <TextInput
                  style={diningtableStyles.input}
                  placeholder="Enter Table Name"
                  value={tableName}
                  onChangeText={setTableName}
                />
              </View>
              
              <View style={diningtableStyles.switchContainer}>
                <Text style={diningtableStyles.label}>Available</Text>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: "#767577", true: "#e74c3c" }}
                  thumbColor={isAvailable ? "#fff" : "#f4f3f4"}
                  disabled={true} // Disable as is_available is not part of the mutation inputs
                />
              </View>
              
              <View style={diningtableStyles.modalActions}>
                <TouchableOpacity
                  style={[diningtableStyles.modalButton, diningtableStyles.cancelButton]}
                  onPress={handleCloseModal}
                  disabled={addLoading || updateLoading}
                >
                  <Text style={[diningtableStyles.buttonText, { color: "#333" }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[diningtableStyles.modalButton, diningtableStyles.saveButton]}
                  onPress={handleSubmit}
                  disabled={addLoading || updateLoading}
                >
                  {(addLoading || updateLoading) ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={diningtableStyles.buttonText}>
                      {formMode === "add" ? "Add Table" : "Update Table"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={diningtableStyles.modalOverlay}>
            <View style={diningtableStyles.confirmDialog}>
              <Text style={diningtableStyles.confirmTitle}>Confirm Delete</Text>
              <Text style={diningtableStyles.confirmText}>
                Are you sure you want to delete the dining table "{selectedTable?.table_name}"?
                This action cannot be undone.
              </Text>
              
              <View style={diningtableStyles.modalActions}>
                <TouchableOpacity
                  style={[diningtableStyles.modalButton, diningtableStyles.cancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                  disabled={deleteLoading}
                >
                  <Text style={[diningtableStyles.buttonText, { color: "#333" }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[diningtableStyles.modalButton, diningtableStyles.deleteButton]}
                  onPress={handleDeleteConfirm}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={diningtableStyles.buttonText}>Delete</Text>
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