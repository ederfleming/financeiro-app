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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontFamily: typography.medium,
    color: colors.gray[800],
  },
  iconesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icone: {
    marginLeft: spacing.xs,
  },
  valor: {
    fontSize: fontSize.xxl,
    fontFamily: typography.bold,
    marginBottom: spacing.xs,
  },
  subtitulo: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
  },
  description: {
    fontSize: fontSize.md,
    fontFamily: typography.regular,
    color: colors.gray[600],
    marginLeft: 8,
  },
});
