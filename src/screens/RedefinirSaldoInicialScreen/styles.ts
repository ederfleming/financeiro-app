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
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.purple[100],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[800],
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: colors.yellow[100],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  warningText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.yellow[900],
    marginLeft: spacing.sm,
    lineHeight: 18,
    fontFamily: typography.medium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
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
  dataSeletor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.purple[500],
  },
  dataDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataTexto: {
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
    color: colors.gray[800],
  },
  salvarButton: {
    backgroundColor: colors.purple[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  salvarTexto: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontFamily: typography.semibold,
  },
});
