import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  typography,
} from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple[500],
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xxl * 3,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: spacing.xxl * 2,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xxl,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 110,
    height: 110,
  },
  appName: {
    fontSize: fontSize.xxxl * 1.5,
    fontFamily: typography.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  appSubtitle: {
    fontSize: fontSize.lg,
    fontFamily: typography.regular,
    color: colors.purple[100],
  },
  loginContainer: {
    width: "100%",
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
  },
  loginButton: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginIcon: {
    marginRight: spacing.md,
  },
  loginButtonText: {
    fontSize: fontSize.xl,
    fontFamily: typography.bold,
    color: colors.purple[500],
  },
  biometricsText: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.purple[100],
    textAlign: "center",
  },
});
