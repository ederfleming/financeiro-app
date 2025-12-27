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
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  secaoTitulo: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[600],
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Economia (Meta de Economia)
  economiaContainer: {
    marginTop: spacing.md,
  },
  economiaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: spacing.sm,
  },
  economiaValor: {
    fontSize: fontSize.xxxl,
    fontFamily: typography.bold,
    color: colors.green[900],
  },
  economiaMeta: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
  },
  fraseMotivacional: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[600],
    marginTop: spacing.sm,
    fontStyle: "italic",
    textAlign: "center",
  },
  avisoSemMeta: {
    // ← NOVO
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.purple[500],
    marginTop: spacing.md,
    textAlign: "center",
    backgroundColor: colors.purple[100],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  avisoSemEntradas: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.yellow[100],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  avisoSemEntradasTexto: {
    fontSize: fontSize.sm,
    fontFamily: typography.medium,
    color: colors.yellow[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  avisoDefinirMeta: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.purple[500],
    marginTop: spacing.md,
    textAlign: "center",
    backgroundColor: colors.purple[100],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },

  // Diário Médio
  diarioMedioContainer: {
    marginTop: spacing.md,
  },
  diarioMedioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  diarioMedioLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  diarioMedioDivisor: {
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
    color: colors.gray[600],
    marginLeft: spacing.sm,
  },
  diarioMedioRight: {
    alignItems: "flex-end",
  },
  diarioMedioValor: {
    fontSize: fontSize.xxl,
    fontFamily: typography.bold,
    color: colors.orange[300],
  },
  diarioMedioAviso: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[400],
    textAlign: "center",
    fontStyle: "italic",
    marginTop: spacing.sm,
  },

  // Espaçamento inferior
  bottomSpacer: {
    height: spacing.xxl,
  },
});
