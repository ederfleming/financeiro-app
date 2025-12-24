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

  // ✨ Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontFamily: typography.bold,
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[600],
    marginTop: 2,
  },

  menuList: {
    flex: 1,
    padding: spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  menuItemDanger: {
    borderColor: colors.red[200],
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: fontSize.md,
    fontFamily: typography.semibold,
    color: colors.gray[900],
    marginBottom: 4,
  },
  menuItemTitleDanger: {
    color: colors.red[500],
  },
  menuItemDescription: {
    fontSize: fontSize.sm,
    fontFamily: typography.regular,
    color: colors.gray[600],
  },
  footer: {
    padding: spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  footerText: {
    fontSize: fontSize.sm,
    fontFamily: typography.semibold,
    color: colors.gray[700],
  },
  footerSubtext: {
    fontSize: fontSize.xs,
    fontFamily: typography.regular,
    color: colors.gray[500],
    marginTop: 4,
  },
});
