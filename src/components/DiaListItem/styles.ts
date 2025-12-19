import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  valorTexto: {
    fontSize: fontSize.lg,
    color: colors.gray[800],
  },
  rowSaldoColuna: {
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  saldoTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.gray[800],
  },
});
