import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProjecaoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Projeção</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[100],
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
