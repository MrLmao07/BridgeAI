import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import styles from "./styles.js";

const axisAvatar    = require("../../assets/axis.png");
const defaultAvatar = require("../../assets/account2.png");
const menuIcon      = require("../../assets/Meniu.png");

const API_BASE = "https://bridgeai-ai.onrender.com";

// Translation maps for user-facing display  
const CATEGORY_EN = {
  "laptop":           "laptop",
  "smartphone":       "smartphone",
  "monitor":          "monitor",
  "tv":               "TV",
  "tableta":          "tablet",
  "casti":            "headphones",
  "casti gaming":     "gaming headphones",
};

const SCOP_EN = {
  "casual":           "everyday use",
  "gaming":           "gaming",
  "gaming entry":     "entry-level gaming",
  "business":         "business",
  "programare":       "programming",
  "design":           "design",
  "video editing":    "video editing",
  "streaming":        "streaming",
  "student":          "student use",
  "student premium":  "student premium",
  "fotografie":       "photography",
  "muzica":           "music",
  "buget mic":        "budget",
  "social media":     "social media",
  "transport":        "commuting",
  "sport":            "sport",
  "anc":              "noise cancelling",
  "voip":             "calls / VoIP",
  "portabil":         "portability",
  "general":          "general use",
};
 
const RO_WORD_MAP = [
  ["Căști",      "Headphones"],
  ["Casti",      "Headphones"],
  ["căști",      "headphones"],
  ["casti",      "headphones"],
  ["Tabletă",    "Tablet"],
  ["Tableta",    "Tablet"],
  ["tabletă",    "tablet"],
  ["tableta",    "tablet"],
  ["Televizor",  "TV"],
  ["televizor",  "TV"],
  ["Specificații disponibile în descriere", "Specs available in description"],
  ["Specificatii disponibile in descriere", "Specs available in description"],
];

function sanitizeName(text) {
  if (!text) return text;
  let s = String(text);
  for (const [ro, en] of RO_WORD_MAP) {
    s = s.split(ro).join(en);
  }
  return s;
}

const sanitizeSpecValue = sanitizeName;
 
async function callBackend(message) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${response.status}`);
  }
  return response.json();
}

async function callRecommend(intent) {
  const response = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(intent),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${response.status}`);
  }
  return response.json();
}

function formatProducts(products, intent) {
  if (!products || products.length === 0) {
    return "No matching products found. Try adjusting your budget or category.";
  }
  if (products[0]?.error) {
    return `Sorry, ${products[0].error}. Could you rephrase your request?`;
  }
  const scop      = SCOP_EN[intent?.scop]      || intent?.scop      || "your needs";
  const categorie = CATEGORY_EN[intent?.categorie] || intent?.categorie || "product";
  const brand     = intent?.brand ? ` ${intent.brand.toUpperCase()}` : "";
  let text = `🎯 Found ${products.length} ${categorie}${brand} for ${scop}:\n\n`;
  products.slice(0, 3).forEach((p) => {
    text += `#${p.rank} ${sanitizeName(p.product_name)?.slice(0, 60)}\n`;
    text += `💰 ${p.price}  |  🎯 Match: ${p.score_pct}\n`;
    const specs     = p.specs || {};
    const specParts = Object.entries(specs)
      .filter(([, v]) => !["N/A", "nan", "None", "undefined"].includes(String(v)))
      .filter(([, v]) => !String(v).startsWith("nan"))
      .map(([k, v]) => `${k}: ${sanitizeSpecValue(v)}`);
    if (specParts.length > 0) text += `🔧 ${specParts.join(" | ")}\n`;
    if (p.url) text += `🔗 ${p.url.slice(0, 60)}\n`;
    text += "\n";
  });
  text += "Would you like more details or should I refine the search?";
  return text;
}

