import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { getSession } from "../utils/storage";
import "./GlobalFont";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SourGummy_400Regular,
  SourGummy_700Bold,
} from "@expo-google-fonts/sour-gummy";
 
SplashScreen.preventAutoHideAsync();
 
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "SourGummy" };

export default function RootLayout() {
  const [checking, setChecking] = useState(true);
 
  const [fontsLoaded, fontError] = useFonts({
    SourGummy: SourGummy_400Regular,
    "SourGummy-Bold": SourGummy_700Bold,
  });

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session?.token) {
          setTimeout(() => router.replace("/main_menu"), 0);
        }
      } catch (_) {
 
      } finally {
        setChecking(false);
      }
    })();
  }, []);
 
  useEffect(() => {
    if ((fontsLoaded || fontError) && !checking) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, checking]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign_in/index" options={{ title: "Sign In" }} />
        <Stack.Screen name="sign_up/index" options={{ title: "Sign Up" }} />
        <Stack.Screen name="main_menu/index" options={{ title: "Main Menu" }} />
        <Stack.Screen
          name="ai_conversation/index"
          options={{ title: "AI Chat" }}
        />
        <Stack.Screen
          name="comparison_engine/index"
          options={{ title: "Comparison" }}
        />
        <Stack.Screen name="account/index" options={{ title: "My Account" }} />
        <Stack.Screen name="help/index" options={{ title: "Help & Support" }} />
      </Stack>

      {/* Overlay de loading */}
      {(checking || !fontsLoaded) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E8E4D9",
          }}
        >
          <ActivityIndicator color="#3D4A2E" size="large" />
        </View>
      )}
    </>
  );
}