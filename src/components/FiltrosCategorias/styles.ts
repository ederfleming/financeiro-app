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
    maxHeight: 60,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  content: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filtroButton: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  filtroTexto: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontFamily: typography.medium,
  },
  filtroTextoActive: {
    color: colors.white,
  },
});
