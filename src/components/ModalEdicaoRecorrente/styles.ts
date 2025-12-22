import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  typography,
} from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginHorizontal: spacing.xl,
    maxWidth: 400,
    width: "90%",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontFamily: typography.bold,
    color: colors.gray[800],
    marginTop: spacing.lg,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
    marginTop: spacing.sm,
    textAlign: "center",
  },
  opcaoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  opcaoTexto: {
    flex: 1,
    marginLeft: spacing.md,
  },
  opcaoTitulo: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginBottom: 4,
  },
  opcaoDescricao: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  cancelarButton: {
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelarTexto: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[600],
  },
});
