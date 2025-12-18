import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  dataSeletor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  dataButton: {
    padding: spacing.sm,
  },
  dataDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dataTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  cifrao: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  valorInput: {
    flex: 1,
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  categoriasContainer: {
    gap: spacing.md,
  },
  categoriaButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minWidth: 100,
  },
  categoriaTexto: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  categoriaTextoActive: {
    color: colors.white,
  },
  tagsContainer: {
    gap: spacing.sm,
  },
  tagButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagTexto: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  tagTextoActive: {
    color: colors.white,
  },
  descricaoInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: "top",
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  salvarButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  salvarButtonDisabled: {
    opacity: 0.6,
  },
  salvarTexto: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.white,
  },
});
