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
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.purple[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
    color: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },

  // Card de Entradas
  entradasCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.green[100],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  entradasIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  entradasContent: {
    flex: 1,
  },
  entradasLabel: {
    fontSize: fontSize.sm,
    fontFamily: typography.medium,
    color: colors.green[900],
    marginBottom: 4,
  },
  entradasValor: {
    fontSize: fontSize.xxxl,
    fontFamily: typography.bold,
    color: colors.green[700],
  },

  // Seção
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
    color: colors.gray[800],
  },

  // Slider
  sliderContainer: {
    marginBottom: spacing.xl,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  sliderLabel: {
    fontSize: fontSize.sm,
    fontFamily: typography.medium,
    color: colors.gray[600],
  },
  sliderLabelCenter: {
    fontSize: fontSize.md,
    fontFamily: typography.bold,
    color: colors.purple[500],
  },

  // Inputs
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontFamily: typography.semibold,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.purple[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: fontSize.xl,
    fontFamily: typography.bold,
    color: colors.gray[900],
    textAlign: "center",
  },
  inputPrefix: {
    fontSize: fontSize.lg,
    fontFamily: typography.bold,
    color: colors.gray[600],
    marginRight: spacing.xs,
  },
  inputSuffix: {
    fontSize: fontSize.lg,
    fontFamily: typography.bold,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  inputSeparator: {
    fontSize: fontSize.md,
    fontFamily: typography.medium,
    color: colors.gray[500],
    paddingTop: spacing.lg,
  },

  // Resumo
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.purple[100],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.purple[300],
  },
  resumoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resumoLabel: {
    fontSize: fontSize.sm,
    fontFamily: typography.medium,
    color: colors.purple[900],
    marginBottom: 4,
  },
  resumoValor: {
    fontSize: fontSize.xxl,
    fontFamily: typography.bold,
    color: colors.purple[700],
  },

  // Info Box
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.blue[100],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[800],
    marginLeft: spacing.sm,
    lineHeight: 18,
  },

  // Botão Salvar
  salvarButton: {
    backgroundColor: colors.purple[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  salvarTexto: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitulo: {
    fontSize: fontSize.xl,
    fontFamily: typography.bold,
    color: colors.gray[900],
    marginTop: spacing.sm,
  },
  modalDescricao: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[700],
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  modalInputContainer: {
    marginBottom: spacing.xl,
  },
  modalInputLabel: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.purple[500],
  },
  cifrao: {
    fontSize: fontSize.xxxl,
    fontFamily: typography.bold,
    color: colors.gray[600],
    marginRight: spacing.sm,
  },
  valorInput: {
    flex: 1,
    fontSize: fontSize.xxxl,
    fontFamily: typography.bold,
    color: colors.gray[800],
  },
  modalButton: {
    backgroundColor: colors.purple[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
  },
});
