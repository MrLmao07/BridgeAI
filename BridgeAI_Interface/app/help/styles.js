import { Dimensions, StyleSheet } from "react-native";

// Design Tokens 

const FONT = {
  regular: "SourGummy",
  bold:    "SourGummy-Bold",
};

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width * 0.94;

export const COLORS = {
  background:       "#EAE7D6",
  primaryText:      "#4A5043",
  white:            "#FFFFFF",
  overlay:          "#F5F1E8",
  buttonBackground: "#C4D7B2",
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
  card: {
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius:  10,
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

  // Scroll content
  scrollContent: {
    paddingHorizontal: width * 0.03,
    paddingBottom:     80,
  },

  // Section
  section: {
    marginTop:  35,
    width:      "100%",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems:    "center",
    width:         CONTENT_WIDTH,
    marginBottom:  15,
    paddingLeft:   10,
  },
  sectionIcon: {
    width:       50,
    height:      50,
    marginRight: 15,
    resizeMode:  "contain",
  },
  sectionTitle: {
    fontSize:   34,
    color:      COLORS.primaryText,
    fontWeight: "700",
    fontFamily: FONT.bold,
  },

  // White card
  whiteCard: {
    backgroundColor:   COLORS.white,
    borderRadius:      30,
    width:             CONTENT_WIDTH,
    paddingVertical:   20,
    paddingHorizontal: 20,
    alignItems:        "center",
    justifyContent:    "center",
    ...shadow.card,
  },
  cardText: {
    fontSize:   19,
    color:      COLORS.primaryText,
    textAlign:  "center",
    lineHeight: 26,
    fontFamily: FONT.regular,
  },

  // Download row
  downloadRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  downloadIcon: {
    width:       30,
    height:      30,
    marginRight: 12,
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop:  70,
  },
  logoBig: {
    width:      width * 0.95,
    height:     240,
    resizeMode: "contain",
  },
  brandingContainer: {
    marginTop:  50,
    alignItems: "center",
  },
  footerBrand: {
    fontSize:      38,
    fontWeight:    "bold",
    color:         COLORS.primaryText,
    letterSpacing: 0.5,
    fontFamily:    FONT.bold,
  },
  footerSub: {
    fontSize:   18,
    color:      COLORS.primaryText,
    textAlign:  "center",
    opacity:    0.7,
    marginTop:  10,
    lineHeight: 24,
    fontFamily: FONT.regular,
  },
});