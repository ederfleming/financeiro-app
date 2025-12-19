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
  todayButton: {
    marginRight: spacing.sm,
  },
  todayIconContainer: {
    position: "relative",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  todayBadge: {
    position: "absolute",
    top: 8,
    left: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.purple[500],
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.white,
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
  diaColuna: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  valoresColuna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.lg,
  },
  valorLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  headerSaldoColuna: {
    width: 140,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
