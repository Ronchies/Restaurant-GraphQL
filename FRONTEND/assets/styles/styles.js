// styles.js
import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'), // 5% of screen width
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'), // 4% of screen height
  },
  logo: {
    width: wp('10%'), // 10% of screen width
    height: wp('10%'), // Maintain aspect ratio
    resizeMode: 'contain',
    backgroundColor: '#E74C3C',
    borderRadius: wp('2%'),
  },
  title: {
    fontSize: wp('6%'), // 6% of screen width for font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  instructions: {
    fontSize: wp('3.5%'),
    color: '#777',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  input: {
    width: '100%',
    height: hp('6%'),
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('6%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('4%'),
  },
  eyeIcon: {
    padding: wp('2%'),
  },
  eyeIconText: {
    fontSize: wp('5%'),
    color: '#999',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: wp('4%'),
    height: wp('4%'),
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: wp('2%'),
    height: wp('2%'),
    backgroundColor: '#E74C3C',
  },
  rememberMeText: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  forgotPasswordText: {
    fontSize: wp('3.5%'),
    color: '#3498DB',
  },
  loginButton: {
    width: '100%',
    height: hp('7%'),
    backgroundColor: '#E74C3C',
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  loginButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: hp('2%'),
  },
  noAccountText: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  signUpText: {
    fontSize: wp('3.5%'),
    color: '#3498DB',
    fontWeight: 'bold',
  },
});