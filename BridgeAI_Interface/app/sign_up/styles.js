import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const FONT_REGULAR = "SourGummy";
const FONT_BOLD    = "SourGummy-Bold";

const COLORS = {
  background: "#E8E4D9",
  surface: "#FFFFFF",
  text: "#1A1A14",
  textMuted: "#6B6B5A",
  textPlaceholder: "#A8A89A",
  brand: "#3D4A2E",
  primary: "#1A1A14",
  primaryText: "#FFFFFF",
  primaryDisabled: "#C4C0B4",
  primaryDisabledText: "#8A8A7A",
  inputBorder: "#D4D0C4",
  inputFocusBorder: "#3D4A2E",
  divider: "#C4C0B4",
  socialButton: "#FFFFFF",
  socialBorder: "#D4D0C4",
  socialText: "#1A1A14",
  appleButton: "#1A1A14",
  appleText: "#FFFFFF",
  link: "#3D4A2E",
  legalText: "#6B6B5A",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const RADIUS = {
  input: 10,
  button: 10,
  social: 10,
};

const isSmallDevice = height < 700;
const verticalPad = isSmallDevice ? SPACING.lg : SPACING.xxl;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: verticalPad,
    paddingBottom: SPACING.xl,
    alignItems: "stretch",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: width * 0.22,
    height: width * 0.22,
    maxWidth: 90,
    maxHeight: 90,
  },
  brandName: {
    fontFamily: FONT_BOLD,
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.brand,
    marginTop: SPACING.xs,
    letterSpacing: 0.5,
  },

  title: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONT_REGULAR,
    marginBottom: SPACING.md,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    minHeight: 50,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.primaryDisabled,
  },
  primaryButtonText: {
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_BOLD,
    letterSpacing: 0.3,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONT_REGULAR,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.socialButton,
    borderWidth: 1,
    borderColor: COLORS.socialBorder,
    borderRadius: RADIUS.social,
    paddingVertical: 13,
    marginBottom: SPACING.sm,
    minHeight: 50,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: SPACING.sm,
  },
  socialButtonText: {
    color: COLORS.socialText,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONT_REGULAR,
  },

  appleButton: {
    backgroundColor: COLORS.appleButton,
    borderColor: COLORS.appleButton,
  },
  appleIcon: {
    tintColor: "#FFFFFF",
  },
  appleButtonText: {
    color: COLORS.appleText,
  },

  legalText: {
    marginTop: SPACING.md,
    fontSize: 11,
    color: COLORS.legalText,
    textAlign: "center",
    lineHeight: 16,
    fontFamily: FONT_REGULAR,
  },
  legalLink: {
    color: COLORS.link,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  loginPrompt: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONT_REGULAR,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.brand,
    fontFamily: FONT_BOLD,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default styles;