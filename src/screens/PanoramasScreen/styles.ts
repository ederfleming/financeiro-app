import { colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  trimestreContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm, // ✨ Espaçamento entre colunas
  },
  colunaScroll: {
    flex: 1,
  },
  coluna: {
    flex: 1,
    overflow: "hidden",
  },
  colunaHeader: {
    backgroundColor: colors.purple[50],
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  colunaHeaderText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.purple[700],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  diaRow: {
    height: 30,
    alignSelf: "stretch",
    flexDirection: "row",
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  diaColuna: {
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  diaNumero: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.gray[200],
    position: "relative",
  },
  diaRowWeekend: {
    backgroundColor: colors.purple[300],
    borderLeftWidth: 4,
    borderLeftColor: colors.purple[700],
  },
  diaTexto: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.gray[800],
  },
  diaTextoWeekend: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.white,
  },
  rowSaldoColuna: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "stretch",
    paddingRight: spacing.xs,
  },
  saldoTexto: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.gray[800],
  },
});
