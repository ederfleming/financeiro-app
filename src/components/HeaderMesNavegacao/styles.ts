import { colors, fontSize, spacing } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  menuButton: {
    marginLeft: spacing.sm,
  },
  mesAno: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.gray[800],
  },
  icon: {
    color: colors.gray[800],
  },
});
