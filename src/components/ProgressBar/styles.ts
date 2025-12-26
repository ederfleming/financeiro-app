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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  barraFundo: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.round,
    overflow: "hidden",
  },
  barraPreenchida: {
    borderRadius: borderRadius.round,
  },
  percentualTexto: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[800],
    marginLeft: spacing.md,
    minWidth: 45,
    textAlign: "right",
  },
});
