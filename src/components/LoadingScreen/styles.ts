import { colors, fontSize, spacing, typography } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[50],
  },
  message: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
  },
});
