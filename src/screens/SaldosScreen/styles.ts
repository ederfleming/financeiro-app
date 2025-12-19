import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  mesAno: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.gray[800],
  },
  filtrosContainer: {
    height: 60,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
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
    backgroundColor: colors.gray[200],
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  filtroTexto: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontWeight: "500",
  },
  filtroTextoActive: {
    color: colors.white,
  },
  tabelaHeader: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  headerTexto: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.gray[600],
    textTransform: "uppercase",
  },
  diaRow: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.gray[50],
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
    backgroundColor: colors.gray[200],
    position: "relative",
  },
  diaConciliado: {
    backgroundColor: colors.green[200],
  },
  diaRowWeekend: {
    backgroundColor: colors.purple[300],
    borderLeftWidth: 4,
    borderLeftColor: colors.purple[700],
  },
  diaTexto: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.gray[800],
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
    backgroundColor: colors.green[500],
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
    color: colors.gray[600],
  },
  valorTexto: {
    fontSize: fontSize.lg,
    color: colors.gray[800],
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
    backgroundColor: colors.yellow[200],
  },
  saldoNegativo: {
    backgroundColor: colors.red[200],
  },
  saldoTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.gray[800],
  },
  saldoTextoNegativo: {
    color: colors.red[700],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
