import * as Apple from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_ID_IOS,
  GOOGLE_CLIENT_ID_WEB,
} from "../../constants/auth";
import { auth } from "../../utils/firebase";
import { isValidEmail } from "../../utils/validation";
import styles from "./styles";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/userinfo/v2/me";

const ERROR_MESSAGES = {
  "auth/user-not-found": "User does not exist.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
};

export default function LogInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      webClientId: GOOGLE_CLIENT_ID_WEB,
      iosClientId: GOOGLE_CLIENT_ID_IOS,
      androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      handleGoogleSuccess(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  const redirectToAccountCreation = useCallback(
    (email, provider) => {
      router.push({
        pathname: "/account_creation",
        params: { email, provider },
      });
    },
    [router]
  );

  const handleGoogleSuccess = async (accessToken) => {
    try {
      setLoading(true);
      const res = await fetch(GOOGLE_USER_INFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();
      redirectToAccountCreation(user.email, "google");
    } catch {
      Alert.alert("Login Failed", "Could not retrieve Google account info.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const credential = await Apple.signInAsync({
        requestedScopes: [
          Apple.AppleAuthenticationScope.EMAIL,
          Apple.AppleAuthenticationScope.FULL_NAME,
        ],
      });
      redirectToAccountCreation(credential.email ?? "", "apple");
    } catch (err) {
      if (err.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Login Failed", "Apple Sign-In failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [redirectToAccountCreation]);

  const handleEmailLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      router.replace("/main_menu");
    } catch (error) {
      const message = ERROR_MESSAGES[error.code] ?? "Incorrect email or password.";
      Alert.alert("Login Error", message);
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const isFormValid = isValidEmail(email) && password.length >= 1;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>BridgeAI</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your BridgeAI account</Text>

        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#A8A89A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          accessibilityLabel="Email address"
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#A8A89A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleEmailLogin}
            accessibilityLabel="Password"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => Alert.alert("Reset Password", "Feature coming soon.")}
          accessibilityRole="button"
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, !isFormValid && styles.primaryButtonDisabled]}
          onPress={handleEmailLogin}
          disabled={!isFormValid || loading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Sign In"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => googlePromptAsync()}
          disabled={!googleRequest || loading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <Image
            source={require("../../assets/google_icon.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPress={handleAppleLogin}
            disabled={loading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            <Image
              source={require("../../assets/apple_icon.png")}
              style={[styles.socialIcon, styles.appleIcon]}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, styles.appleButtonText]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.signUpRow}>
          <Text style={styles.signUpPrompt}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/sign_up")}
            accessibilityRole="button"
          >
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}