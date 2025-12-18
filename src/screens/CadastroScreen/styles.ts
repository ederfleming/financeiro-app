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
    marginBottom: spacing.xl,
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
  descricaoInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 50,
  },
  recorrenciaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  recorrenciaTextoContainer: {
    flex: 1,
  },
  recorrenciaLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recorrenciaDescricao: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
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
  salvarButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  salvarButtonDisabled: {
    opacity: 0.6,
  },
  salvarTexto: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.white,
  },
  cancelarButton: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelarTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  listaSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  listaTitulo: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  transacaoItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  transacaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  transacaoIconeContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  transacaoInfo: {
    flex: 1,
  },
  transacaoDescricao: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transacaoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  transacaoCategoria: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  transacaoSeparador: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  transacaoTag: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  transacaoValor: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  transacaoAcoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  acaoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  acaoTexto: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitulo: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  recorrenciaOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recorrenciaOptionActive: {
    backgroundColor: colors.backgroundTertiary,
  },
  recorrenciaOptionLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recorrenciaOptionDescricao: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalExclusaoContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginHorizontal: spacing.xl,
    maxWidth: 400,
    alignSelf: "center",
  },
  modalExclusaoHeader: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  modalExclusaoTitulo: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  modalExclusaoSubtitulo: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  opcaoExclusaoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  opcaoExclusaoButtonDanger: {
    backgroundColor: colors.errorLight,
  },
  opcaoExclusaoTexto: {
    flex: 1,
    marginLeft: spacing.md,
  },
  opcaoExclusaoTitulo: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  opcaoExclusaoDescricao: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cancelarExclusaoButton: {
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelarExclusaoTexto: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
