import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState, useEffect } from 'react';
import styles from '../../assets/styles/account';

export default function Tab() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    return () => subscription.remove();
  }, []);

  // Calculate responsive sizes
  const inputWidth = screenDimensions.width > 500 ? '80%' : '100%';
  const fontSize = screenDimensions.width > 380 ? { header: 24, subtitle: 14, button: 16 } : { header: 20, subtitle: 12, button: 14 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>✦</Text>
              </View>
            </View>
            
            {/* Header */}
            <Text style={[styles.header, { fontSize: fontSize.header }]}>Sign in to your Account</Text>
            
            {/* Subtitle */}
            <Text style={[styles.subtitle, { fontSize: fontSize.subtitle }]}>Enter your username and password to log in</Text>
            
            {/* Form */}
            <View style={[styles.form, { width: inputWidth }]}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome5
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#95a5a6"
                  />
                </TouchableOpacity> 
              </View>

              {/* Remember me and Forgot password */}
              <View style={styles.formOptions}>
                <View style={styles.rememberContainer}>
                  <TouchableOpacity 
                    style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <FontAwesome5 name="check" size={12} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.rememberText}>Remember me</Text>
                </View>
                
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              
              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton}>
                <Text style={[styles.loginButtonText, { fontSize: fontSize.button }]}>Log In</Text>
              </TouchableOpacity>
            </View>
            
            {/* Sign Up */}
            <View style={styles.signUpContainer}>
              <Text style={styles.noAccountText}>Don't have an account?</Text>
              <TouchableOpacity>
                <Text style={styles.signUpText}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}