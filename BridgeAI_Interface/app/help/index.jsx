import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  Alert, Animated, Image, Platform, ScrollView,
  StatusBar, Text, TouchableOpacity, View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

// Constants 
const NAV_ITEMS = [
  { label: "Account",    icon: require("../../assets/account.png"),    route: "/account" },
  { label: "Axis",       icon: require("../../assets/chat.png"),       route: "/ai_conversation" },
  { label: "Comparison", icon: require("../../assets/comparison.png"), route: "/comparison_engine" },
  { label: "Help",       icon: require("../../assets/help.png"),       route: "/help" },
];

// Helpers 
async function openTermsPdf() {
  const asset = Asset.fromModule(require("../../assets/terms_and_policies.pdf"));
  await asset.downloadAsync();

  const destPath = FileSystem.cacheDirectory + "Terms_and_Policies_BridgeAI.pdf";
  await FileSystem.copyAsync({ from: asset.localUri, to: destPath });

  if (Platform.OS === "android") {
    const contentUri = await FileSystem.getContentUriAsync(destPath);
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data:  contentUri,
      flags: 1,
      type:  "application/pdf",
    });
  } else {
    await Sharing.shareAsync(destPath, {
      mimeType: "application/pdf",
      UTI:      "com.adobe.pdf",
    });
  }
}

// Sub-components 
function MenuItem({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Image source={icon} style={styles.menuItemIcon} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

function NavigationMenu({ headerHeight, onClose, router }) {
  return (
    <View style={[styles.menuOverlay, { top: headerHeight }]}>
      {NAV_ITEMS.map(({ label, icon, route }) => (
        <MenuItem
          key={label}
          label={label}
          icon={icon}
          onPress={() => { onClose(); router.push(route); }}
        />
      ))}
    </View>
  );
}

function SectionCard({ iconSource, title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Image source={iconSource} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// Screen 
export default function HelpScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const headerHeight = insets.top + 78; // top padding (15) + icon (48) + bottom padding (15)

  const [menuVisible, setMenuVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 1;
    Animated.spring(rotateAnim, { toValue, friction: 6, useNativeDriver: true }).start();
    setMenuVisible((prev) => !prev);
  };

  const menuIconRotation = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["90deg", "0deg"],
  });

  const handleOpenTerms = async () => {
    try {
      await openTermsPdf();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not open the document.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <TouchableOpacity onPress={() => router.push("/main_menu")} activeOpacity={0.8}>
          <Image source={require("../../assets/logo2.png")} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
          <Animated.Image
            source={require("../../assets/Meniu.png")}
            style={[styles.headerIcon, { transform: [{ rotate: menuIconRotation }] }]}
          />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <NavigationMenu headerHeight={headerHeight} onClose={toggleMenu} router={router} />
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionCard iconSource={require("../../assets/contact.png")} title="Contact:">
          <View style={styles.whiteCard}>
            <Text style={styles.cardText}>bridge.ai.contact@gmail.com</Text>
            <Text style={styles.cardText}>+40 732 571 134</Text>
          </View>
        </SectionCard>

        <SectionCard iconSource={require("../../assets/terms.png")} title="Terms and Policies">
          <TouchableOpacity
            style={styles.whiteCard}
            onPress={handleOpenTerms}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Download Terms and Policies PDF"
          >
            <View style={styles.downloadRow}>
              <Image source={require("../../assets/download.png")} style={styles.downloadIcon} />
              <Text style={styles.cardText}>Download Terms & Policies</Text>
            </View>
          </TouchableOpacity>
        </SectionCard>

        <View style={styles.footer}>
          <Image source={require("../../assets/logo.png")} style={styles.logoBig} />
          <View style={styles.brandingContainer}>
            <Text style={styles.footerBrand}>BridgeAI™</Text>
            <Text style={styles.footerSub}>version 1.0{"\n"}©2026-2030 Binary Duo</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}