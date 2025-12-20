import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl * 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.purple[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    color: colors.gray[800],
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  helper: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
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
    fontWeight: "bold",
    color: colors.gray[600],
    marginRight: spacing.sm,
  },
  valorInput: {
    flex: 1,
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
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
    color: colors.gray[800],
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.blue[100],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.blue[900],
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  salvarButton: {
    backgroundColor: colors.purple[500],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  salvarButtonDisabled: {
    opacity: 0.6,
  },
  salvarTexto: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.white,
  },
});
