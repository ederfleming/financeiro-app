import { colors, fontSize, spacing, typography } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  column: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
  },
  columnFlex: {
    flex: 1,
  },
  columnCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  columnRight: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: spacing.xs,
  },
  headerTexto: {
    fontSize: fontSize.sm,
    fontFamily: typography.semibold,
    color: colors.gray[600],
    textTransform: "uppercase",
  },
});
