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

  // Add order button
  addOrderButton: {
    backgroundColor: globalStyles.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: globalStyles.spacing.medium,
    paddingHorizontal: globalStyles.spacing.large,
    borderRadius: globalStyles.borderRadius.medium,
    marginVertical: globalStyles.spacing.medium,
    ...globalStyles.shadows.button,
  },
  addOrderButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
    marginLeft: globalStyles.spacing.small,
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
  orderActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: globalStyles.spacing.small,
  },
  statusBadge: {
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: globalStyles.typography.fontSize.small,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: globalStyles.spacing.xsmall,
  },
  viewButton: {
    backgroundColor: globalStyles.colors.accent,
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.pill,
  },
  viewButtonText: {
    color: globalStyles.colors.white,
    fontSize: globalStyles.typography.fontSize.small,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  editButton: {
    backgroundColor: globalStyles.colors.primary,
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.pill,
  },
  editButtonText: {
    color: globalStyles.colors.white,
    fontSize: globalStyles.typography.fontSize.small,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
  deleteButton: {
    backgroundColor: globalStyles.colors.status.error,
    paddingVertical: globalStyles.spacing.xsmall,
    paddingHorizontal: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.pill,
  },
  deleteButtonText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: globalStyles.spacing.medium,
  },
  modalContent: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.large,
    padding: globalStyles.spacing.large,
    width: '100%',
    maxWidth: 500,
    ...globalStyles.shadows.modal,
  },
  modalTitle: {
    fontSize: globalStyles.typography.fontSize.large,
    fontWeight: globalStyles.typography.fontWeight.bold,
    color: globalStyles.colors.text.primary,
    marginBottom: globalStyles.spacing.large,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: globalStyles.spacing.medium,
  },
  formLabel: {
    fontSize: globalStyles.typography.fontSize.regular,
    fontWeight: globalStyles.typography.fontWeight.medium,
    color: globalStyles.colors.text.primary,
    marginBottom: globalStyles.spacing.xsmall,
  },
  formInput: {
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
    borderRadius: globalStyles.borderRadius.medium,
    padding: globalStyles.spacing.medium,
    fontSize: globalStyles.typography.fontSize.regular,
  },
  formValue: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.secondary,
    paddingVertical: globalStyles.spacing.small,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: globalStyles.spacing.small,
  },
  statusButton: {
    paddingVertical: globalStyles.spacing.small,
    paddingHorizontal: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
  },
  statusButtonSelected: {
    backgroundColor: globalStyles.colors.primary,
    borderColor: globalStyles.colors.primary,
  },
  statusButtonText: {
    fontSize: globalStyles.typography.fontSize.small,
    color: globalStyles.colors.text.primary,
  },
  statusButtonTextSelected: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: globalStyles.spacing.large,
    gap: globalStyles.spacing.medium,
  },
  modalButton: {
    flex: 1,
    paddingVertical: globalStyles.spacing.medium,
    borderRadius: globalStyles.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: globalStyles.colors.gray,
  },
  modalSubmitButton: {
    backgroundColor: globalStyles.colors.primary,
  },
  modalDeleteButton: {
    backgroundColor: globalStyles.colors.status.error,
  },
  modalButtonText: {
    color: globalStyles.colors.white,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  deleteConfirmationText: {
    fontSize: globalStyles.typography.fontSize.regular,
    textAlign: 'center',
    marginBottom: globalStyles.spacing.medium,
  },
  deleteWarningText: {
    fontSize: globalStyles.typography.fontSize.small,
    color: globalStyles.colors.status.error,
    textAlign: 'center',
    marginBottom: globalStyles.spacing.large,
    fontWeight: globalStyles.typography.fontWeight.medium,
  },
});

export default orderStyles;