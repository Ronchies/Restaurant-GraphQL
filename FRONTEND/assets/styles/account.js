import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

const styles = StyleSheet.create({
  safeArea: {
    ...globalStyles.layout.safeArea,
  },
  scrollContainer: {
    ...globalStyles.layout.scrollContainer,
  },
  container: {
    ...globalStyles.layout.centeredContainer,
  },
  logoContainer: {
    marginVertical: globalStyles.spacing.xlarge,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: globalStyles.borderRadius.large,
    backgroundColor: globalStyles.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: globalStyles.colors.white,
    fontSize: 26,
    fontWeight: globalStyles.typography.fontWeight.bold,
  },
  header: {
    ...globalStyles.text.header,
  },
  subtitle: {
    ...globalStyles.text.subtitle,
  },
  form: {
    alignItems: 'center',
    marginBottom: globalStyles.spacing.xlarge,
  },
  input: {
    ...globalStyles.inputs.standard,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.white,
    borderRadius: globalStyles.borderRadius.medium,
    marginBottom: globalStyles.spacing.large,
    width: '100%',
    ...globalStyles.shadows.small,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: globalStyles.spacing.large,
    paddingVertical: globalStyles.spacing.medium,
  },
  eyeIcon: {
    paddingRight: globalStyles.spacing.large,
    paddingLeft: globalStyles.spacing.xsmall,
  },
  formOptions: {
    ...globalStyles.layout.spaceBetween,
    marginBottom: globalStyles.spacing.xlarge,
  },
  rememberContainer: {
    ...globalStyles.layout.row,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
    borderRadius: globalStyles.borderRadius.small,
    marginRight: globalStyles.spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: globalStyles.colors.secondary,
    borderColor: globalStyles.colors.secondary,
  },
  rememberText: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.text.secondary,
  },
  forgotText: {
    fontSize: globalStyles.typography.fontSize.regular,
    color: globalStyles.colors.secondary,
  },
  loginButton: {
    ...globalStyles.buttons.primary,
  },
  loginButtonText: {
    ...globalStyles.buttons.primaryText,
  },
  signUpContainer: {
    ...globalStyles.layout.row,
    marginTop: globalStyles.spacing.xlarge,
    marginBottom: globalStyles.spacing.xlarge,
  },
  noAccountText: {
    color: globalStyles.colors.text.secondary,
  },
  signUpText: {
    ...globalStyles.text.link,
  },
});

export default styles;