export default function AiConversation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = insets.top + 15 + 48 + 15;

  // User avatar from Firestore 
  const [userAvatarUri, setUserAvatarUri] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const profilePic = docSnap.data().profilePic;
            if (profilePic && profilePic.trim() !== "") {
              setUserAvatarUri(profilePic.trim());
            }
          }
        }
      } catch (e) {
        console.log("Avatar fetch error:", e);
      }
    };
    fetchAvatar();
  }, []);
 
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "axis",
      text: "Hi! I'm Axis, your personal BridgeAI assistant 🌿\nWhat device are you looking for? (e.g. 'gaming laptop 4000 lei', 'sony headphones for music')",
    },
  ]);
  const [input, setInput]                 = useState("");
  const [isTyping, setIsTyping]           = useState(false);
  const [pendingIntent, setPendingIntent] = useState(null);
  const [menuOpen, setMenuOpen]           = useState(false);

  const scrollRef  = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dot1       = useRef(new Animated.Value(0)).current;
  const dot2       = useRef(new Animated.Value(0)).current;
  const dot3       = useRef(new Animated.Value(0)).current;

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["90deg", "0deg"] });

  useEffect(() => {
    const bounce = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0,  duration: 280, useNativeDriver: true }),
          Animated.delay(500),
        ])
      );
    const a1 = bounce(dot1, 0);
    const a2 = bounce(dot2, 180);
    const a3 = bounce(dot3, 360);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const toggleMenu = () => {
    const toValue = menuOpen ? 0 : 1;
    Animated.timing(rotateAnim, { toValue, duration: 300, useNativeDriver: true }).start();
    setMenuOpen((v) => !v);
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender, text }]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    addMessage("user", text);
    setIsTyping(true);
    try {
      if (pendingIntent) {
        const budgetMatch = text.match(/(\d[\d.,]*)/);
        const buget = budgetMatch ? parseFloat(budgetMatch[1].replace(",", ".")) : 0;
        if (buget > 100) {
          const updatedIntent = { ...pendingIntent, buget };
          setPendingIntent(null);
          const products = await callRecommend(updatedIntent);
          addMessage("axis", formatProducts(products, updatedIntent));
        } else {
          addMessage("axis", "I didn't understand the budget. Please enter an amount in lei, e.g. 4000");
        }
        return;
      }
      const result = await callBackend(text);
      if (result.needs_budget) {
        setPendingIntent(result.intent);
        addMessage("axis", result.clarification);
      } else {
        addMessage("axis", formatProducts(result.products, result.intent));
      }
    } catch (err) {
      console.error("Backend error:", err);
      addMessage("axis", `⚠️ Cannot connect to server (localhost:5000).\nMake sure you have started: python api.py`);
    } finally {
      setIsTyping(false);
    }
  };

  // Avatar component helper  
  const UserAvatar = () =>
    userAvatarUri ? (
      <Image
        source={{ uri: userAvatarUri }}
        style={styles.avatarSmall}
      />
    ) : (
      <Image source={defaultAvatar} style={styles.avatarSmall} />
    );
  
  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity onPress={() => router.push("/main_menu")} activeOpacity={0.8}>
            <Image source={require("../../assets/logo2.png")} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
            <Animated.Image
              source={menuIcon}
              style={[styles.menuIconImg, { transform: [{ rotate: spin }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {/* Menu overlay */}
        {menuOpen && (
          <>
            <TouchableOpacity
              style={styles.menuBackdrop}
              activeOpacity={1}
              onPress={toggleMenu}
            />
            <View style={[styles.menuOverlay, { top: HEADER_HEIGHT }]}>
              {[
                { label: "Account",    icon: require("../../assets/account.png"),    route: "/account" },
                { label: "Axis",       icon: require("../../assets/chat.png"),       route: "/ai_conversation" },
                { label: "Comparison", icon: require("../../assets/comparison.png"), route: "/comparison_engine" },
                { label: "Help",       icon: require("../../assets/help.png"),       route: "/help" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuItem}
                  onPress={() => { toggleMenu(); router.push(item.route); }}
                >
                  <Image source={item.icon} style={styles.menuItemIcon} resizeMode="contain" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesArea}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubbleRow, msg.sender === "axis" ? styles.bubbleRowLeft : styles.bubbleRowRight]}
            >
              {msg.sender === "axis" && (
                <Image source={axisAvatar} style={styles.avatarSmall} />
              )}
              <View style={[styles.bubble, msg.sender === "axis" ? styles.bubbleAxis : styles.bubbleUser]}>
                <Text style={[styles.bubbleText, msg.sender === "axis" ? styles.bubbleTextAxis : styles.bubbleTextUser]}>
                  {msg.text}
                </Text>
              </View>
              {msg.sender !== "axis" && <UserAvatar />}
            </View>
          ))}

          {isTyping && (
            <View style={[styles.bubbleRow, styles.bubbleRowLeft]}>
              <Image source={axisAvatar} style={styles.avatarSmall} />
              <View style={[styles.bubble, styles.bubbleAxis]}>
                <View style={styles.typingDotsWrap}>
                  {[dot1, dot2, dot3].map((anim, i) => (
                    <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: anim }] }]} />
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              placeholder="Type here... (e.g. gaming laptop 4000 lei)"
              placeholderTextColor="#8A9A7A"
              style={styles.textInput}
              multiline
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.7}
              style={[styles.sendButton, (!input.trim() || isTyping) && styles.sendButtonDisabled]}
              disabled={!input.trim() || isTyping}
            >
              <Text style={styles.sendButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homeIndicator}>
          <View style={styles.homeBar} />
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}