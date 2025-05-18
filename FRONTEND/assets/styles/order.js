import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

const orderStyles = StyleSheet.create({
  // Filter section
  filtersContainer: {
    marginBottom: globalStyles.spacing.large,
  },
  filterButton: {
    paddingHorizontal: globalStyles.spacing.large,
    paddingVertical: globalStyles.spacing.medium,
    marginRight: 10,
    borderRadius: globalStyles.borderRadius.pill,
    backgroundColor: globalStyles.colors.category.default,
  },
  activeFilterButton: {
    backgroundColor: globalStyles.colors.primary,
  },
  activeAllButton: {
    backgroundColor: globalStyles.colors.secondary,
  },
  filterText: {
    fontSize: globalStyles.typography.fontSize.regular,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  activeFilterText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  activeAllText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },

  // Order cards
  ordersList: {
    marginTop: globalStyles.spacing.medium,
  },
  orderCard: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    marginBottom: globalStyles.spacing.medium,
    padding: globalStyles.spacing.large,
    ...globalStyles.shadows.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: globalStyles.spacing.xsmall,
  },
  orderId: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.medium,
    color: globalStyles.colors.text.primary,
    marginBottom: globalStyles.spacing.xsmall,
  },
  rightSection: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.small,
    borderRadius: globalStyles.borderRadius.medium,
    marginBottom: globalStyles.spacing.small,
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    fontSize: globalStyles.typography.fontSize.small,
    fontWeight: globalStyles.typography.fontWeight.medium,
    textAlign: 'center',
  },
  orderInfo: {
    fontSize: globalStyles.typography.fontSize.small,
    color: globalStyles.colors.text.secondary,
    marginBottom: globalStyles.spacing.xsmall,
  },
  orderPrice: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.text.primary,
  },
  viewButton: {
    backgroundColor: globalStyles.colors.accent,
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.large,
    borderRadius: globalStyles.borderRadius.pill,
  },
  viewButtonText: {
    color: globalStyles.colors.white,
    fontSize: globalStyles.typography.fontSize.small,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },

  // Loading and empty states
  loadingContainer: {
    padding: globalStyles.spacing.xlarge,
    alignItems: "center",
  },
  loadingText: {
    marginTop: globalStyles.spacing.medium,
    fontSize: globalStyles.typography.fontSize.medium,
    color: globalStyles.colors.text.light,
  },
  emptyContainer: {
    padding: globalStyles.spacing.xlarge,
    alignItems: "center",
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.medium,
    ...globalStyles.shadows.small,
  },
  emptyText: {
    fontSize: globalStyles.typography.fontSize.medium,
    color: globalStyles.colors.text.secondary,
  },
  
  // Order details section (for expanded view)
  orderDetailHeader: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginBottom: globalStyles.spacing.medium,
  },
  itemsList: {
    marginTop: globalStyles.spacing.medium,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: globalStyles.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
  },
  itemName: {
    flex: 3,
    fontSize: globalStyles.typography.fontSize.regular,
  },
  itemQuantity: {
    flex: 1,
    fontSize: globalStyles.typography.fontSize.regular,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    fontSize: globalStyles.typography.fontSize.regular,
    textAlign: 'right',
  },
  totalSection: {
    marginTop: globalStyles.spacing.large,
    borderTopWidth: 1,
    borderTopColor: globalStyles.colors.border,
    paddingTop: globalStyles.spacing.medium,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: globalStyles.spacing.small,
  },
  totalLabel: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.secondary,
  },
  totalValue: {
    fontSize: globalStyles.typography.fontSize.regular,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  grandTotal: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  
  // Action buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: globalStyles.spacing.xlarge,
  },
  actionButton: {
    flex: 1,
    paddingVertical: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: globalStyles.spacing.xsmall,
  },
  primaryActionButton: {
    backgroundColor: globalStyles.colors.primary,
  },
  secondaryActionButton: {
    backgroundColor: globalStyles.colors.secondary,
  },
  actionButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: globalStyles.spacing.medium,
  },
  modalContent: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    width: '95%',
    maxHeight: '85%',
    padding: globalStyles.spacing.large,
    ...globalStyles.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: globalStyles.spacing.medium,
    paddingBottom: globalStyles.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
  },
  modalTitle: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.primary,
    textAlign: 'center',
    marginVertical: globalStyles.spacing.medium,
  },
  closeButton: {
    position: 'absolute',
    top: globalStyles.spacing.medium,
    right: globalStyles.spacing.medium,
    backgroundColor: globalStyles.colors.background,
    borderRadius: 20,
    padding: globalStyles.spacing.small,
    zIndex: 10,
  },

  // Order info card in modal
  orderInfoCard: {
    backgroundColor: globalStyles.colors.background,
    borderRadius: globalStyles.borderRadius.medium,
    padding: globalStyles.spacing.medium,
    marginBottom: globalStyles.spacing.large,
    ...globalStyles.shadows.small,
  },
  orderDetailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: globalStyles.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
  },
  orderDetailLabel: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.secondary,
  },
  orderDetailValue: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.primary,
  },

  // Order items card in modal
  orderItemsCard: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.medium,
    padding: globalStyles.spacing.medium,
    marginBottom: globalStyles.spacing.large,
    ...globalStyles.shadows.small,
  },
  orderItemsHeader: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginBottom: globalStyles.spacing.medium,
    color: globalStyles.colors.text.primary,
  },
  orderItemsTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: globalStyles.spacing.small,
    borderBottomWidth: 2,
    borderBottomColor: globalStyles.colors.primary,
    marginBottom: globalStyles.spacing.small,
  },
  orderItemsTableHeaderText: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.regular,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: globalStyles.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.border,
  },
  orderItemName: {
    flex: 3,
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.primary,
  },
  orderItemQuantity: {
    flex: 1,
    fontSize: globalStyles.typography.fontSize.regular,
    textAlign: 'center',
    fontWeight: globalStyles.typography.fontWeight.medium,
    color: globalStyles.colors.text.primary,
  },
  orderItemPrice: {
    flex: 1,
    fontSize: globalStyles.typography.fontSize.regular,
    textAlign: 'right',
    fontWeight: globalStyles.typography.fontWeight.medium,
    color: globalStyles.colors.text.primary,
  },

  // Price summary in modal
  priceSummary: {
    marginTop: globalStyles.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: globalStyles.colors.border,
    paddingTop: globalStyles.spacing.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: globalStyles.spacing.small,
  },
  summaryLabel: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.secondary,
  },
  summaryValue: {
    fontSize: globalStyles.typography.fontSize.regular,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: globalStyles.spacing.small,
    paddingTop: globalStyles.spacing.small,
    borderTopWidth: 1,
    borderTopColor: globalStyles.colors.border,
  },
  totalLabel: {
    fontSize: globalStyles.typography.fontSize.regular,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  totalValue: {
    fontSize: globalStyles.typography.fontSize.medium,
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.primary,
  },

  // Modal action buttons
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: globalStyles.spacing.medium,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: globalStyles.spacing.small,
    backgroundColor: globalStyles.colors.border,
  },
  cancelButtonText: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.text.primary,
  },
  confirmButton: {
    marginLeft: globalStyles.spacing.small,
    backgroundColor: globalStyles.colors.primary,
    ...globalStyles.shadows.small,
  },
  confirmButtonText: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.white,
  },

  // Empty state for items
  noItemsContainer: {
    padding: globalStyles.spacing.xlarge,
    alignItems: 'center',
  },
  noItemsIcon: {
    marginBottom: globalStyles.spacing.medium,
  },
  noItemsText: {
    marginTop: globalStyles.spacing.medium,
    color: globalStyles.colors.text.secondary,
    textAlign: 'center',
  },
});

export default orderStyles;