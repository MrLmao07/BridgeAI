import { StyleSheet } from "react-native";

// Design Tokens 
const FONT = {
  regular: "SourGummy",
  bold:    "SourGummy-Bold",
};

export const COLORS = {
  background:       "#EAE7D6",
  primaryText:      "#4A5043",
  white:            "#FFFFFF",
  overlay:          "#F5F1E8",
  buttonBackground: "#C4D7B2",
  dividerText:      "#8D8D8D",
};

const shadow = {
  header: {
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius:  5,
    elevation:     10,
  },
  menu: {
    shadowColor:   "#000",
    shadowOffset:  { width: -4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius:  10,
    elevation:     10,
  },
  button: {
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius:  6,
    elevation:     8,
  },
};

// Stylesheet 
export default StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingBottom:     15,
    backgroundColor:   COLORS.background,
    zIndex:            2000,
    ...shadow.header,
  },
  headerIcon: {
    width:  48,
    height: 48,
  },

  // Navigation menu
  menuOverlay: {
    position:               "absolute",
    right:                  0,
    width:                  "60%",
    backgroundColor:        COLORS.overlay,
    paddingVertical:        20,
    paddingHorizontal:      10,
    borderBottomLeftRadius: 20,
    zIndex:                 1000,
    ...shadow.menu,
  },
  menuItem: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   15,
    paddingHorizontal: 15,
  },
  menuItemIcon: {
    width:       28,
    height:      28,
    marginRight: 15,
    resizeMode:  "contain",
  },
  menuItemText: {
    fontSize:   17,
    color:      COLORS.primaryText,
    fontFamily: FONT.regular,
  },

  // Main content
  content: {
    flex:              1,
    paddingHorizontal: 20,
    paddingTop:        20,
  },
  greetingContainer: {},
  greeting: {
    fontSize:   48,
    fontWeight: "bold",
    color:      COLORS.primaryText,
    fontStyle:  "italic",
    marginTop:  20,
    fontFamily: FONT.bold,
  },
  subtext: {
    fontSize:   16,
    color:      COLORS.primaryText,
    marginTop:  10,
    fontFamily: FONT.regular,
  },

  // Action buttons
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    backgroundColor:   COLORS.buttonBackground,
    paddingVertical:   18,
    paddingHorizontal: 20,
    borderRadius:      15,
    marginBottom:      20,
    alignItems:        "center",
    transform:         [{ translateY: -2 }],
    ...shadow.button,
  },
  buttonText: {
    fontSize:   15,
    fontWeight: "600",
    color:      COLORS.primaryText,
    textAlign:  "center",
    fontFamily: FONT.bold,
  },

  // Divider
  dividerContainer: {
    flexDirection:  "row",
    alignItems:     "center",
    marginVertical: 15,
  },
  dividerLine: {
    flex:            1,
    height:          1,
    backgroundColor: COLORS.primaryText,
    opacity:         0.3,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize:         14,
    color:            COLORS.dividerText,
    fontWeight:       "bold",
    fontFamily:       FONT.bold,
  },
});