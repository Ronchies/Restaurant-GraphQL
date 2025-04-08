import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState, useEffect } from 'react';
import styles from '../../assets/styles/account';
import globalStyles from '../../assets/styles/globalStyles';

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
  const fontSize = screenDimensions.width > 380 ? 
    { header: globalStyles.typography.fontSize.xxlarge, subtitle: globalStyles.typography.fontSize.regular, button: globalStyles.typography.fontSize.medium } : 
    { header: globalStyles.typography.fontSize.xlarge, subtitle: globalStyles.typography.fontSize.small, button: globalStyles.typography.fontSize.regular };

  return (
    <SafeAreaView style={globalStyles.layout.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={globalStyles.layout.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={[styles.logo, { backgroundColor: globalStyles.colors.primary }]}>
                <Text style={[styles.logoText, { color: globalStyles.colors.white }]}>✦</Text>
              </View>
            </View>
            
            {/* Header */}
            <Text style={[globalStyles.text.header, { fontSize: fontSize.header }]}>Sign in to your Account</Text>
            
            {/* Subtitle */}
            <Text style={[globalStyles.text.subtitle, { fontSize: fontSize.subtitle }]}>Enter your username and password to log in</Text>
            
            {/* Form */}
            <View style={[styles.form, { width: inputWidth }]}>
              <TextInput
                style={globalStyles.inputs.standard}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor={globalStyles.colors.text.light}
              />
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor={globalStyles.colors.text.light}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome5
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color={globalStyles.colors.text.light}
                  />
                </TouchableOpacity> 
              </View>

              {/* Remember me and Forgot password */}
              <View style={globalStyles.layout.spaceBetween}>
                <View style={globalStyles.layout.row}>
                  <TouchableOpacity 
                    style={[styles.checkbox, rememberMe && { backgroundColor: globalStyles.colors.secondary, borderColor: globalStyles.colors.secondary }]}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <FontAwesome5 name="check" size={12} color={globalStyles.colors.white} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ fontSize: globalStyles.typography.fontSize.regular, color: globalStyles.colors.text.secondary }}>Remember me</Text>
                </View>
                
                <TouchableOpacity>
                  <Text style={globalStyles.text.link}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              
              {/* Login Button */}
              <TouchableOpacity style={globalStyles.buttons.primary}>
                <Text style={[globalStyles.buttons.primaryText, { fontSize: fontSize.button }]}>Log In</Text>
              </TouchableOpacity>
            </View>
            
            {/* Sign Up */}
            <View style={globalStyles.layout.row}>
              <Text style={{ color: globalStyles.colors.text.secondary }}>Don't have an account?</Text>
              <TouchableOpacity>
                <Text style={globalStyles.text.link}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}