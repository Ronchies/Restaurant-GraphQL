import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect } from "react";
import styles from "../assets/styles/account";
import LOGIN_USER from "./mutations/login";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import globalStyles from "../assets/styles/globalStyles";
import * as SecureStore from "expo-secure-store"; // ✅ Import SecureStore

export default function Tab() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("window")
  );
  const [loginError, setLoginError] = useState("");

  // ✅ Define the login function
  const login = async (token, userType) => {
    try {
      console.log("Storing token and userType to SecureStore...");
      await SecureStore.setItemAsync("user_token", token);
      await SecureStore.setItemAsync("user_type", userType);
      console.log("Stored successfully");
    } catch (e) {
      console.error("Error saving credentials:", e);
    }
  };

  const [loginMutation, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      console.log("Login successful:", data);

      const { token, user } = data.loginUser;

      await login(token, user.user_type);

      if (user.user_type === "admin") {
        console.log("Redirecting to admin dashboard...");
        router.replace("/(admin)/index");
      } else if (user.user_type === "user") {
        console.log("Redirecting to user dashboard...");
        router.replace("/(user)/index");
      } else {
        console.log("Unknown user type, going to default...");
        router.replace("/(tabs)");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setLoginError(error.message);
    },
  });

  const handleLogin = async () => {
    setLoginError("");

    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password");
      return;
    }

    console.log("Attempting login with:", {
      username: username.trim(),
      password: password.trim(),
    });

    try {
      await loginMutation({
        variables: {
          username: username.trim(),
          password: password.trim(),
        },
      });
    } catch (e) {
      console.error("Mutation execution error:", e);
      setLoginError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions(window);
    });
    return () => subscription.remove();
  }, []);

  const inputWidth = screenDimensions.width > 500 ? "80%" : "100%";
  const fontSize =
    screenDimensions.width > 380
      ? {
          header: globalStyles.typography.fontSize.xxlarge,
          subtitle: globalStyles.typography.fontSize.regular,
          button: globalStyles.typography.fontSize.medium,
        }
      : {
          header: globalStyles.typography.fontSize.xlarge,
          subtitle: globalStyles.typography.fontSize.small,
          button: globalStyles.typography.fontSize.regular,
        };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={[styles.header, { fontSize: fontSize.header }]}>
              Sign in to your Account
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { fontSize: fontSize.subtitle }]}>
              Enter your username and password to log in
            </Text>

            {/* Error Message */}
            {loginError ? (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {loginError}
              </Text>
            ) : null}

            {/* Form */}
            <View style={[styles.form, { width: inputWidth }]}>
              <TextInput
                style={styles.input}
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
              <View style={styles.formOptions}>
                <View style={styles.rememberContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <FontAwesome5
                        name="check"
                        size={12}
                        color={globalStyles.colors.white}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.rememberText}>Remember me</Text>
                </View>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text
                  style={[
                    styles.loginButtonText,
                    { fontSize: fontSize.button },
                  ]}
                >
                  Log In
                </Text>
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
