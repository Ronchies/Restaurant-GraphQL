import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import globalStyles from '../../assets/styles/globalStyles';
import ordersandorderitemStyles from '../../assets/styles/ordersandorderitem';
import { useQuery, useMutation } from "@apollo/client";
import GET_ORDERSITEMS from "../../app/queries/orderitemsQueries";
import GET_MENUS from "../../app/queries/menuQueries";
import { DELETE_ORDERITEM, ADD_ORDERITEM, UPDATE_ORDERITEM } from "../../app/mutations/orderMutation";

export default function OrderAndOrderItem() {
  // Get the parameters passed from the orders screen
  const params = useLocalSearchParams();
  const { orderId, table, time, price, status, userRole, userId } = params;
  
  console.log("Order detail page params:", { orderId, table, time, price, status, userRole });
  
  // State for processed order items
  const [orderItems, setOrderItems] = useState([]);
  const [availableMenuItems, setAvailableMenuItems] = useState([]);
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // Form states
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [isPaid, setIsPaid] = useState(false);

  // Fetch order items data from GraphQL API
  const { 
    loading: itemsLoading, 
    error: itemsError, 
    data: itemsData,
    refetch: refetchItems
  } = useQuery(GET_ORDERSITEMS);
  
  // Fetch menus data for item details
  const { 
    loading: menusLoading, 
    error: menusError, 
    data: menusData 
  } = useQuery(GET_MENUS);

  // Mutations
  const [deleteOrderItem, { loading: deleteLoading }] = useMutation(DELETE_ORDERITEM, {
    onCompleted: (data) => {
      console.log("Item deleted:", data);
      Alert.alert("Success", "Order item successfully deleted");
      refetchItems();
      setIsDeleteModalVisible(false);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      Alert.alert("Error", "Failed to delete order item");
    }
  });

  const [addOrderItem, { loading: addLoading }] = useMutation(ADD_ORDERITEM, {
    onCompleted: (data) => {
      console.log("Item added:", data);
      Alert.alert("Success", "Order item successfully added");
      refetchItems();
      setIsAddModalVisible(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Add error:", error);
      Alert.alert("Error", "Failed to add order item");
    }
  });

  const [updateOrderItem, { loading: updateLoading }] = useMutation(UPDATE_ORDERITEM, {
    onCompleted: (data) => {
      console.log("Item updated:", data);
      Alert.alert("Success", "Order item successfully updated");
      refetchItems();
      setIsEditModalVisible(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update order item");
    }
  });

  // Process order items when data is available
  useEffect(() => {
    if (itemsData?.orderitems && menusData?.menus && orderId) {
      console.log("Processing order items for order ID:", orderId);
      console.log("Total available order items:", itemsData.orderitems.length);
      
      // Filter items by order ID
      const filteredItems = itemsData.orderitems.filter(item => {
        const itemOrderId = parseInt(item.order_id, 10);
        const orderIdNum = parseInt(orderId, 10);
        const isMatch = itemOrderId === orderIdNum;
        console.log(`Comparing item order_id: ${item.order_id} (${typeof item.order_id}) with orderId: ${orderIdNum} (${typeof orderIdNum}) = ${isMatch}`);
        return isMatch;
      });
      
      console.log("Filtered items for this order:", filteredItems.length);
      
      // Map order items to include menu details
      const processedItems = filteredItems.map(item => {
        // Find corresponding menu item
        const menuItem = menusData.menus.find(
          menu => menu.menu_id === item.menu_id
        );
        
        console.log("Found menu item for order item:", menuItem?.menu_name);
        
        return {
          id: item.orderitem_id,
          rawData: item, // Keep raw data for mutations
          name: menuItem ? menuItem.menu_name : 'Unknown Item',
          quantity: item.quantity,
          price: menuItem ? `$${menuItem.price.toFixed(2)}` : '$0.00',
          rawPrice: menuItem ? menuItem.price : 0,
          status: status || 'Preparing', // Using order status as default
          isPaid: item.is_paid,
          amount: item.amount,
          menuId: item.menu_id
        };
      });
      
      console.log("Final processed items:", processedItems.length);
      setOrderItems(processedItems);
      
      // Prepare available menu items for add modal
      const menuItems = menusData.menus.map(menu => ({
        id: menu.menu_id,
        name: menu.menu_name,
        price: menu.price
      }));
      setAvailableMenuItems(menuItems);
    }
  }, [itemsData, menusData, orderId, status]);

  // Function to go back to orders screen
  const handleBack = () => {
    router.back();
  };

  // Reset form values
  const resetForm = () => {
    setSelectedMenuItem(null);
    setSelectedOrderItem(null);
    setQuantity('1');
    setIsPaid(false);
  };

  // Handle add order item
  const handleAddOrderItem = () => {
    if (!selectedMenuItem || !quantity || quantity <= 0) {
      Alert.alert("Error", "Please select a menu item and enter a valid quantity");
      return;
    }

    const orderIdNum = parseInt(orderId, 10);
    const menuIdNum = parseInt(selectedMenuItem.id, 10);
    const quantityNum = parseInt(quantity, 10);
    const amount = selectedMenuItem.price * quantityNum;
    const userIdNum = parseInt(userId, 10) || 1; // Fallback to userId 1 if not provided

    addOrderItem({
      variables: {
        orderItem: {
          order_id: orderIdNum,
          menu_id: menuIdNum,
          quantity: quantityNum,
          amount: amount
        },
        userId: userIdNum
      }
    });
  };

  // Handle update order item
  const handleUpdateOrderItem = () => {
    if (!selectedOrderItem || !quantity || quantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    const orderIdNum = parseInt(orderId, 10);
    const menuIdNum = parseInt(selectedOrderItem.menuId, 10);
    const quantityNum = parseInt(quantity, 10);
    const amount = selectedOrderItem.rawPrice * quantityNum;
    const userIdNum = parseInt(userId, 10) || 1; // Fallback to userId 1 if not provided
    const orderitemIdNum = parseInt(selectedOrderItem.id, 10);

    updateOrderItem({
      variables: {
        orderitemId: orderitemIdNum,
        orderItem: {
          order_id: orderIdNum,
          menu_id: menuIdNum,
          quantity: quantityNum,
          amount: amount,
          is_paid: isPaid
        },
        userId: userIdNum
      }
    });
  };

  // Handle delete order item
  const handleDeleteOrderItem = () => {
    if (!selectedOrderItem) {
      Alert.alert("Error", "No item selected for deletion");
      return;
    }

    const orderitemIdNum = parseInt(selectedOrderItem.id, 10);
    const userIdNum = parseInt(userId, 10) || 1; // Fallback to userId 1 if not provided

    deleteOrderItem({
      variables: {
        orderitemId: orderitemIdNum,
        userId: userIdNum
      }
    });
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedOrderItem(item);
    setQuantity(item.quantity.toString());
    setIsPaid(item.isPaid);
    setIsEditModalVisible(true);
  };

  // Open delete confirmation
  const openDeleteModal = (item) => {
    setSelectedOrderItem(item);
    setIsDeleteModalVisible(true);
  };

  // Additional order details
  const orderDetails = {
    table: table || 'Unknown',
    time: time || 'Unknown',
    date: new Date().toLocaleDateString(),
    total: price || '$0.00',
  };

  // Calculate total based on actual items
  const calculateTotal = () => {
    if (orderItems.length === 0) return orderDetails.total;
    
    const total = orderItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0).toFixed(2);
    
    return `$${total}`;
  };
  
  // Handle retry loading
  const handleRetry = () => {
    refetchItems();
  };

  // Check if user is authorized to edit/add items
  const canEditItems = userRole === 'employee' || userRole === 'admin' || !userRole;
  // Admin can only delete items, not edit or add
  const canAddItems = (userRole === 'employee' || !userRole) && status !== 'Completed' && status !== 'Cancelled';
  // Any role that can see this page can cancel the order
  const canCancelOrder = status !== 'Cancelled' && status !== 'Completed';

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <StatusBar barStyle="dark-content" backgroundColor={globalStyles.colors.white} />
      
      {/* Back button */}
      <View style={[globalStyles.layout.container, { marginTop: globalStyles.spacing.large }]}>
        <TouchableOpacity 
          onPress={handleBack}
          style={ordersandorderitemStyles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={16} color={globalStyles.colors.primary} />
          <Text style={ordersandorderitemStyles.backButtonText}>Back To Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary Card */}
      <View style={[globalStyles.layout.container, { marginTop: globalStyles.spacing.xsmall, marginBottom: 0 }]}>
        <View style={[ordersandorderitemStyles.summaryCard, { marginBottom: globalStyles.spacing.small }]}>
          <Text style={ordersandorderitemStyles.summaryTitle}>Order #{orderId}</Text>

          <View>
            <View style={ordersandorderitemStyles.summaryRow}>
              <Text style={ordersandorderitemStyles.summaryLabel}>Table:</Text>
              <Text style={ordersandorderitemStyles.summaryValue}>{orderDetails.table}</Text>
            </View>
            <View style={ordersandorderitemStyles.summaryRow}>
              <Text style={ordersandorderitemStyles.summaryLabel}>Time:</Text>
              <Text style={ordersandorderitemStyles.summaryValue}>{orderDetails.time}</Text>
            </View>
            <View style={ordersandorderitemStyles.summaryRow}>
              <Text style={ordersandorderitemStyles.summaryLabel}>Date:</Text>
              <Text style={ordersandorderitemStyles.summaryValue}>{orderDetails.date}</Text>
            </View>
            <View style={ordersandorderitemStyles.summaryRow}>
              <Text style={ordersandorderitemStyles.summaryLabel}>Total:</Text>
              <Text style={ordersandorderitemStyles.summaryValue}>{calculateTotal()}</Text>
            </View>
            <View style={ordersandorderitemStyles.summaryRow}>
              <Text style={ordersandorderitemStyles.summaryLabel}>Status:</Text>
              <View style={[
                ordersandorderitemStyles.statusBadge,
                ordersandorderitemStyles.getStatusBadgeStyle(status)
              ]}>
                <Text style={[
                  ordersandorderitemStyles.statusText,
                  ordersandorderitemStyles.getStatusTextStyle(status)
                ]}>
                  {status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Order Items Section */}
      <View style={[globalStyles.layout.container, { marginTop: 0 }]}>
        <View style={ordersandorderitemStyles.sectionHeaderContainer}>
          <View style={ordersandorderitemStyles.sectionTitle}>
            <Text style={ordersandorderitemStyles.sectionTitleText}>Order Items</Text>
          </View>
          
          {/* Add item button - only for employees and active orders */}
          {canAddItems && (
            <TouchableOpacity 
              style={ordersandorderitemStyles.addButton}
              onPress={() => setIsAddModalVisible(true)}
            >
              <FontAwesome5 name="plus" size={14} color={globalStyles.colors.white} />
              <Text style={ordersandorderitemStyles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Loading State */}
        {(itemsLoading || menusLoading) && (
          <View style={globalStyles.state.loading}>
            <ActivityIndicator size="large" color={globalStyles.colors.primary} />
            <Text style={globalStyles.text.loadingText}>Loading order items...</Text>
          </View>
        )}

        {/* Error State */}
        {(itemsError || menusError) && (
          <View style={globalStyles.state.error}>
            <Text style={globalStyles.text.errorText}>Failed to load order items</Text>
            <TouchableOpacity 
              style={[globalStyles.buttons.primary, { marginTop: globalStyles.spacing.medium }]}
              onPress={handleRetry}
            >
              <Text style={globalStyles.buttons.primaryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!itemsLoading && !menusLoading && !itemsError && !menusError && orderItems.length === 0 && (
          <View style={ordersandorderitemStyles.emptyContainer}>
            <Text style={ordersandorderitemStyles.emptyText}>No items found for this order.</Text>
            {canAddItems && (
              <TouchableOpacity 
                style={[ordersandorderitemStyles.actionButton, { backgroundColor: globalStyles.colors.primary }]}
                onPress={() => setIsAddModalVisible(true)}
              >
                <Text style={ordersandorderitemStyles.actionButtonText}>Add First Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Order Items */}
        {!itemsLoading && !menusLoading && !itemsError && !menusError && orderItems.map((item, index) => (
          <View key={index} style={ordersandorderitemStyles.orderItemCard}>
            <View style={ordersandorderitemStyles.orderItemHeader}>
              <View>
                <Text style={ordersandorderitemStyles.orderItemName}>{item.name}</Text>
                <Text style={ordersandorderitemStyles.orderItemPrice}>{item.price} × {item.quantity} = ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</Text>
              </View>
              
              <View style={ordersandorderitemStyles.orderItemActions}>
                <View style={[
                  ordersandorderitemStyles.statusBadge,
                  item.isPaid 
                    ? ordersandorderitemStyles.getStatusBadgeStyle('Completed') 
                    : ordersandorderitemStyles.getStatusBadgeStyle(item.status)
                ]}>
                  <Text style={[
                    ordersandorderitemStyles.statusText,
                    item.isPaid
                      ? ordersandorderitemStyles.getStatusTextStyle('Completed')
                      : ordersandorderitemStyles.getStatusTextStyle(item.status)
                  ]}>
                    {item.isPaid ? 'Paid' : item.status}
                  </Text>
                </View>
                
                {/* Item Actions */}
                <View style={ordersandorderitemStyles.itemButtonsContainer}>
                  {/* Edit Button - Only for employees */}
                  {canEditItems && !item.isPaid && status !== 'Cancelled' && status !== 'Completed' && (
                    <TouchableOpacity 
                      style={[ordersandorderitemStyles.itemActionButton, ordersandorderitemStyles.editButton]}
                      onPress={() => openEditModal(item)}
                    >
                      <FontAwesome5 name="edit" size={14} color={globalStyles.colors.primary} />
                    </TouchableOpacity>
                  )}
                  
                  {/* Delete Button - For both admin and employees */}
                  {canEditItems && (
                    <TouchableOpacity 
                      style={[ordersandorderitemStyles.itemActionButton, ordersandorderitemStyles.deleteButton]}
                      onPress={() => openDeleteModal(item)}
                    >
                      <FontAwesome5 name="trash" size={14} color={globalStyles.colors.status.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={ordersandorderitemStyles.modalOverlay}>
          <View style={ordersandorderitemStyles.modalContainer}>
            <View style={ordersandorderitemStyles.modalHeader}>
              <Text style={ordersandorderitemStyles.modalTitle}>Add Order Item</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color={globalStyles.colors.text.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={ordersandorderitemStyles.modalContent}>
              {/* Menu Item Selection */}
              <Text style={ordersandorderitemStyles.inputLabel}>Select Menu Item</Text>
              <ScrollView 
                style={ordersandorderitemStyles.menuSelectionContainer}
                nestedScrollEnabled={true}
              >
                {availableMenuItems.map((menuItem) => (
                  <TouchableOpacity
                    key={menuItem.id}
                    style={[
                      ordersandorderitemStyles.menuItemOption,
                      selectedMenuItem?.id === menuItem.id && ordersandorderitemStyles.menuItemOptionSelected
                    ]}
                    onPress={() => setSelectedMenuItem(menuItem)}
                  >
                    <Text style={ordersandorderitemStyles.menuItemOptionText}>{menuItem.name}</Text>
                    <Text style={ordersandorderitemStyles.menuItemOptionPrice}>${menuItem.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Quantity Input */}
              <Text style={ordersandorderitemStyles.inputLabel}>Quantity</Text>
              <TextInput
                style={ordersandorderitemStyles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
              
              {/* Total */}
              {selectedMenuItem && (
                <View style={ordersandorderitemStyles.totalContainer}>
                  <Text style={ordersandorderitemStyles.totalLabel}>Total Amount:</Text>
                  <Text style={ordersandorderitemStyles.totalValue}>
                    ${(selectedMenuItem.price * (parseInt(quantity, 10) || 0)).toFixed(2)}
                  </Text>
                </View>
              )}
              
              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  ordersandorderitemStyles.modalButton,
                  addLoading && ordersandorderitemStyles.modalButtonDisabled
                ]}
                onPress={handleAddOrderItem}
                disabled={addLoading}
              >
                {addLoading ? (
                  <ActivityIndicator size="small" color={globalStyles.colors.white} />
                ) : (
                  <Text style={ordersandorderitemStyles.modalButtonText}>Add Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={ordersandorderitemStyles.modalOverlay}>
          <View style={ordersandorderitemStyles.modalContainer}>
            <View style={ordersandorderitemStyles.modalHeader}>
              <Text style={ordersandorderitemStyles.modalTitle}>Edit Order Item</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color={globalStyles.colors.text.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={ordersandorderitemStyles.modalContent}>
              {/* Item Info */}
              {selectedOrderItem && (
                <View style={ordersandorderitemStyles.selectedItemInfo}>
                  <Text style={ordersandorderitemStyles.selectedItemName}>{selectedOrderItem.name}</Text>
                  <Text style={ordersandorderitemStyles.selectedItemPrice}>{selectedOrderItem.price} per unit</Text>
                </View>
              )}
              
              {/* Quantity Input */}
              <Text style={ordersandorderitemStyles.inputLabel}>Quantity</Text>
              <TextInput
                style={ordersandorderitemStyles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
              
              {/* Payment Status */}
              <View style={ordersandorderitemStyles.switchContainer}>
                <Text style={ordersandorderitemStyles.inputLabel}>Mark as Paid</Text>
                <TouchableOpacity
                  style={[
                    ordersandorderitemStyles.toggleButton,
                    isPaid && ordersandorderitemStyles.toggleButtonActive
                  ]}
                  onPress={() => setIsPaid(!isPaid)}
                >
                  <Text style={[
                    ordersandorderitemStyles.toggleButtonText,
                    isPaid && ordersandorderitemStyles.toggleButtonTextActive
                  ]}>
                    {isPaid ? 'Paid' : 'Not Paid'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Total */}
              {selectedOrderItem && (
                <View style={ordersandorderitemStyles.totalContainer}>
                  <Text style={ordersandorderitemStyles.totalLabel}>Total Amount:</Text>
                  <Text style={ordersandorderitemStyles.totalValue}>
                    ${(selectedOrderItem.rawPrice * (parseInt(quantity, 10) || 0)).toFixed(2)}
                  </Text>
                </View>
              )}
              
              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  ordersandorderitemStyles.modalButton,
                  updateLoading && ordersandorderitemStyles.modalButtonDisabled
                ]}
                onPress={handleUpdateOrderItem}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color={globalStyles.colors.white} />
                ) : (
                  <Text style={ordersandorderitemStyles.modalButtonText}>Update Item</Text>
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
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={ordersandorderitemStyles.modalOverlay}>
          <View style={[ordersandorderitemStyles.modalContainer, ordersandorderitemStyles.confirmationModal]}>
            <View style={ordersandorderitemStyles.modalHeader}>
              <Text style={ordersandorderitemStyles.modalTitle}>Confirm Deletion</Text>
              <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color={globalStyles.colors.text.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={ordersandorderitemStyles.modalContent}>
              {selectedOrderItem && (
                <Text style={ordersandorderitemStyles.confirmationText}>
                  Are you sure you want to delete "{selectedOrderItem.name}" from this order?
                </Text>
              )}
              
              <View style={ordersandorderitemStyles.confirmationButtons}>
                <TouchableOpacity
                  style={[ordersandorderitemStyles.confirmButton, ordersandorderitemStyles.cancelButton]}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={ordersandorderitemStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    ordersandorderitemStyles.confirmButton, 
                    ordersandorderitemStyles.deleteConfirmButton,
                    deleteLoading && ordersandorderitemStyles.modalButtonDisabled
                  ]}
                  onPress={handleDeleteOrderItem}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color={globalStyles.colors.white} />
                  ) : (
                    <Text style={ordersandorderitemStyles.deleteConfirmButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Added bottom padding for better scrolling experience */}
      <View style={{ height: globalStyles.spacing.xlarge * 2 }} />
    </ScrollView>
  );
}