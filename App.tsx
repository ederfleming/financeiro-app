import AppNavigator from "@/navigation/AppNavigator";
import { colors } from "@/theme/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function App() {
  return (
    <>
      {/* StatusBar de fundo */}
      {Platform.OS === "ios" && <View style={styles.statusBarBackground} />}

      {/* StatusBar dos ícones */}
      <StatusBar style="light" backgroundColor={colors.purple[500]} />

      {/* Conteúdo do app */}
      <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
        <AppNavigator />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === "ios" ? 55 : 0, // altura padrão iOS (iPhone X+ 44, outros 20)
    backgroundColor: colors.purple[500], // cor da sua StatusBar
  },
});
