import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Animated,
  Image, Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfettiCannon from "react-native-confetti-cannon";
import { auth, db } from "../../utils/firebase";
import styles from "./styles";

// Constants 
const NAV_ITEMS = [
  { label: "Account",    icon: require("../../assets/account.png"),    route: "/account" },
  { label: "Axis",       icon: require("../../assets/chat.png"),       route: "/ai_conversation" },
  { label: "Comparison", icon: require("../../assets/comparison.png"), route: "/comparison_engine" },
  { label: "Help",       icon: require("../../assets/help.png"),       route: "/help" },
];

// Helpers 
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 22) return "Good evening";
  return "Hello";
}

function getTodayDayMonth() {
  const today = new Date();
  const day   = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
}

// Hooks 
function useCurrentUser() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading]     = useState(true);
  const [isBirthday, setIsBirthday]   = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snapshot = await getDoc(doc(db, "users", user.uid));

        if (!snapshot.exists()) {
          setDisplayName(user.displayName || "User");
          return;
        }

        const data = snapshot.data();
        setDisplayName(data.username);

        if (data.birthDate === getTodayDayMonth()) {
          setIsBirthday(true);
          Alert.alert(
            "🎁 Happy Birthday!",
            "Want to buy a present for yourself?",
            [
              { text: "Maybe later", style: "cancel" },
              { text: "Yes!", onPress: () => router.push("/comparison_engine") },
            ]
          );
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setDisplayName("User");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  return { displayName, isLoading, isBirthday };
}

function useMenuAnimation() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(rotateAnim, { toValue, duration: 300, useNativeDriver: true }).start();
    setIsOpen((prev) => !prev);
  };

  const rotation = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["90deg", "0deg"],
  });

  return { isOpen, toggle, rotation };
}

// Sub-components 
function NavigationMenu({ headerHeight, onClose, router }) {
  return (
    <View style={[styles.menuOverlay, { top: headerHeight }]}>
      {NAV_ITEMS.map(({ label, icon, route }) => (
        <TouchableOpacity
          key={label}
          style={styles.menuItem}
          onPress={() => { onClose(); router.push(route); }}
        >
          <Image source={icon} style={styles.menuItemIcon} resizeMode="contain" />
          <Text style={styles.menuItemText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function GreetingSection({ displayName, isLoading }) {
  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.greeting}>
        {getGreeting()},{"\n"}
        {isLoading
          ? <ActivityIndicator size="small" color="#000" />
          : <Text style={{ fontWeight: "bold" }}>{displayName}!</Text>
        }
      </Text>
      <Text style={styles.subtext}>What would you like to do today?</Text>
    </View>
  );
}

function Divider() {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

// Screen 
export default function MainMenu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 78; // top padding (15) + icon (48) + bottom padding (15)

  const { displayName, isLoading, isBirthday } = useCurrentUser();
  const { isOpen: menuOpen, toggle: toggleMenu, rotation: menuIconRotation } = useMenuAnimation();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity onPress={() => router.push("/main_menu")}> 
        <Image
          source={require("../../assets/logo2.png")}
          style={styles.headerIcon}
          resizeMode="contain"
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
          <Animated.Image
            source={require("../../assets/Meniu.png")}
            style={[styles.headerIcon, { transform: [{ rotate: menuIconRotation }] }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <NavigationMenu headerHeight={headerHeight} onClose={toggleMenu} router={router} />
      )}

      <View style={styles.content}>
        <GreetingSection displayName={displayName} isLoading={isLoading} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/ai_conversation")}>
            <Text style={styles.buttonText}>
              Chat with Axis, our highly intelligent assistant
            </Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.button} onPress={() => router.push("/comparison_engine")}>
            <Text style={styles.buttonText}>
              Search for devices using our comparison engine
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isBirthday && (
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut explosionSpeed={350} />
      )}
    </View>
  );
}