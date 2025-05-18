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
  TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import globalStyles from '../../assets/styles/globalStyles';
import orderStyles from '../../assets/styles/order';
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import GET_ORDERS from "../../app/queries/orderQueries";
import GET_ORDERSITEMS from "../../app/queries/orderitemsQueries";
import GET_MENUS from "../queries/menuQueries";
import { 
  ADD_ORDER, 
  UPDATE_ORDER, 
  DELETE_ORDER,
  ADD_ORDERITEM,
  UPDATE_ORDERITEM,
  DELETE_ORDERITEM
} from "../../app/mutations/orderMutation";

// Status filter tabs
const statusFilters = ['All', 'Pending', 'Preparing', 'Cancelled', 'Completed'];
// Order status options for dropdown
const statusOptions = ['Pending', 'Preparing', 'Completed', 'Cancelled'];

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [menuMap, setMenuMap] = useState({});
  const [menuList, setMenuList] = useState([]);
  
  // New Order Form State
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderTable, setNewOrderTable] = useState('');
  const [newOrderStatus, setNewOrderStatus] = useState('Pending');
  
  // Edit Order State
  const [editingStatus, setEditingStatus] = useState('');
  const [editingTable, setEditingTable] = useState('');
  
  // Order Item Form State
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState('1');
  const [editingItem, setEditingItem] = useState(null);
  
  // Fetch orders data
  const { loading: ordersLoading, error: ordersError, data: ordersData, refetch: refetchOrders } = useQuery(GET_ORDERS);
  
  // Fetch order items data
  const { loading: itemsLoading, error: itemsError, data: itemsData, refetch: refetchItems } = useQuery(GET_ORDERSITEMS);

  // Fetch menu data for mapping menu IDs to names
  const { loading: menusLoading, error: menusError, data: menusData } = useQuery(GET_MENUS, {
    onCompleted: (data) => {
      if (data && data.menus) {
        // Create a mapping of menu IDs to menu names
        const mapping = {};
        data.menus.forEach((menu) => {
          mapping[menu.menu_id] = menu.menu_name;
        });
        setMenuMap(mapping);
        setMenuList(data.menus);
        console.log("✅ Menu mapping created with", Object.keys(mapping).length, "items");
      }
    }
  });

  // Order Mutations
  const [addOrder] = useMutation(ADD_ORDER, {
    onCompleted: (data) => {
      console.log("✅ Order added successfully:", data.addOrder);
      Alert.alert("Success", "Order added successfully!");
      refetchOrders();
      setShowAddOrderModal(false);
    },
    onError: (error) => {
      console.error("❌ Error adding order:", error);
      Alert.alert("Error", "Failed to add order. Please try again.");
    }
  });

  const [updateOrder] = useMutation(UPDATE_ORDER, {
    onCompleted: (data) => {
      console.log("✅ Order updated successfully:", data.editOrder);
      Alert.alert("Success", "Order status updated successfully!");
      refetchOrders();
      setModalVisible(false);
    },
    onError: (error) => {
      console.error("❌ Error updating order:", error);
      Alert.alert("Error", "Failed to update order. Please try again.");
    }
  });

  const [deleteOrder] = useMutation(DELETE_ORDER, {
    onCompleted: (data) => {
      console.log("✅ Order deleted successfully:", data.deleteOrder);
      Alert.alert("Success", "Order deleted successfully!");
      refetchOrders();
      setModalVisible(false);
    },
    onError: (error) => {
      console.error("❌ Error deleting order:", error);
      Alert.alert("Error", "Failed to delete order. Please try again.");
    }
  });

  // Order Item Mutations
  const [addOrderItem] = useMutation(ADD_ORDERITEM, {
    onCompleted: (data) => {
      console.log("✅ Order item added successfully:", data.addOrderItem);
      Alert.alert("Success", "Item added to order successfully!");
      refetchItems();
      setShowAddItemModal(false);
      
      // Refresh order items if we're viewing an order
      if (selectedOrder) {
        const updatedItems = getOrderItems(selectedOrder.id);
        setOrderItems(updatedItems);
      }
    },
    onError: (error) => {
      console.error("❌ Error adding order item:", error);
      Alert.alert("Error", "Failed to add item to order. Please try again.");
    }
  });

  const [updateOrderItem] = useMutation(UPDATE_ORDERITEM, {
    onCompleted: (data) => {
      console.log("✅ Order item updated successfully:", data.editOrderItem);
      Alert.alert("Success", "Order item updated successfully!");
      refetchItems();
      setEditingItem(null);
      
      // Refresh order items if we're viewing an order
      if (selectedOrder) {
        const updatedItems = getOrderItems(selectedOrder.id);
        setOrderItems(updatedItems);
      }
    },
    onError: (error) => {
      console.error("❌ Error updating order item:", error);
      Alert.alert("Error", "Failed to update order item. Please try again.");
    }
  });

  const [deleteOrderItem] = useMutation(DELETE_ORDERITEM, {
    onCompleted: (data) => {
      console.log("✅ Order item deleted successfully:", data.deleteOrderItem);
      Alert.alert("Success", "Order item deleted successfully!");
      refetchItems();
      
      // Refresh order items if we're viewing an order
      if (selectedOrder) {
        const updatedItems = getOrderItems(selectedOrder.id);
        setOrderItems(updatedItems);
      }
    },
    onError: (error) => {
      console.error("❌ Error deleting order item:", error);
      Alert.alert("Error", "Failed to delete order item. Please try again.");
    }
  });

  // Check if user is admin on component mount
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Function to check if the current user is an admin
  const checkUserStatus = async () => {
    try {
      const userType = await SecureStore.getItemAsync("user_type");
      const userIdStr = await SecureStore.getItemAsync("user_id");
      const token = await SecureStore.getItemAsync("user_token");
      
      console.log("Auth details:");
      console.log("- User type:", userType);
      console.log("- User ID:", userIdStr);
      console.log("- Token exists:", !!token);
      
      // Set user ID for mutations
      if (userIdStr) {
        setUserId(parseInt(userIdStr));
      }
      
      // Check if we have valid credentials
      if (userType && userIdStr) {
        if (userType.toLowerCase() === "admin") {
          console.log("✅ Valid admin credentials found");
          setIsAdmin(true);
        } else {
          console.log("✅ Valid employee credentials found");
          setIsAdmin(false);
        }
      } else {
        // Set hardcoded data for development/testing
        console.warn("⚠️ Auth check failed - USING FALLBACK ID FOR TESTING");
        setIsAdmin(true);
        setUserId(1); // Fallback user ID for testing
        
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
      setUserId(1);
    }
  };

  // Process and format orders data
  const processOrdersData = () => {
    if (!ordersData || !ordersData.orders) return [];
    
    return ordersData.orders.map(order => {
      // Converting GraphQL data to match our UI format
      return {
        id: order.order_id,
        table: order.table_id,
        time: formatTime(order.order_time),
        status: order.status || 'Preparing',
        price: calculateOrderTotal(order.order_id),
      };
    });
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate total price for an order
  const calculateOrderTotal = (orderId) => {
    if (!itemsData || !itemsData.orderitems) return '$0.00';
    
    const items = itemsData.orderitems.filter(item => item.order_id === orderId);
    const total = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    return `$${total.toFixed(2)}`;
  };

  // Get order items for a specific order with menu names
  const getOrderItems = (orderId) => {
    if (!itemsData || !itemsData.orderitems) return [];
    
    const items = itemsData.orderitems.filter(item => item.order_id === orderId);
    
    // Enrich order items with menu names
    return items.map(item => ({
      ...item,
      menu_name: menuMap[item.menu_id] || `Unknown Menu (ID: ${item.menu_id})`
    }));
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

  // Function to handle view order details
  const handleViewOrder = (order) => {
    console.log("Viewing order details:", order);
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setEditingTable(order.table.toString());
    setOrderItems(getOrderItems(order.id));
    setModalVisible(true);
  };

  // Function to handle creating a new order
  const handleCreateOrder = () => {
    if (!newOrderTable) {
      Alert.alert("Error", "Please enter a table number");
      return;
    }
    
    const tableId = parseInt(newOrderTable);
    if (isNaN(tableId) || tableId <= 0) {
      Alert.alert("Error", "Please enter a valid table number");
      return;
    }
    
    console.log("Creating new order:", { tableId, status: newOrderStatus });
    
    // Generate a temporary order ID (would be handled by backend in production)
    const tempOrderId = Math.floor(Math.random() * 10000);
    
    addOrder({
      variables: {
        order: {
          order_id: tempOrderId,
          table_id: tableId,
          status: newOrderStatus
        },
        userId: userId || 1
      }
    });
  };

  // Function to handle updating an order's status
  const handleUpdateOrder = () => {
    if (!selectedOrder) return;
    
    const tableId = parseInt(editingTable);
    if (isNaN(tableId) || tableId <= 0) {
      Alert.alert("Error", "Please enter a valid table number");
      return;
    }
    
    console.log("Updating order:", selectedOrder.id, { tableId, status: editingStatus });
    
    updateOrder({
      variables: {
        orderId: parseInt(selectedOrder.id),
        order: {
          table_id: tableId,
          status: editingStatus
        },
        userId: userId || 1
      }
    });
  };

  // Function to handle deleting an order (Admin only)
  const handleDeleteOrder = () => {
    if (!selectedOrder || !isAdmin) return;
    
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete Order #${selectedOrder.id}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            console.log("Deleting order:", selectedOrder.id);
            deleteOrder({
              variables: {
                orderId: parseInt(selectedOrder.id),
                userId: userId || 1
              }
            });
          }
        }
      ]
    );
  };

  // Function to handle adding an item to an order
  const handleAddOrderItem = () => {
    if (!selectedMenuItem || !selectedOrder) {
      Alert.alert("Error", "Please select a menu item");
      return;
    }
    
    const quantity = parseInt(itemQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    
    console.log("Adding item to order:", {
      orderId: selectedOrder.id,
      menuId: selectedMenuItem.menu_id,
      quantity,
      amount: selectedMenuItem.price
    });
    
    addOrderItem({
      variables: {
        orderItem: {
          order_id: parseInt(selectedOrder.id),
          menu_id: selectedMenuItem.menu_id,
          quantity: quantity,
          amount: selectedMenuItem.price
        },
        userId: userId || 1
      }
    });
  };

  // Function to handle updating an order item
  const handleUpdateOrderItem = () => {
    if (!editingItem) return;
    
    const quantity = parseInt(itemQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    
    console.log("Updating order item:", editingItem.orderitem_id, {
      quantity,
      isPaid: editingItem.is_paid
    });
    
    updateOrderItem({
      variables: {
        orderitemId: editingItem.orderitem_id,
        orderItem: {
          order_id: editingItem.order_id,
          menu_id: editingItem.menu_id,
          quantity: quantity,
          amount: editingItem.amount,
          is_paid: editingItem.is_paid
        },
        userId: userId || 1
      }
    });
  };

  // Function to toggle payment status of an item
  const handleToggleItemPaid = (item) => {
    console.log("Toggling payment status for item:", item.orderitem_id);
    
    updateOrderItem({
      variables: {
        orderitemId: item.orderitem_id,
        orderItem: {
          order_id: item.order_id,
          menu_id: item.menu_id,
          quantity: item.quantity,
          amount: item.amount,
          is_paid: !item.is_paid
        },
        userId: userId || 1
      }
    });
  };

  // Function to handle deleting an order item (Admin only)
  const handleDeleteOrderItem = (item) => {
    if (!isAdmin) return;
    
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete "${item.menu_name}" from this order? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            console.log("Deleting order item:", item.orderitem_id);
            deleteOrderItem({
              variables: {
                orderitemId: item.orderitem_id,
                userId: userId || 1
              }
            });
          }
        }
      ]
    );
  };

  // Function to start editing an item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemQuantity(item.quantity.toString());
  };

  // Retry loading orders
  const handleRetryLoad = () => {
    console.log("Retrying to load orders...");
    refetchOrders();
    refetchItems();
  };

  // Get filtered orders
  const filteredOrders = () => {
    const orders = processOrdersData();
    return activeFilter === 'All' 
      ? orders 
      : orders.filter(order => order.status === activeFilter);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setEditingItem(null);
  };

  // Close add order modal
  const closeAddOrderModal = () => {
    setShowAddOrderModal(false);
    setNewOrderTable('');
    setNewOrderStatus('Pending');
  };

  // Close add item modal
  const closeAddItemModal = () => {
    setShowAddItemModal(false);
    setSelectedMenuItem(null);
    setItemQuantity('1');
  };

  // Calculate order subtotal
  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  // Calculate tax amount (10%)
  const calculateTax = (subtotal) => {
    return subtotal * 0.1;
  };

  // Calculate total with tax
  const calculateTotal = (subtotal) => {
    return subtotal * 1.1;
  };

  // Loading indicator for any data being loaded
  const isLoading = ordersLoading || itemsLoading || menusLoading;
  
  // Error in any data fetch
  const hasError = ordersError || itemsError || menusError;

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

        {/* Create Order Button */}
        <TouchableOpacity
          style={[globalStyles.buttons.primary, { marginVertical: 10 }]}
          onPress={() => setShowAddOrderModal(true)}
        >
          <Text style={globalStyles.buttons.primaryText}>Create New Order</Text>
        </TouchableOpacity>

        {/* Status filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={orderStyles.filtersContainer}
          contentContainerStyle={{ paddingRight: globalStyles.spacing.large }}
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                orderStyles.filterButton,
                activeFilter === filter && 
                  (filter === 'All' ? orderStyles.activeAllButton : orderStyles.activeFilterButton)
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text 
                style={[
                  orderStyles.filterText,
                  activeFilter === filter && 
                    (filter === 'All' ? orderStyles.activeAllText : orderStyles.activeFilterText)
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading State */}
        {isLoading && (
          <View style={orderStyles.loadingContainer}>
            <ActivityIndicator size="large" color={globalStyles.colors.primary} />
            <Text style={orderStyles.loadingText}>Loading orders...</Text>
          </View>
        )}

        {/* Error State */}
        {hasError && (
          <View style={globalStyles.state.error}>
            <Text style={globalStyles.text.errorText}>Failed to load orders or menu data</Text>
            <TouchableOpacity 
              style={[globalStyles.buttons.primary, { marginTop: globalStyles.spacing.medium }]}
              onPress={handleRetryLoad}
            >
              <Text style={globalStyles.buttons.primaryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Orders list */}
        {!isLoading && !hasError && (
          <View style={orderStyles.ordersList}>
            {filteredOrders().length === 0 ? (
              <View style={orderStyles.emptyContainer}>
                <Text style={orderStyles.emptyText}>No orders found with {activeFilter !== 'All' ? `"${activeFilter}"` : 'any'} status.</Text>
              </View>
            ) : (
              filteredOrders().map((order) => (
                <View key={order.id} style={orderStyles.orderCard}>
                  <View style={orderStyles.orderDetails}>
                    <View style={orderStyles.orderTop}>
                      <Text style={orderStyles.orderId}>Order #{order.id}</Text>
                    </View>
                    <Text style={orderStyles.orderInfo}>Table {order.table} • {order.time}</Text>
                    <Text style={orderStyles.orderPrice}>{order.price}</Text>
                  </View>
                  <View style={orderStyles.rightSection}>
                    <View style={[
                      orderStyles.statusBadge,
                      order.status === 'Completed' && { backgroundColor: globalStyles.colors.status.successBg },
                      order.status === 'Preparing' && { backgroundColor: '#FFF9C4' },
                      order.status === 'Cancelled' && { backgroundColor: '#FFCDD2' },
                      order.status === 'Pending' && { backgroundColor: '#E3F2FD' }
                    ]}>
                      <Text style={[
                        orderStyles.statusText,
                        order.status === 'Preparing' && { color: '#F57F17' },
                        order.status === 'Completed' && { color: globalStyles.colors.status.success },
                        order.status === 'Cancelled' && { color: '#D32F2F' },
                        order.status === 'Pending' && { color: '#1976D2' }
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={orderStyles.viewButton}
                      onPress={() => handleViewOrder(order)}
                    >
                      <Text style={orderStyles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Modal for Order Details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={orderStyles.modalContainer}>
            <View style={orderStyles.modalContent}>
              <TouchableOpacity 
                style={orderStyles.closeButton} 
                onPress={closeModal}
              >
                <FontAwesome5 name="times" size={22} color={globalStyles.colors.text.primary} />
              </TouchableOpacity>
              
              {selectedOrder && (
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
                >
                  <Text style={orderStyles.modalTitle}>
                    Order #{selectedOrder.id} Details
                  </Text>
                  
                  {/* Order Info Card with Edit Functionality */}
                  <View style={orderStyles.orderInfoCard}>
                    <View style={orderStyles.orderDetailSection}>
                      <Text style={orderStyles.orderDetailLabel}>Table Number:</Text>
                      <TextInput
                        style={[orderStyles.orderDetailValue, { fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 2 }]}
                        value={editingTable}
                        onChangeText={setEditingTable}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={orderStyles.orderDetailSection}>
                      <Text style={orderStyles.orderDetailLabel}>Order Time:</Text>
                      <Text style={orderStyles.orderDetailValue}>{selectedOrder.time}</Text>
                    </View>
                    
                    <View style={[orderStyles.orderDetailSection, { borderBottomWidth: 0 }]}>
                      <Text style={orderStyles.orderDetailLabel}>Status:</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {statusOptions.map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              orderStyles.statusBadge,
                              { marginRight: 5, marginVertical: 5 },
                              editingStatus === status && { 
                                borderWidth: 2,
                                borderColor: status === 'Preparing' ? '#F57F17' :
                                           status === 'Completed' ? globalStyles.colors.status.success :
                                           status === 'Cancelled' ? '#D32F2F' : '#1976D2'
                              },
                              status === 'Preparing' && { backgroundColor: '#FFF9C4' },
                              status === 'Completed' && { backgroundColor: globalStyles.colors.status.successBg },
                              status === 'Cancelled' && { backgroundColor: '#FFCDD2' },
                              status === 'Pending' && { backgroundColor: '#E3F2FD' }
                            ]}
                            onPress={() => setEditingStatus(status)}
                          >
                            <Text style={[
                              orderStyles.statusText,
                              status === 'Preparing' && { color: '#F57F17' },
                              status === 'Completed' && { color: globalStyles.colors.status.success },
                              status === 'Cancelled' && { color: '#D32F2F' },
                              status === 'Pending' && { color: '#1976D2' }
                            ]}>
                              {status}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  {/* Order Items Section with Add Button */}
                  <View style={orderStyles.orderItemsCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={orderStyles.orderItemsHeader}>Order Items</Text>
                      <TouchableOpacity 
                        style={[orderStyles.viewButton, { backgroundColor: globalStyles.colors.primary }]}
                        onPress={() => setShowAddItemModal(true)}
                      >
                        <Text style={[orderStyles.viewButtonText, { color: 'white' }]}>Add Item</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {(itemsLoading || menusLoading) ? (
                      <View style={orderStyles.loadingContainer}>
                        <ActivityIndicator size="small" color={globalStyles.colors.primary} />
                        <Text style={orderStyles.loadingText}>
                          Loading items...
                        </Text>
                      </View>
                    ) : orderItems.length > 0 ? (
                      <View style={orderStyles.itemsList}>
                        {/* Header row */}
                        <View style={orderStyles.orderItemsTableHeader}>
                          <Text style={[orderStyles.orderItemsTableHeaderText, { flex: 3 }]}>Item</Text>
                          <Text style={[orderStyles.orderItemsTableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                          <Text style={[orderStyles.orderItemsTableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
                          <Text style={[orderStyles.orderItemsTableHeaderText, { flex: 1.5, textAlign: 'center' }]}>Actions</Text>
                        </View>
                        
                        {/* Items with Edit/Delete Options */}
                        {orderItems.map((item, index) => (
                          <View key={index} style={orderStyles.orderItemRow}>
                            <Text style={[
                              orderStyles.orderItemName,
                              item.is_paid && { textDecorationLine: 'line-through', color: '#888' }
                            ]}>
                              {item.menu_name}
                            </Text>
                            
                            {editingItem && editingItem.orderitem_id === item.orderitem_id ? (
                              <TextInput
                                style={[orderStyles.orderItemQuantity, { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 0, textAlign: 'center' }]}
                                value={itemQuantity}
                                onChangeText={setItemQuantity}
                                keyboardType="numeric"
                              />
                            ) : (
                              <Text style={[
                                orderStyles.orderItemQuantity,
                                item.is_paid && { color: '#888' }
                              ]}>
                                {item.quantity}
                              </Text>
                            )}
                            
                            <Text style={[
                              orderStyles.orderItemPrice,
                              item.is_paid && { color: '#888' }
                            ]}>
                              ${item.amount.toFixed(2)}
                            </Text>
                            
                            <View style={{ flexDirection: 'row', flex: 1.5, justifyContent: 'flex-end' }}>
                              {editingItem && editingItem.orderitem_id === item.orderitem_id ? (
                                <>
                                  <TouchableOpacity 
                                    style={[orderStyles.iconButton, { backgroundColor: globalStyles.colors.primary }]}
                                    onPress={handleUpdateOrderItem}
                                  >
                                    <FontAwesome5 name="check" size={12} color="white" />
                                  </TouchableOpacity>
                                  <TouchableOpacity 
                                    style={[orderStyles.iconButton, { backgroundColor: '#888', marginLeft: 5 }]}
                                    onPress={() => setEditingItem(null)}
                                  >
                                    <FontAwesome5 name="times" size={12} color="white" />
                                  </TouchableOpacity>
                                </>
                              ) : (
                                <>
                                  <TouchableOpacity 
                                    style={[orderStyles.iconButton, { backgroundColor: '#2196F3' }]}
                                    onPress={() => handleEditItem(item)}
                                  >
                                    <FontAwesome5 name="edit" size={12} color="white" />
                                  </TouchableOpacity>
                                  <TouchableOpacity 
                                    style={[orderStyles.iconButton, { 
                                      backgroundColor: item.is_paid ? '#4CAF50' : '#FF9800',
                                      marginLeft: 5
                                    }]}
                                    onPress={() => handleToggleItemPaid(item)}
                                  >
                                    <FontAwesome5 name={item.is_paid ? "check-circle" : "money-bill"} size={12} color="white" />
                                  </TouchableOpacity>
                                  {isAdmin && (
                                    <TouchableOpacity 
                                      style={[orderStyles.iconButton, { backgroundColor: '#F44336', marginLeft: 5 }]}
                                      onPress={() => handleDeleteOrderItem(item)}
                                    >
                                      <FontAwesome5 name="trash" size={12} color="white" />
                                    </TouchableOpacity>
                                  )}
                                </>
                              )}
                            </View>
                          </View>
                        ))}
                        
                        {/* Price Summary */}
                        <View style={orderStyles.priceSummary}>
                          <View style={orderStyles.summaryRow}>
                            <Text style={orderStyles.summaryLabel}>Subtotal:</Text>
                            <Text style={orderStyles.summaryValue}>
                              ${calculateSubtotal(orderItems).toFixed(2)}
                            </Text>
                          </View>
                          
                          <View style={orderStyles.summaryRow}>
                            <Text style={orderStyles.summaryLabel}>Tax (10%):</Text>
                            <Text style={orderStyles.summaryValue}>
                              ${calculateTax(calculateSubtotal(orderItems)).toFixed(2)}
                            </Text>
                          </View>
                          
                          <View style={orderStyles.totalRow}>
                            <Text style={orderStyles.totalLabel}>Total:</Text>
                            <Text style={orderStyles.totalValue}>
                              ${calculateTotal(calculateSubtotal(orderItems)).toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={orderStyles.noItemsContainer}>
                        <FontAwesome5 
                          name="exclamation-circle" 
                          size={32} 
                          color={globalStyles.colors.text.secondary} 
                          style={orderStyles.noItemsIcon}
                        />
                        <Text style={orderStyles.noItemsText}>
                          No items found for this order.
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Action Buttons */}
                  <View style={orderStyles.modalActions}>
                    {isAdmin && (
                      <TouchableOpacity 
                        style={[orderStyles.modalActionButton, { backgroundColor: '#F44336' }]}
                        onPress={handleDeleteOrder}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          Delete Order
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={[orderStyles.modalActionButton, orderStyles.cancelButton]}
                      onPress={closeModal}
                    >
                      <Text style={orderStyles.cancelButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[orderStyles.modalActionButton, orderStyles.confirmButton]}
                      onPress={handleUpdateOrder}
                    >
                      <Text style={orderStyles.confirmButtonText}>
                        Update Order
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        
        {/* Modal for Adding New Order */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddOrderModal}
          onRequestClose={closeAddOrderModal}
        >
          <View style={orderStyles.modalContainer}>
            <View style={[orderStyles.modalContent, { maxHeight: '60%' }]}>
              <TouchableOpacity 
                style={orderStyles.closeButton} 
                onPress={closeAddOrderModal}
              >
                <FontAwesome5 name="times" size={22} color={globalStyles.colors.text.primary} />
              </TouchableOpacity>
              
              <Text style={orderStyles.modalTitle}>Create New Order</Text>
              
              {/* New Order Form */}
              <View style={{ padding: 15 }}>
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: '500' }}>Table Number:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 4,
                      padding: 10,
                      fontSize: 16
                    }}
                    placeholder="Enter table number"
                    value={newOrderTable}
                    onChangeText={setNewOrderTable}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: '500' }}>Initial Status:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {statusOptions.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          orderStyles.statusBadge,
                          { marginRight: 10, marginBottom: 10 },
                          newOrderStatus === status && { 
                            borderWidth: 2,
                            borderColor: status === 'Preparing' ? '#F57F17' :
                                       status === 'Completed' ? globalStyles.colors.status.success :
                                       status === 'Cancelled' ? '#D32F2F' : '#1976D2'
                          },
                          status === 'Preparing' && { backgroundColor: '#FFF9C4' },
                          status === 'Completed' && { backgroundColor: globalStyles.colors.status.successBg },
                          status === 'Cancelled' && { backgroundColor: '#FFCDD2' },
                          status === 'Pending' && { backgroundColor: '#E3F2FD' }
                        ]}
                        onPress={() => setNewOrderStatus(status)}
                      >
                        <Text style={[
                          orderStyles.statusText,
                          status === 'Preparing' && { color: '#F57F17' },
                          status === 'Completed' && { color: globalStyles.colors.status.success },
                          status === 'Cancelled' && { color: '#D32F2F' },
                          status === 'Pending' && { color: '#1976D2' }
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={orderStyles.modalActions}>
                  <TouchableOpacity 
                    style={[orderStyles.modalActionButton, orderStyles.cancelButton]}
                    onPress={closeAddOrderModal}
                  >
                    <Text style={orderStyles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[orderStyles.modalActionButton, orderStyles.confirmButton]}
                    onPress={handleCreateOrder}
                  >
                    <Text style={orderStyles.confirmButtonText}>
                      Create Order
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Modal for Adding Order Items */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddItemModal}
          onRequestClose={closeAddItemModal}
        >
          <View style={orderStyles.modalContainer}>
            <View style={[orderStyles.modalContent, { maxHeight: '70%' }]}>
              <TouchableOpacity 
                style={orderStyles.closeButton} 
                onPress={closeAddItemModal}
              >
                <FontAwesome5 name="times" size={22} color={globalStyles.colors.text.primary} />
              </TouchableOpacity>
              
              <Text style={orderStyles.modalTitle}>Add Item to Order #{selectedOrder?.id}</Text>
              
              {/* Add Item Form */}
              <View style={{ padding: 15 }}>
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: '500' }}>Menu Item:</Text>
                  <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 }}>
                    {menuList.map((menu) => (
                      <TouchableOpacity
                        key={menu.menu_id}
                        style={{
                          padding: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: '#eee',
                          backgroundColor: selectedMenuItem?.menu_id === menu.menu_id ? '#e3f2fd' : 'white',
                        }}
                        onPress={() => setSelectedMenuItem(menu)}
                      >
                        <Text style={{ fontSize: 16 }}>
                          {menu.menu_name} - ${menu.price?.toFixed(2) || '0.00'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: '500' }}>Quantity:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 4,
                      padding: 10,
                      fontSize: 16
                    }}
                    placeholder="Enter quantity"
                    value={itemQuantity}
                    onChangeText={setItemQuantity}
                    keyboardType="numeric"
                  />
                </View>
                
                {selectedMenuItem && (
                  <View style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 4, marginBottom: 15 }}>
                    <Text style={{ fontSize: 16 }}>
                      Item: {selectedMenuItem.menu_name}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 5 }}>
                      Price: ${selectedMenuItem.price?.toFixed(2) || '0.00'} x {itemQuantity} = ${(selectedMenuItem.price * parseInt(itemQuantity || '0')).toFixed(2)}
                    </Text>
                  </View>
                )}
                
                <View style={orderStyles.modalActions}>
                  <TouchableOpacity 
                    style={[orderStyles.modalActionButton, orderStyles.cancelButton]}
                    onPress={closeAddItemModal}
                  >
                    <Text style={orderStyles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[orderStyles.modalActionButton, orderStyles.confirmButton]}
                    onPress={handleAddOrderItem}
                  >
                    <Text style={orderStyles.confirmButtonText}>
                      Add Item
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}