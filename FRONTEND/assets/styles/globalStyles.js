import { StyleSheet } from 'react-native';

// Color palette
const colors = {
  primary: '#e74c3c',        // Red/coral - main brand color
  secondary: '#3498db',      // Blue - for links and secondary actions
  background: '#f1f2f6',     // Light gray - main background
  white: '#ffffff',          // White - for cards, inputs
  text: {
    primary: '#2c3e50',      // Dark blue/gray - for headers
    secondary: '#7f8c8d',    // Medium gray - for subtitles
    light: '#95a5a6',        // Light gray - for icons, placeholders
  },
  border: '#bdc3c7',         // Light gray - for borders
  accent: '#ff6b6b',         // Accent color from index.js (view button)
  status: {
    success: '#4caf50',      // Success color
    successBg: '#e6f9e6',    // Success background
    error: '#C62828',        // Error color (added from menu.jsx)
    errorBg: '#FFEBEE',      // Error background (added from menu.jsx)
    warning: '#FF3B30',      // Warning color (added from menu.jsx)
  },
  iconBg: {
    blue: '#e6f2ff',         // Blue icon background
    profile: '#55b9f3',      // Profile icon background
    lightGray: '#f0f0f0',    // Light gray icon background (added from menu.jsx)
  },
  category: {
    default: '#F0F0F0',      // Default category background (added from menu.jsx)
  },
  action: {                  // Action colors (added from menu.jsx)
    edit: '#007AFF',
    delete: '#FF3B30',
  },
};

// Typography
const typography = {
  fontSize: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
  },
  fontWeight: {
    regular: 'normal',
    medium: '500',
    bold: 'bold',
  },
};

// Spacing
const spacing = {
  xsmall: 5,
  small: 8,
  medium: 12,
  large: 15,
  xlarge: 20,
  xxlarge: 30,
};

// Border radii
const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 15,         // Added from index.js
  circle: 50,
  pill: 25,           // Added from index.js (for pill-shaped elements)
};

// Shadows
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  card: {              // Added from index.js
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Button styles
const buttons = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.large,
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.large,
    alignItems: 'center',
    width: '100%',
  },
  secondaryText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  overview: {          // Added from index.js
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: borderRadius.pill,
    ...shadows.card,
  },
  overviewText: {      // Added from index.js
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.medium,
  },
  view: {              // Added from index.js
    backgroundColor: colors.accent,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  viewText: {          // Added from index.js
    color: colors.white,
    fontSize: typography.fontSize.small,
  },
  action: {            // Added from menu.jsx
    marginLeft: 15,
  },
  category: {          // Added from menu.jsx
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    marginRight: 10,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.category.default,
  },
  categorySelected: {  // Added from menu.jsx
    backgroundColor: colors.primary,
  },
};

// Input styles
const inputs = {
  standard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    marginBottom: spacing.large,
    width: '100%',
    ...shadows.small,
  },
};

// Layout styles
const layout = {
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xlarge,
    paddingVertical: spacing.xxlarge,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    paddingHorizontal: spacing.xlarge,
    paddingVertical: spacing.xxlarge,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {        // Added from index.js
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  horizontalScroll: {  // Added from menu.jsx
    flexGrow: 0,
    marginBottom: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  header: {            // Added from index.js
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  headerRight: {       // Added from index.js
    flexDirection: 'row',
    alignItems: 'center',
  },
  centered: {          // Added from menu.jsx
    alignItems: "center",
  },
};

// Text styles
const text = {
  header: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    fontSize: typography.fontSize.xxlarge,
    marginBottom: spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.regular,
    marginBottom: spacing.xxlarge,
    textAlign: 'center',
  },
  link: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  profileText: {       // Added from index.js
    fontSize: typography.fontSize.xxlarge,
    color: colors.white,
  },
  statsLabel: {        // Added from index.js
    fontSize: typography.fontSize.small,
    color: '#888888',
    marginBottom: spacing.xsmall,
  },
  statsValue: {        // Added from index.js
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  sectionTitle: {      // Added from index.js
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 15,
  },
  orderTitle: {        // Added from index.js
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xsmall,
  },
  orderTime: {         // Added from index.js
    fontSize: typography.fontSize.small,
    color: '#888888',
  },
  statusText: {        // Added from index.js
    color: colors.status.success,
    fontSize: typography.fontSize.small,
  },
  categoryText: {      // Added from menu.jsx
    fontSize: typography.fontSize.regular,
    fontWeight: typography.fontWeight.medium,
  },
  categorySelectedText: { // Added from menu.jsx
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  loadingText: {       // Added from menu.jsx
    fontSize: typography.fontSize.medium,
    color: colors.text.light,
  },
  errorText: {         // Added from menu.jsx
    fontSize: typography.fontSize.medium,
    color: colors.status.error,
  },
};

// Card styles (new category from index.js)
const cards = {
  standard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xlarge,
    padding: spacing.large,
    ...shadows.card,
    marginBottom: spacing.large,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xlarge,
    padding: spacing.large,
    ...shadows.card,
    width: '48%',
    alignItems: 'center',
  },
  menu: {              // Added from menu.jsx
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    marginBottom: spacing.medium,
    padding: spacing.large,
    ...shadows.card,
  },
};

// Icon styles (new category from index.js)
const icons = {
  bell: {
    marginRight: 15,
    padding: 8,
    backgroundColor: colors.iconBg.lightGray,
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.iconBg.profile,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconBg.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
};

// Status badges (new category from index.js)
const badges = {
  success: {
    backgroundColor: colors.status.successBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  availability: {      // Added from menu.jsx
    backgroundColor: colors.status.successBg,
    paddingVertical: spacing.xsmall,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.medium,
    marginBottom: 10,
  },
  soldOut: {           // Added from menu.jsx
    backgroundColor: colors.status.errorBg,
  },
};

// List item styles (new category from index.js)
const listItems = {
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {          // Added from menu.jsx
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemInfo: {      // Added from menu.jsx
    flex: 1,
    justifyContent: "center",
  },
  menuItemRight: {     // Added from menu.jsx
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  menuItemActions: {   // Added from menu.jsx
    flexDirection: "row",
  },
};

// Chart styles (new category from index.js)
const charts = {
  standard: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
};

// State containers (new category from menu.jsx)
const state = {
  loading: {
    padding: spacing.xlarge,
    alignItems: "center",
  },
  error: {
    padding: spacing.xlarge,
    alignItems: "center",
    backgroundColor: colors.status.errorBg,
    borderRadius: borderRadius.medium,
  },
};

const globalStyles = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  buttons,
  inputs,
  layout,
  text,
  cards,
  icons,
  badges,
  listItems,
  charts,
  state,           // New category
};

export default globalStyles;