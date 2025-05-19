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
  sectionTitle: {
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.pill,
    paddingHorizontal: globalStyles.spacing.xlarge,
    paddingVertical: globalStyles.spacing.medium,
    alignSelf: 'flex-start',
    marginBottom: globalStyles.spacing.large,
    ...globalStyles.shadows.small,
  },
  sectionTitleText: {
    fontWeight: globalStyles.typography.fontWeight.bold,
    fontSize: globalStyles.typography.fontSize.medium,
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