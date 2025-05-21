import { StyleSheet } from 'react-native';
import globalStyles from "../../assets/styles/globalStyles";

const { colors, typography, spacing, borderRadius, shadows } = globalStyles;

// This extends the current menuStyles with additional styles needed for the CRUD operations
const diningtableStyles = StyleSheet.create({
  // Existing category styles
  categoryContainer: {
    flexGrow: 0,
    marginBottom: spacing.medium,
  },
  categoryButton: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    marginRight: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: "#F0F0F0",
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.regular,
    fontWeight: typography.fontWeight.medium,
  },
  selectedCategoryText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Existing menu list styles
  menuList: {
    width: "100%",
  },
  menuItemCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    marginBottom: spacing.medium,
    padding: spacing.large,
    ...shadows.card,
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  menuItemName: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xsmall,
  },
  menuItemCategory: {
    fontSize: typography.fontSize.regular,
    color: colors.text.light,
    marginBottom: spacing.small,
  },
  menuItemPrice: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  discountText: {
    color: "#FF3B30",
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  menuItemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  
  // Existing availability badge styles
  availabilityBadge: {
    backgroundColor: colors.status.successBg,
    paddingVertical: spacing.xsmall,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.medium,
    marginBottom: 10,
  },
  soldOutBadge: {
    backgroundColor: "#FFEBEE",
  },
  availabilityText: {
    color: colors.status.success,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  soldOutText: {
    color: "#C62828",
  },
  
  // Existing action buttons
  menuItemActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 15,
  },
  
  // Existing loading and error states
  loadingContainer: {
    padding: spacing.xlarge,
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.light,
    marginTop: spacing.medium,
  },
  errorContainer: {
    padding: spacing.xlarge,
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderRadius: borderRadius.medium,
  },
  errorText: {
    fontSize: typography.fontSize.medium,
    color: "#C62828",
  },
  
  // New styles for Add button in header
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.small,
    marginLeft: 5,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.large,
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.xlarge,
    width: "100%",
    maxWidth: 500,
    ...shadows.elevated,
  },
  modalTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: spacing.medium,
  },
  label: {
    fontSize: typography.fontSize.regular,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xsmall,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    fontSize: typography.fontSize.regular,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.large,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.large,
  },
  modalButton: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: borderRadius.medium,
    flex: 1,
    marginHorizontal: spacing.xsmall,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  
  // Confirmation dialog styles
  confirmDialog: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.xlarge,
    width: "100%",
    maxWidth: 400,
    ...shadows.elevated,
  },
  confirmTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.medium,
    textAlign: "center",
    color: "#FF3B30",
  },
  confirmText: {
    fontSize: typography.fontSize.regular,
    textAlign: "center",
    marginBottom: spacing.large,
  },
  
  // Empty state
  emptyContainer: {
    padding: spacing.xlarge,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: borderRadius.medium,
    marginVertical: spacing.large,
  },
  emptyText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.light,
    textAlign: "center",
  }
});

export default diningtableStyles;