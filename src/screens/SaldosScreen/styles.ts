import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mesAno: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  filtrosContainer: {
    height: 60,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtrosContent: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filtroButton: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.backgroundTertiary,
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  filtroTexto: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  filtroTextoActive: {
    color: colors.textLight,
  },
  tabelaHeader: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  headerTexto: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  diaRow: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "stretch",
  },
  diaRowDisabled: {
    opacity: 0.4,
  },
  diaColuna: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  diaNumero: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    position: "relative",
  },
  diaConciliado: {
    backgroundColor: colors.successLight,
  },
  diaRowWeekend: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryDark,
  },
  diaTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  diaTextoWeekend: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.white,
  },
  checkMark: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  valoresColuna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.lg,
  },
  valorLinha: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  valorLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  valorTexto: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  headerSaldoColuna: {
    width: 140,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  rowSaldoColuna: {
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  saldoPositivo: {
    backgroundColor: colors.saldoPositivo,
  },
  saldoNegativo: {
    backgroundColor: colors.saldoNegativo,
  },
  saldoTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  saldoTextoNegativo: {
    color: colors.errorDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
