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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl * 2,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: typography.bold,
    color: colors.gray[800],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.purple[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.white,
  },
});
