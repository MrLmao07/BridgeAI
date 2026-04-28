import { Platform, StyleSheet } from "react-native";

// Design Tokens 
const FONT = {
  regular: "SourGummy",
  bold:    "SourGummy-Bold",
};

const COLORS = {
  background:   "#EAE7D6",
  overlay:      "#F5F1E8",
  surface:      "#FFFFFF",
  surfaceMuted: "#D6DEAD",

  accent:      "#6AAA85",
  accentDark:  "#4A8A65",
  accentLight: "#C8E8D8",

  textPrimary:   "#4A5043",
  textSecondary: "#5A4A35",
  textMuted:     "#9A8A75",
  textOnAccent:  "#FFFFFF",

  border:      "#D0C8B8",
  borderLight: "#E8E2D4",

  diffHighlight: "#FFF8E8",
  diffText:      "#8A6A10",
  danger:        "#CC3333",
  dangerLight:   "#FCECEA",

  brandBg: "#1A1A1A",
  shadow:  "#000",
};

const SPACE  = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const RADIUS = { sm: 6, md: 10, lg: 14, pill: 24 };

// Platform-aware card shadow applied via spread
const CARD_SHADOW = Platform.select({
  ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  android: { elevation: 2 },
});

const HEADER_SHADOW = {
  shadowColor:   COLORS.shadow,
  shadowOffset:  { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius:  5,
  elevation:     10,
};

const MENU_SHADOW = {
  shadowColor:   COLORS.shadow,
  shadowOffset:  { width: -4, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius:  10,
  elevation:     10,
};

// Stylesheet
const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex:              1,
    backgroundColor:   COLORS.background,
    paddingHorizontal: SPACE.lg,
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
    ...HEADER_SHADOW,
  },
  headerIcon: {
    width:      48,
    height:     48,
    resizeMode: "contain",
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
    ...MENU_SHADOW,
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
    color:      COLORS.textPrimary,
    fontFamily: FONT.regular,
  },

  // Search screen
  headline: {
    fontSize:     26,
    fontWeight:   "700",
    fontStyle:    "italic",
    letterSpacing: -0.5,
    color:        COLORS.textPrimary,
    marginTop:    SPACE.lg,
    marginBottom: SPACE.xl,
    lineHeight:   34,
    fontFamily:   FONT.bold,
  },
  searchWrapper: {
    position:     "relative",
    marginBottom: SPACE.sm,
  },
  searchInput: {
    backgroundColor:   COLORS.surfaceMuted,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical:   SPACE.md,
    fontSize:          14,
    fontWeight:        "400",
    color:             COLORS.textPrimary,
    fontFamily:        FONT.regular,
  },
  searchSpinner: {
    position:  "absolute",
    right:     SPACE.md,
    top:       "50%",
    transform: [{ translateY: -8 }],
  },

  // Suggestions
  suggestionsContainer: {
    backgroundColor: COLORS.surface,
    borderWidth:     1,
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.md,
    marginBottom:    SPACE.md,
    maxHeight:       300,
    ...CARD_SHADOW,
  },
  suggestionsList: {
    borderRadius: RADIUS.md,
    overflow:     "hidden",
  },
  suggestionItem: {
    paddingHorizontal: SPACE.md,
    paddingVertical:   SPACE.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
  },
  suggestionItemDisabled: {
    opacity: 0.5,
  },
  suggestionContent: {
    flex:        1,
    marginRight: SPACE.sm,
  },
  suggestionName: {
    fontSize:     14,
    fontWeight:   "400",
    color:        COLORS.textPrimary,
    marginBottom: SPACE.xs,
    fontFamily:   FONT.regular,
  },
  suggestionMeta: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           SPACE.sm,
  },
  suggestionPrice: {
    fontSize:   12,
    fontWeight: "600",
    color:      COLORS.accent,
    fontFamily: FONT.bold,
  },
  alreadyAddedTag: {
    fontSize:   11,
    fontWeight: "400",
    color:      COLORS.textMuted,
    fontStyle:  "italic",
    fontFamily: FONT.regular,
  },

  // Category badge
  categoryBadge: {
    backgroundColor:   COLORS.accentLight,
    borderRadius:      RADIUS.pill,
    paddingHorizontal: SPACE.sm,
    paddingVertical:   2,
  },
  categoryBadgeText: {
    fontSize:   11,
    fontWeight: "600",
    color:      COLORS.accentDark,
    fontFamily: FONT.bold,
  },

  // Selected chips
  selectedSection: {
    marginTop: SPACE.md,
  },
  selectedLabel: {
    fontSize:        12,
    fontWeight:      "500",
    color:           COLORS.textMuted,
    marginBottom:    SPACE.sm,
    textTransform:   "uppercase",
    letterSpacing:   0.5,
    fontFamily:      FONT.regular,
  },
  selectedChip: {
    backgroundColor:   COLORS.accent,
    borderRadius:      RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical:   SPACE.sm,
    marginBottom:      SPACE.sm,
    flexDirection:     "row",
    alignItems:        "center",
  },
  selectedDot: {
    width:           8,
    height:          8,
    borderRadius:    RADIUS.pill,
    backgroundColor: COLORS.accentLight,
    marginRight:     SPACE.sm,
  },
  selectedChipText: {
    flex:       1,
    fontSize:   12,
    fontWeight: "500",
    color:      COLORS.textOnAccent,
    fontFamily: FONT.regular,
  },
  removeBtn: {
    marginLeft:     SPACE.sm,
    width:          20,
    height:         20,
    alignItems:     "center",
    justifyContent: "center",
  },
  removeBtnText: {
    fontSize:   18,
    color:      COLORS.textOnAccent,
    lineHeight: 20,
    fontFamily: FONT.regular,
  },

  // Action buttons
  actionRow: {
    flexDirection: "row",
    gap:           SPACE.sm,
    marginTop:     SPACE.sm,
    flexWrap:      "wrap",
  },
  btnPrimary: {
    flex:            1,
    backgroundColor: COLORS.textPrimary,
    borderRadius:    RADIUS.md,
    paddingVertical: SPACE.md,
    alignItems:      "center",
    minWidth:        120,
  },
  btnPrimaryText: {
    fontSize:   14,
    fontWeight: "600",
    color:      COLORS.textOnAccent,
    fontFamily: FONT.bold,
  },
  btnSecondary: {
    flex:            1,
    backgroundColor: "transparent",
    borderWidth:     1.5,
    borderColor:     COLORS.accent,
    borderRadius:    RADIUS.md,
    paddingVertical: SPACE.md,
    alignItems:      "center",
    borderStyle:     "dashed",
    minWidth:        120,
  },
  btnSecondaryText: {
    fontSize:   14,
    fontWeight: "600",
    color:      COLORS.accent,
    fontFamily: FONT.bold,
  },

  // DB status
  loadingDb: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            SPACE.sm,
    marginTop:      SPACE.xl,
    justifyContent: "center",
  },
  loadingDbText: {
    fontSize:   12,
    color:      COLORS.textMuted,
    fontFamily: FONT.regular,
  },

  // Navigation row (back button + title)
  navRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    paddingTop:     Platform.OS === "ios" ? 60 : 40,
    paddingBottom:  SPACE.lg,
  },
  backBtn: {
    paddingVertical: SPACE.sm,
  },
  backBtnText: {
    fontSize:   14,
    fontWeight: "600",
    color:      COLORS.accent,
    fontFamily: FONT.bold,
  },

  // Product card
  productCard: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.lg,
    borderWidth:     0.5,
    borderColor:     COLORS.border,
    marginBottom:    SPACE.lg,
    overflow:        "hidden",
    ...CARD_SHADOW,
  },
  brandBanner: {
    backgroundColor: COLORS.brandBg,
    paddingVertical: SPACE.md,
    alignItems:      "center",
  },
  brandBannerText: {
    color:         "#FFFFFF",
    fontSize:      16,
    fontWeight:    "700",
    letterSpacing: 3,
    fontFamily:    FONT.bold,
  },
  productCardBody: {
    padding: SPACE.lg,
  },
  productTitle: {
    fontSize:     15,
    fontWeight:   "500",
    color:        COLORS.textPrimary,
    lineHeight:   22,
    marginBottom: SPACE.sm,
    fontFamily:   FONT.regular,
  },
  productPrice: {
    fontSize:   20,
    fontWeight: "700",
    color:      COLORS.accent,
    fontFamily: FONT.bold,
  },

  // Specs card
  specsCard: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.lg,
    borderWidth:     0.5,
    borderColor:     COLORS.border,
    overflow:        "hidden",
    marginBottom:    SPACE.lg,
    ...CARD_SHADOW,
  },
  specRow: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "flex-start",
    paddingHorizontal: SPACE.md,
    paddingVertical:   SPACE.sm + 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    gap:               SPACE.md,
  },
  specRowHighlight: {
    backgroundColor: COLORS.background,
  },
  specLabel: {
    fontSize:   12,
    fontWeight: "500",
    color:      COLORS.textSecondary,
    flex:       1,
    fontFamily: FONT.regular,
  },
  specValue: {
    fontSize:   12,
    fontWeight: "500",
    color:      COLORS.textPrimary,
    flex:       1.5,
    textAlign:  "right",
    fontFamily: FONT.regular,
  },

  // Compare add button
  compareAddBtn: {
    backgroundColor: COLORS.accent,
    borderRadius:    RADIUS.md,
    paddingVertical: SPACE.md,
    alignItems:      "center",
    marginBottom:    SPACE.md,
  },
  compareAddBtnText: {
    fontSize:   14,
    fontWeight: "600",
    color:      COLORS.textOnAccent,
    fontFamily: FONT.bold,
  },

  // Compare screen
  compareTitle: {
    fontSize:   14,
    fontWeight: "500",
    color:      COLORS.textMuted,
    fontFamily: FONT.regular,
  },
  compareHeader: {
    flexDirection: "row",
    marginBottom:  SPACE.md,
  },
  compareProductHeader: {
    flex:            1,
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.md,
    borderWidth:     0.5,
    borderColor:     COLORS.border,
    overflow:        "hidden",
    ...CARD_SHADOW,
  },
  brandBannerSmall: {
    backgroundColor: COLORS.brandBg,
    paddingVertical: SPACE.sm,
    alignItems:      "center",
  },
  brandBannerSmallText: {
    color:         "#FFFFFF",
    fontSize:      10,
    fontWeight:    "700",
    letterSpacing: 2,
    fontFamily:    FONT.bold,
  },
  compareProductName: {
    fontSize:   11,
    fontWeight: "500",
    color:      COLORS.textPrimary,
    padding:    SPACE.sm,
    lineHeight: 15,
    fontFamily: FONT.regular,
  },
  compareProductPrice: {
    fontSize:        12,
    fontWeight:      "700",
    color:           COLORS.accent,
    paddingHorizontal: SPACE.sm,
    paddingBottom:   SPACE.sm,
    fontFamily:      FONT.bold,
  },
  compareRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    paddingVertical:   SPACE.sm,
    paddingHorizontal: SPACE.sm,
  },
  compareRowAlt: {
    backgroundColor: COLORS.background,
  },
  compareRowDiff: {
    backgroundColor: COLORS.diffHighlight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  compareRowLabel: {
    fontSize:        11,
    fontWeight:      "600",
    color:           COLORS.textMuted,
    textTransform:   "uppercase",
    letterSpacing:   0.3,
    marginBottom:    SPACE.xs,
    fontFamily:      FONT.bold,
  },
  compareRowValues: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           SPACE.sm,
  },
  compareRowValue: {
    flex:       1,
    fontSize:   12,
    fontWeight: "500",
    color:      COLORS.textPrimary,
    textAlign:  "center",
    fontFamily: FONT.regular,
  },
  compareRowValueDiff: {
    color:      COLORS.diffText,
    fontWeight: "700",
    fontFamily: FONT.bold,
  },
  compareRowDivider: {
    color:      COLORS.border,
    fontSize:   14,
    fontFamily: FONT.regular,
  },
});

styles.colors = COLORS;
export default styles;