import * as Apple from "expo-apple-authentication";
import { Asset } from "expo-asset";
import * as Google from "expo-auth-session/providers/google";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import * as IntentLauncher from "expo-intent-launcher";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { auth, db } from "../../utils/firebase";
import { isValidEmail } from "../../utils/validation";
import styles from "./styles";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/userinfo/v2/me";

const SIGN_UP_ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already in use.",
  "auth/weak-password": "Password is too weak (minimum 6 characters).",
};

const NEW_USER_DEFAULTS = {
  profilePic: "",
  birthDate: "",
};

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Error", "Could not retrieve Google account info.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      const credential = await Apple.signInAsync({
        requestedScopes: [
          Apple.AppleAuthenticationScope.FULL_NAME,
          Apple.AppleAuthenticationScope.EMAIL,
        ],
      });
      redirectToAccountCreation(credential.email ?? "", "apple");
    } catch (err) {
      if (err.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Error", "Apple Sign-In failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [redirectToAccountCreation]);

  const createFirestoreUserDocument = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      email,
      createdAt: new Date(),
      ...NEW_USER_DEFAULTS,
    });
  };

  const handleSignUp = async () => {
    if (!email || !password || !username.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: username });
      await createFirestoreUserDocument(user);
      Alert.alert("Success!", "Your account has been created.");
      router.replace("/main_menu");
    } catch (error) {
      const message = SIGN_UP_ERROR_MESSAGES[error.code] ?? "An error occurred.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const openPDF = async (pdfAsset, filename) => {
    try {
      setLoading(true);
      const asset = Asset.fromModule(pdfAsset);
      await asset.downloadAsync();

      const destPath = FileSystem.cacheDirectory + filename;
      await FileSystem.copyAsync({ from: asset.localUri, to: destPath });

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(destPath);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      } else {
        await Sharing.shareAsync(destPath, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
        });
      }
    } catch {
      Alert.alert(
        "Error",
        "Could not open the document. Make sure you have a PDF app installed."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    isValidEmail(email) && password.length >= 6 && username.trim().length > 0;

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
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>BridgeAI</Text>
        </View>

        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Enter your details to sign up for BridgeAI</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#A8A89A"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          accessibilityLabel="Username input"
        />

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
          accessibilityLabel="Email address input"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (minimum 6 characters)"
          placeholderTextColor="#A8A89A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          accessibilityLabel="Password input"
        />

        <TouchableOpacity
          style={[styles.primaryButton, !isFormValid && styles.primaryButtonDisabled]}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Create Account</Text>
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
            onPress={handleAppleSignIn}
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

        <Text style={styles.legalText}>
          By clicking continue, you agree to our{" "}
          <Text
            style={styles.legalLink}
            onPress={() =>
              openPDF(
                require("../../assets/terms_and_policies.pdf"),
                "Terms_and_Policies_BridgeAI.pdf"
              )
            }
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.legalLink}
            onPress={() =>
              openPDF(
                require("../../assets/privacy_policy.pdf"),
                "Privacy_Policy_BridgeAI.pdf"
              )
            }
          >
            Privacy Policy
          </Text>
        </Text>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/sign_in")}
            accessibilityRole="button"
            accessibilityLabel="Go to Sign In"
          >
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}