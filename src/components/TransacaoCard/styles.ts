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
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },

  // ==================== HEADER ====================
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  descricao: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoriaLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  separator: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    marginHorizontal: spacing.xs,
  },
  tag: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  valor: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.gray[900],
    marginLeft: spacing.sm,
  },

  // ==================== ACTIONS (TAG + BOTÕES) ====================
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },

  // Tag à esquerda
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    marginLeft: spacing.xs,
    color: colors.gray[500],
  },

  // Botões à direita
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.purple[500],
  },
});
