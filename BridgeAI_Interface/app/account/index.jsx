import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../utils/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function Account() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // FIX: calculate real header height to position menu correctly
  const HEADER_HEIGHT = insets.top + 15 + 48 + 15;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    birthDate: "",
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarInputUrl, setAvatarInputUrl] = useState("");

  // --- DELETE ACCOUNT STATE ---
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordValid, setDeletePasswordValid] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePasswordError, setDeletePasswordError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              username: data.username || "User",
              email: user.email,
              birthDate: data.birthDate || "",
            });
            setAvatarUrl(data.profilePic || null);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleBirthDateChange = async (text) => {
    let cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
    }

    setUserData((prev) => ({ ...prev, birthDate: formatted }));

    if (formatted.length === 10 || formatted.length === 0) {
      try {
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, "users", user.uid), { birthDate: formatted });
        }
      } catch (e) {
        console.log("Eroare salvare dată:", e);
      }
    }
  };

  const handleAvatarConfirm = async () => {
    if (avatarInputUrl.trim()) {
      try {
        const user = auth.currentUser;
        await updateDoc(doc(db, "users", user.uid), {
          profilePic: avatarInputUrl.trim(),
        });
        setAvatarUrl(avatarInputUrl.trim());
      } catch (e) {
        Alert.alert("Eroare", "Nu s-a putut salva imaginea.");
      }
    }
    setAvatarModalVisible(false);
    setAvatarInputUrl("");
  };

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 1;
    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "0deg"],
  });

  const handleDeletePasswordChange = async (text) => {
    setDeletePassword(text);
    setDeletePasswordError("");
    setDeletePasswordValid(false);

    if (text.length >= 6) {
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, text);
        await reauthenticateWithCredential(user, credential);
        setDeletePasswordValid(true);
      } catch (e) {
        setDeletePasswordValid(false);
        if (text.length >= 8) {
          setDeletePasswordError("Parolă incorectă");
        }
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      setDeleteModalVisible(false);
      router.replace("/sign_up");
    } catch (e) {
      console.error("Eroare ștergere cont:", e);
      Alert.alert("Eroare", "Nu s-a putut șterge contul. Încearcă din nou.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = () => {
    setDeletePassword("");
    setDeletePasswordValid(false);
    setDeletePasswordError("");
    setDeleteModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4A5043" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <TouchableOpacity onPress={() => router.push("/main_menu")} activeOpacity={0.8}>
          <Image
            source={require("../../assets/logo2.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Animated.Image
            source={require("../../assets/Meniu.png")}
            style={[styles.headerIcon, { transform: [{ rotate: spin }] }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* FIX: Menu overlay — same pattern as ai_conversation */}
      {menuVisible && (
        <>
          {/* Backdrop closes menu on tap outside */}
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={toggleMenu}
          />
          {/* top: HEADER_HEIGHT so all 4 items are visible below the header */}
          <View style={[styles.menuOverlay, { top: HEADER_HEIGHT }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { toggleMenu(); router.push("/account"); }}
            >
              <Image
                source={require("../../assets/account.png")}
                style={styles.menuItemIcon}
                resizeMode="contain"
              />
              <Text style={styles.menuItemText}>Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { toggleMenu(); router.push("/ai_conversation"); }}
            >
              <Image
                source={require("../../assets/chat.png")}
                style={styles.menuItemIcon}
                resizeMode="contain"
              />
              <Text style={styles.menuItemText}>Axis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { toggleMenu(); router.push("/comparison_engine"); }}
            >
              <Image
                source={require("../../assets/comparison.png")}
                style={styles.menuItemIcon}
                resizeMode="contain"
              />
              <Text style={styles.menuItemText}>Comparison</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { toggleMenu(); router.push("/help"); }}
            >
              <Image
                source={require("../../assets/help.png")}
                style={styles.menuItemIcon}
                resizeMode="contain"
              />
              <Text style={styles.menuItemText}>Help</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* AVATAR */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setAvatarModalVisible(true)}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Image
                source={require("../../assets/account2.png")}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.avatarEditOverlay}>
              <Text style={styles.avatarEditText}>edit</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.usernameTag}>
            <Text style={styles.usernameText}>{userData.username}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldText}>E-mail: {userData.email}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldText}>Password: ●●●●●●</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldText, { flex: 0 }]}>Date_of_Birth:</Text>
            <TextInput
              style={{
                flex: 1,
                color: "#4A5043",
                fontSize: 17,
                fontWeight: "700",
                marginLeft: 5,
                paddingVertical: 0,
              }}
              placeholder="DD.MM.YYYY"
              placeholderTextColor="#9A9A7A"
              value={userData.birthDate}
              onChangeText={handleBirthDateChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={async () => {
            await signOut(auth);
            router.replace("/sign_up");
          }}
        >
          <Image
            source={require("../../assets/Sign_out.png")}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openDeleteModal}>
          <Image
            source={require("../../assets/delete_account.png")}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL AVATAR */}
      <Modal visible={avatarModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update Photo URL</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://link-imagine.jpg"
              value={avatarInputUrl}
              onChangeText={setAvatarInputUrl}
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setAvatarModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleAvatarConfirm}
              >
                <Text style={styles.modalBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL DELETE ACCOUNT */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.modalBox, { paddingVertical: 28 }]}>
            <Text style={[styles.modalTitle, { color: "#c0392b", fontSize: 18, marginBottom: 10 }]}>
              ⚠️ Șterge contul
            </Text>

            <Text style={{ color: "#4A5043", fontSize: 14, textAlign: "center", marginBottom: 6 }}>
              Ești sigur că vrei să faci asta?
            </Text>
            <Text style={{ color: "#6b6b55", fontSize: 13, textAlign: "center", marginBottom: 18 }}>
              Dacă îți ștergi contul, vei pierde <Text style={{ fontWeight: "700" }}>definitiv</Text> toate datele.
            </Text>

            <View style={{ height: 1, backgroundColor: "#ddd", width: "100%", marginBottom: 16 }} />

            <TextInput
              style={[
                styles.modalInput,
                {
                  borderColor: deletePasswordValid ? "#27ae60" : deletePasswordError ? "#c0392b" : "#ccc",
                  borderWidth: 1.5,
                },
              ]}
              placeholder="Parola ta"
              value={deletePassword}
              onChangeText={handleDeletePasswordChange}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={[styles.modalButtons, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleteLoading}
              >
                <Text style={styles.modalBtnText}>Anulează</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: deletePasswordValid ? "#c0392b" : "#ccc",
                    opacity: deletePasswordValid ? 1 : 0.5,
                  },
                ]}
                onPress={deletePasswordValid ? handleDeleteAccount : null}
                disabled={!deletePasswordValid || deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                    Șterge contul
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}