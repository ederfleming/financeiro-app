import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },

  // ==================== HEADER ====================
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },

  // ==================== LISTA ====================
  listContent: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },

  // ==================== CATEGORIA (ACCORDION) ====================
  categoriaContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  categoriaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  categoriaHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoriaIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
    marginRight: spacing.md,
  },
  categoriaLabel: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.gray[900],
  },
  categoriaHeaderRight: {
    marginLeft: spacing.md,
  },
  categoriaCount: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  // ==================== CONTEÚDO DA CATEGORIA ====================
  categoriaContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.gray[400],
    textAlign: "center",
    paddingVertical: spacing.lg,
  },

  // ==================== ITEM DE TAG ====================
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  tagItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tagItemText: {
    fontSize: fontSize.md,
    color: colors.gray[900],
    marginLeft: spacing.sm,
  },
  tagItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tagActionButton: {
    padding: spacing.sm,
  },

  // ==================== BOTÃO ADICIONAR TAG ====================
  addTagButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
  },
  addTagText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },

  // ==================== MODAL ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitulo: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.gray[900],
  },

  // ==================== MODAL BODY ====================
  modalBody: {
    padding: spacing.lg,
  },
  modalLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  modalInput: {
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.gray[900],
  },
  modalHint: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },

  // ==================== WARNING BOX ====================
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.orange[100],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.orange[700],
    flex: 1,
  },

  // ==================== MODAL FOOTER ====================
  modalFooter: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalButtonCancel: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: "center",
  },
  modalButtonCancelText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.gray[800],
  },
  modalButtonConfirm: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.purple[500],
    alignItems: "center",
  },
  modalButtonConfirmText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.white,
  },
  modalButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
});
