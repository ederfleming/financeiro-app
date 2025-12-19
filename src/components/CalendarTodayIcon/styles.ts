import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: colors.gray[800],
    borderRadius: 4,
    overflow: "hidden",
  },
  header: {
    backgroundColor: colors.purple[500],
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingBottom: 2,
  },
  ring: {
    width: 3,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontWeight: "bold",
    color: colors.gray[800],
  },
});
