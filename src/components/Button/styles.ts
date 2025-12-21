import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  base: {
    flex: 1, // Garante que ocupem o mesmo espaço lateralmente
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  contained: { backgroundColor: colors.purple[500] },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.purple[500],
  },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: "600" },
  startIcon: { marginRight: 8 },
  endIcon: { marginLeft: 8 },
});
