import { Platform, StyleSheet } from "react-native";

const FONT_REGULAR = "SourGummy";
const FONT_BOLD    = "SourGummy-Bold";

const C = {
  bg:           "#EAE7D6",
  headerBg:     "#EAE7D6",
  bubbleAxis:   "#C4D7B2",
  bubbleUser:   "#F0EDE0",
  textDark:     "#3A4035",
  textMid:      "#4A5043",
  inputBg:      "#D6DEAD",
  inputPH:      "#8A9A7A",
  separator:    "#C0BBA8",
  dot:          "#7A9A62",
  avatarBorder: "#4A5043",
  menuBg:       "#F5F1E8",
  white:        "#FFFFFF",
  sendBtn:      "#7A9A62",
  sendBtnDis:   "#B0C4A0",
};

export default StyleSheet.create({

  outerContainer: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: C.headerBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 2000,
  },
  headerIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  menuIconImg: {
    width: 30,
    height: 30,
  },

  menuOverlay: {
    position: "absolute",
    right: 0,
    width: "60%",
    backgroundColor: C.menuBg,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 1500,
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1400,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemIcon: {
    width: 28,
    height: 28,
    marginRight: 15,
    resizeMode: "contain",
  },
  menuItemText: {
    fontSize: 17,
    color: C.textMid,
    fontFamily: FONT_REGULAR,
  },

  separator: {
    height: 1,
    backgroundColor: C.separator,
    opacity: 0.5,
  },

  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 10,
  },

  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
    gap: 8,
  },
  bubbleRowLeft: {
    justifyContent: "flex-start",
  },
  bubbleRowRight: {
    justifyContent: "flex-end",
  },

  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.avatarBorder,
  },

  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleAxis: {
    backgroundColor: C.bubbleAxis,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: C.bubbleUser,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: FONT_REGULAR,
  },
  bubbleTextAxis: {
    color: C.textDark,
  },
  bubbleTextUser: {
    color: C.textMid,
  },

  typingDotsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.dot,
    opacity: 0.75,
  },

  inputArea: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: C.bg,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: C.inputBg,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: C.textMid,
    maxHeight: 100,
    lineHeight: 20,
    paddingVertical: Platform.OS === "ios" ? 4 : 2,
    paddingRight: 8,
    fontFamily: FONT_REGULAR,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.sendBtn,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? 0 : 2,
  },
  sendButtonDisabled: {
    backgroundColor: C.sendBtnDis,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    fontFamily: FONT_BOLD,
  },

  homeIndicator: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bg,
  },
  homeBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.textMid,
    opacity: 0.2,
  },
});