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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginLeft: spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  total: {
    fontSize: fontSize.lg,
    fontFamily: typography.bold,
    color: colors.gray[800],
    marginRight: spacing.sm,
  },
  tagsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tagItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  tagLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tagNome: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
    marginLeft: spacing.sm,
  },
  tagRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagValor: {
    fontSize: fontSize.md,
    fontFamily: typography.medium,
    color: colors.gray[800],
    marginRight: spacing.xs,
  },
  tagPercentual: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[400],
  },
});
