import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import globalStyles from '../../assets/styles/globalStyles';
import orderStyles from '../../assets/styles/order';
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import GET_ORDERS from "../../app/queries/orderQueries";
import GET_MENUS from "../../app/queries/menuQueries";
import GET_ORDERSITEMS from "../../app/queries/orderitemsQueries";
import { ADD_ORDER, UPDATE_ORDER, DELETE_ORDER } from "../../app/mutations/orderMutation";

// Status filter tabs
const statusFilters = ['All', 'Pending', 'Preparing', 'Cancelled', 'Completed'];

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form data
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    tableId: '',
    status: 'Pending'
  });
  
  // Fetch orders data from GraphQL API with fetchPolicy to disable caching
  const { loading: ordersLoading, error: ordersError, data: ordersData, refetch: refetchOrders } = useQuery(GET_ORDERS, {
    fetchPolicy: 'network-only', // This ensures we always get fresh data from the server
    notifyOnNetworkStatusChange: true, // This ensures loading state updates when refetching
  });
  
  // Fetch menus data for price information
  const { data: menusData } = useQuery(GET_MENUS);
  
  // Fetch order items to calculate actual prices
  const { data: orderItemsData } = useQuery(GET_ORDERSITEMS);
  
  // Setup mutations with refetchQueries to automatically update data
  const [addOrder, { loading: addLoading }] = useMutation(ADD_ORDER, {
    refetchQueries: [
      { query: GET_ORDERS },
      { query: GET_ORDERSITEMS }
    ],
    awaitRefetchQueries: true // Wait for refetch to complete before resolving the mutation
  });
  
  const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER, {
    refetchQueries: [
      { query: GET_ORDERS }
    ],
    awaitRefetchQueries: true
  });
  
  const [deleteOrder, { loading: deleteLoading }] = useMutation(DELETE_ORDER, {
    refetchQueries: [
      { query: GET_ORDERS },
      { query: GET_ORDERSITEMS }
    ],
    awaitRefetchQueries: true
  });
  
  // Force refresh orders every time component mounts
  useEffect(() => {
    refetchOrders();
  }, []);
  
  // Check if user is admin on component mount
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Function to check user authentication status
  const checkUserStatus = async () => {
    try {
      const userType = await SecureStore.getItemAsync("user_type");
      const userIdValue = await SecureStore.getItemAsync("user_id");
      const token = await SecureStore.getItemAsync("user_token");
      
      console.log("Auth details:");
      console.log("- User type:", userType);
      console.log("- User ID:", userIdValue);
      console.log("- Token exists:", !!token);
      
      // Store user ID for mutations
      if (userIdValue) {
        setUserId(parseInt(userIdValue, 10));
      }
      
      // Check if we have valid credentials
      if (userType && userIdValue) {
        if (userType.toLowerCase() === "admin") {
          console.log("✅ Valid admin credentials found");
          setIsAdmin(true);
        } else {
          console.log("✅ Valid employee credentials found");
          setIsAdmin(false);
        }
      } else {
        // Set hardcoded admin for development/testing
        console.warn("⚠️ Auth check failed - USING FALLBACK ID FOR TESTING");
        
        // DEVELOPMENT ONLY: Set fallback credentials
        setIsAdmin(true);
        setUserId(1); // Default user ID for testing
        
        // Alert developer about the issue
        Alert.alert(
          "Development Mode", 
          "Using fallback credentials for testing. In production, proper authentication will be required.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      
      // DEVELOPMENT ONLY: Set fallback credentials
      console.warn("⚠️ Setting fallback credentials due to error");
      setIsAdmin(true);
      setUserId(1); // Default user ID for testing
    }
  };
  
  // Calculate the total price for a specific order based on its order items
  const calculateOrderTotal = (orderId) => {
    if (!orderItemsData?.orderitems || !menusData?.menus) return '$0.00';
    
    // Filter order items for this order
    const orderItems = orderItemsData.orderitems.filter(item => 
      parseInt(item.order_id, 10) === parseInt(orderId, 10)
    );
    
    // Calculate total
    let total = 0;
    
    orderItems.forEach(item => {
      const menuItem = menusData.menus.find(menu => menu.menu_id === item.menu_id);
      if (menuItem) {
        total += menuItem.price * item.quantity;
      }
    });
    
    return '$' + total.toFixed(2);
  };
  
  // Process the orders data to match our UI requirements
  const processedOrders = React.useMemo(() => {
    if (!ordersData || !ordersData.orders) return [];
    
    return ordersData.orders.map(order => {
      // Calculate actual price based on order items
      const price = calculateOrderTotal(order.order_id);
      
      return {
        id: order.order_id,
        table: order.table_id,
        time: new Date(order.order_time).toLocaleTimeString(),
        price: price,
        status: order.status || 'Pending',
      };
    });
  }, [ordersData, orderItemsData, menusData]);
  
  // Filter orders based on selected status
  const filteredOrders = activeFilter === 'All' 
    ? processedOrders 
    : processedOrders.filter(order => order.status === activeFilter);

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

  // Function to handle view order details
const handleViewOrder = (order) => {
  console.log("Navigating to order details:", order);
    
    // Navigate to ordersandorderitem.jsx in the (screens) folder
    // Pass the order details as params
router.push({
    pathname: '/(screens)/ordersandorderitem',
    params: {
      orderId: order.id,
      table: order.table,
      time: order.time,
      price: order.price,
      status: order.status,
      userRole: isAdmin ? 'admin' : 'employee', // Add user role
      userId: userId // Add user ID
    }
  });
};

  // Retry loading orders
  const handleRetryLoad = () => {
    console.log("Retrying to load orders...");
    refetchOrders();
  };

  // CRUD Operations
  // Open Add Order modal
  const openAddModal = () => {
    setFormData({
      orderId: '',
      tableId: '',
      status: 'Pending'
    });
    setShowAddModal(true);
  };
  
  // Handle adding an order
  const handleAddOrder = async () => {
    // Validate form data
    if (!formData.orderId || !formData.tableId) {
      Alert.alert("Input Error", "Please fill in all required fields");
      return;
    }
    
    try {
      const response = await addOrder({
        variables: {
          order: {
            order_id: parseInt(formData.orderId, 10),
            table_id: parseInt(formData.tableId, 10),
            status: formData.status
          },
          userId: userId || 1 // Fallback for development
        }
      });
      
      if (response.data?.addOrder?.type === "SUCCESS") {
        Alert.alert("Success", "Order created successfully");
        setShowAddModal(false);
        // Refetch to ensure we have the latest data
        await refetchOrders();
        console.log("Orders refreshed after adding new order");
      } else {
        Alert.alert("Error", response.data?.addOrder?.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error adding order:", error);
      Alert.alert("Error", "An error occurred while creating the order");
    }
  };
  
  // Open Edit Order modal
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      orderId: order.id.toString(),
      tableId: order.table.toString(),
      status: order.status
    });
    setShowEditModal(true);
  };
  
  // Handle updating an order
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await updateOrder({
        variables: {
          orderId: parseInt(selectedOrder.id, 10),
          order: {
            table_id: parseInt(formData.tableId, 10),
            status: formData.status
          },
          userId: userId || 1 // Fallback for development
        }
      });
      
      if (response.data?.editOrder?.type === "SUCCESS") {
        Alert.alert("Success", "Order updated successfully");
        setShowEditModal(false);
        // Refetch to ensure we have the latest data
        await refetchOrders();
        console.log("Orders refreshed after updating order");
      } else {
        Alert.alert("Error", response.data?.editOrder?.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "An error occurred while updating the order");
    }
  };
  
  // Open Delete Order modal
  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };
  
  // Handle deleting an order
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await deleteOrder({
        variables: {
          orderId: parseInt(selectedOrder.id, 10),
          userId: userId || 1 // Fallback for development
        }
      });
      
      if (response.data?.deleteOrder?.type === "SUCCESS") {
        Alert.alert("Success", "Order deleted successfully");
        setShowDeleteModal(false);
        // Refetch to ensure we have the latest data
        await refetchOrders();
        console.log("Orders refreshed after deleting order");
      } else {
        Alert.alert("Error", response.data?.deleteOrder?.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Alert.alert("Error", "An error occurred while deleting the order");
    }
  };

  // Helper function to determine status badge style
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'Completed':
        return { backgroundColor: globalStyles.colors.status.successBg };
      case 'Pending':
        return { backgroundColor: globalStyles.colors.secondary + '20' };
      case 'Preparing':
        return { backgroundColor: '#FFF9C4' };
      case 'Cancelled':
        return { backgroundColor: globalStyles.colors.status.errorBg };
      default:
        return {};
    }
  };

  // Helper function to determine status text style
  const getStatusTextStyle = (status) => {
    switch(status) {
      case 'Completed':
        return { color: globalStyles.colors.status.success };
      case 'Pending':
        return { color: globalStyles.colors.secondary };
      case 'Preparing':
        return { color: '#F57F17' };
      case 'Cancelled':
        return { color: globalStyles.colors.status.error };
      default:
        return {};
    }
  };

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={globalStyles.layout.container}>
        {/* Header with Orders and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Orders</Text>
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

        {/* Status filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={globalStyles.layout.horizontalScroll}
          contentContainerStyle={{ paddingRight: globalStyles.spacing.large }}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                globalStyles.buttons.category,
                activeFilter === filter && globalStyles.buttons.categorySelected,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text 
                style={[
                  globalStyles.text.categoryText, 
                  activeFilter === filter && globalStyles.text.categorySelectedText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Add Order Button (visible to all users) */}
        <TouchableOpacity 
          style={orderStyles.addOrderButton}
          onPress={openAddModal}
        >
          <FontAwesome5 name="plus" size={16} color="white" />
          <Text style={orderStyles.addOrderButtonText}>Add New Order</Text>
        </TouchableOpacity>

        {/* Loading State */}
        {ordersLoading && (
          <View style={globalStyles.state.loading}>
            <ActivityIndicator size="large" color={globalStyles.colors.primary} />
            <Text style={globalStyles.text.loadingText}>Loading orders...</Text>
          </View>
        )}

        {/* Error State */}
        {ordersError && (
          <View style={globalStyles.state.error}>
            <Text style={globalStyles.text.errorText}>Failed to load orders</Text>
            <TouchableOpacity 
              style={[globalStyles.buttons.primary, { marginTop: globalStyles.spacing.medium }]}
              onPress={handleRetryLoad}
            >
              <Text style={globalStyles.buttons.primaryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Orders list */}
        {!ordersLoading && !ordersError && (
          <View style={orderStyles.ordersList}>
            {filteredOrders.length === 0 ? (
              <View style={orderStyles.emptyContainer}>
                <Text style={orderStyles.emptyText}>No orders found with {activeFilter !== 'All' ? `"${activeFilter}"` : 'any'} status.</Text>
              </View>
            ) : (
              filteredOrders.map((order, index) => (
                <View key={`order-${order.id}-${index}`} style={orderStyles.orderCard}>
                  <View style={orderStyles.orderDetails}>
                    <View style={orderStyles.orderTop}>
                      <Text style={orderStyles.orderId}>Order #{order.id}</Text>
                    </View>
                    <Text style={orderStyles.orderInfo}>Table {order.table} • {order.time}</Text>
                    <Text style={orderStyles.orderPrice}>{order.price}</Text>
                  </View>
                  <View style={orderStyles.orderActions}>
                    <View style={[
                      orderStyles.statusBadge,
                      getStatusBadgeStyle(order.status)
                    ]}>
                      <Text style={[
                        orderStyles.statusText,
                        getStatusTextStyle(order.status)
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                    <View style={orderStyles.actionButtonsRow}>
                      <TouchableOpacity 
                        style={orderStyles.viewButton}
                        onPress={() => handleViewOrder(order)}
                      >
                        <Text style={orderStyles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={orderStyles.editButton}
                        onPress={() => openEditModal(order)}
                      >
                        <Text style={orderStyles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      
                      {/* Delete button only visible to admin users */}
                      {isAdmin && (
                        <TouchableOpacity 
                          style={orderStyles.deleteButton}
                          onPress={() => openDeleteModal(order)}
                        >
                          <Text style={orderStyles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* Add Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={orderStyles.modalContainer}>
          <View style={orderStyles.modalContent}>
            <Text style={orderStyles.modalTitle}>Add New Order</Text>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Order ID:</Text>
              <TextInput
                style={orderStyles.formInput}
                placeholder="Enter order ID"
                keyboardType="numeric"
                value={formData.orderId}
                onChangeText={(text) => setFormData({...formData, orderId: text})}
              />
            </View>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Table Number:</Text>
              <TextInput
                style={orderStyles.formInput}
                placeholder="Enter table number"
                keyboardType="numeric"
                value={formData.tableId}
                onChangeText={(text) => setFormData({...formData, tableId: text})}
              />
            </View>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Status:</Text>
              <View style={orderStyles.statusButtonsContainer}>
                {statusFilters.filter(status => status !== 'All').map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      orderStyles.statusButton,
                      formData.status === status && orderStyles.statusButtonSelected
                    ]}
                    onPress={() => setFormData({...formData, status: status})}
                  >
                    <Text style={[
                      orderStyles.statusButtonText,
                      formData.status === status && orderStyles.statusButtonTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={orderStyles.modalButtonsContainer}>
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalCancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={orderStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalSubmitButton]}
                onPress={handleAddOrder}
                disabled={addLoading}
              >
                {addLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={orderStyles.modalButtonText}>Add Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={orderStyles.modalContainer}>
          <View style={orderStyles.modalContent}>
            <Text style={orderStyles.modalTitle}>Edit Order</Text>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Order ID:</Text>
              <Text style={orderStyles.formValue}>{formData.orderId}</Text>
            </View>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Table Number:</Text>
              <TextInput
                style={orderStyles.formInput}
                placeholder="Enter table number"
                keyboardType="numeric"
                value={formData.tableId}
                onChangeText={(text) => setFormData({...formData, tableId: text})}
              />
            </View>
            
            <View style={orderStyles.formGroup}>
              <Text style={orderStyles.formLabel}>Status:</Text>
              <View style={orderStyles.statusButtonsContainer}>
                {statusFilters.filter(status => status !== 'All').map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      orderStyles.statusButton,
                      formData.status === status && orderStyles.statusButtonSelected
                    ]}
                    onPress={() => setFormData({...formData, status: status})}
                  >
                    <Text style={[
                      orderStyles.statusButtonText,
                      formData.status === status && orderStyles.statusButtonTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={orderStyles.modalButtonsContainer}>
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalCancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={orderStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalSubmitButton]}
                onPress={handleUpdateOrder}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={orderStyles.modalButtonText}>Update Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Delete Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={orderStyles.modalContainer}>
          <View style={orderStyles.modalContent}>
            <Text style={orderStyles.modalTitle}>Delete Order</Text>
            
            <Text style={orderStyles.deleteConfirmationText}>
              Are you sure you want to delete Order #{selectedOrder?.id} for Table {selectedOrder?.table}?
            </Text>
            
            <Text style={orderStyles.deleteWarningText}>
              This action cannot be undone.
            </Text>
            
            <View style={orderStyles.modalButtonsContainer}>
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalCancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={orderStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[orderStyles.modalButton, orderStyles.modalDeleteButton]}
                onPress={handleDeleteOrder}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={orderStyles.modalButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}