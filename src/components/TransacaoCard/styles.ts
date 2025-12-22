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
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  descricao: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoriaLabel: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[600],
  },
  separator: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[400],
  },
  tag: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[600],
  },
  valor: {
    fontSize: fontSize.lg,
    fontFamily: typography.bold,
    color: colors.gray[800],
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontFamily: typography.semibold,
    color: colors.purple[500],
  },
});
