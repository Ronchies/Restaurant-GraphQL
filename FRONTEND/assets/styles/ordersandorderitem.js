
import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

const ordersandorderitemStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.background,
  },
  
  // Header and navigation styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    marginLeft: 5,
    color: globalStyles.colors.primary,
    fontWeight: '500',
  },
  
  // Order summary card styles
  summaryCard: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    padding: globalStyles.spacing.xlarge,
    ...globalStyles.shadows.card,
    marginBottom: globalStyles.spacing.medium,
  },
  summaryTitle: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginBottom: globalStyles.spacing.large,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: globalStyles.spacing.medium,
    alignItems: 'center',
  },
  summaryLabel: {
    color: globalStyles.colors.text.secondary,
    fontSize: globalStyles.typography.fontSize.regular,
  },
  summaryValue: {
    fontWeight: globalStyles.typography.fontWeight.medium,
    fontSize: globalStyles.typography.fontSize.regular,
  },
  
  // Section title styles
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: globalStyles.spacing.large,
  },
  sectionTitle: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.pill,
    paddingHorizontal: globalStyles.spacing.xlarge,
    paddingVertical: globalStyles.spacing.medium,
    alignSelf: 'flex-start',
    ...globalStyles.shadows.small,
  },
  sectionTitleText: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.medium,
  },
  
  // Add Button styles
  addButton: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: globalStyles.borderRadius.pill,
    paddingHorizontal: globalStyles.spacing.large,
    paddingVertical: globalStyles.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    ...globalStyles.shadows.small,
  },
  addButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.medium,
    marginLeft: globalStyles.spacing.small,
  },
  
  // Order item styles
  orderItemCard: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    padding: globalStyles.spacing.large,
    marginBottom: globalStyles.spacing.medium,
    ...globalStyles.shadows.small,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemName: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginBottom: globalStyles.spacing.xsmall,
  },
  orderItemPrice: {
    color: globalStyles.colors.text.secondary,
  },
  orderItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Item action buttons
  itemButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: globalStyles.spacing.small,
  },
  editButton: {
    backgroundColor: globalStyles.colors.primary + '20',
  },
  deleteButton: {
    backgroundColor: globalStyles.colors.status.errorBg,
  },
  
  // Status badge styles (consistent with orders.jsx)
  statusBadge: {
    paddingHorizontal: globalStyles.spacing.medium,
    paddingVertical: globalStyles.spacing.xsmall,
    borderRadius: globalStyles.borderRadius.large,
    marginRight: globalStyles.spacing.medium,
  },
  statusText: {
    fontSize: globalStyles.typography.fontSize.small,
  },
  
  // Action buttons
  actionButton: {
    backgroundColor: globalStyles.colors.status.warning,
    paddingVertical: globalStyles.spacing.large,
    borderRadius: globalStyles.borderRadius.pill,
    alignItems: 'center',
    marginVertical: globalStyles.spacing.xlarge,
  },
  actionButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.medium,
  },
  
  // Empty state
  emptyContainer: {
    padding: globalStyles.spacing.xlarge,
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    ...globalStyles.shadows.small,
  },
  emptyText: {
    color: globalStyles.colors.text.light,
    fontSize: globalStyles.typography.fontSize.medium,
    marginBottom: globalStyles.spacing.large,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: globalStyles.spacing.large,
  },
  modalContainer: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    width: '100%',
    maxHeight: '80%',
    ...globalStyles.shadows.modal,
  },
  confirmationModal: {
    maxHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
    padding: globalStyles.spacing.large,
  },
  modalTitle: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  modalContent: {
    padding: globalStyles.spacing.large,
  },
  inputLabel: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.medium,
    marginBottom: globalStyles.spacing.small,
    marginTop: globalStyles.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
    borderRadius: globalStyles.borderRadius.medium,
    padding: globalStyles.spacing.medium,
    fontSize: globalStyles.typography.fontSize.medium,
  },
  menuSelectionContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
    borderRadius: globalStyles.borderRadius.medium,
    marginBottom: globalStyles.spacing.medium,
  },
  menuItemOption: {
    padding: globalStyles.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemOptionSelected: {
    backgroundColor: globalStyles.colors.primary + '20',
  },
  menuItemOptionText: {
    fontSize: globalStyles.typography.fontSize.medium,
  },
  menuItemOptionPrice: {
    color: globalStyles.colors.text.secondary,
  },
  
  // Edit modal specific styles
  selectedItemInfo: {
    backgroundColor: globalStyles.colors.background,
    padding: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    marginBottom: globalStyles.spacing.medium,
  },
  selectedItemName: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginBottom: globalStyles.spacing.xsmall,
  },
  selectedItemPrice: {
    color: globalStyles.colors.text.secondary,
  },
  
  // Switch container
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: globalStyles.spacing.medium,
  },
  toggleButton: {
    backgroundColor: globalStyles.colors.background,
    paddingHorizontal: globalStyles.spacing.large,
    paddingVertical: globalStyles.spacing.small,
    borderRadius: globalStyles.borderRadius.pill,
  },
  toggleButtonActive: {
    backgroundColor: globalStyles.colors.status.success,
  },
  toggleButtonText: {
    color: globalStyles.colors.text.secondary,
  },
  toggleButtonTextActive: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  
  // Total display
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: globalStyles.spacing.large,
    padding: globalStyles.spacing.medium,
    backgroundColor: globalStyles.colors.background,
    borderRadius: globalStyles.borderRadius.medium,
  },
  totalLabel: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  totalValue: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.primary,
  },
  
  // Modal button
  modalButton: {
    backgroundColor: globalStyles.colors.primary,
    paddingVertical: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.pill,
    alignItems: 'center',
    marginTop: globalStyles.spacing.xlarge,
  },
  modalButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.medium,
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  
  // Delete confirmation
  confirmationText: {
    fontSize: globalStyles.typography.fontSize.medium,
    textAlign: 'center',
    marginBottom: globalStyles.spacing.large,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.pill,
    alignItems: 'center',
    marginHorizontal: globalStyles.spacing.small,
  },
  cancelButton: {
    backgroundColor: globalStyles.colors.background,
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
  },
  cancelButtonText: {
    color: globalStyles.colors.text.dark,
  },
  deleteConfirmButton: {
    backgroundColor: globalStyles.colors.status.error,
  },
  deleteConfirmButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  
  // Tab navigation styles
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: globalStyles.colors.white,
    paddingVertical: globalStyles.spacing.large,
    borderTopWidth: 1,
    borderTopColor: globalStyles.colors.border,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: globalStyles.typography.fontSize.small,
    color: globalStyles.colors.text.light,
    marginTop: globalStyles.spacing.xsmall,
  },
  tabTextActive: {
    color: globalStyles.colors.primary,
  },
  
  // Helper functions for status colors
  getStatusBadgeStyle: (status) => {
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
  },
  getStatusTextStyle: (status) => {
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
  },
});

export default ordersandorderitemStyles;