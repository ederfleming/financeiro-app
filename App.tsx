import AppNavigator from "@/navigation/AppNavigator";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
    const [fontsLoaded] = useFonts({
      InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
      InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
      InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
      InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    });

    if (!fontsLoaded) {
      return null;
    }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* StatusBar de fundo */}
      {Platform.OS === "ios" && <View style={styles.statusBarBackground} />}

      {/* StatusBar dos ícones */}
      <StatusBar style="light" backgroundColor={colors.purple[500]} />

      {/* Conteúdo do app */}
      <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
        <AppNavigator />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === "ios" ? 55 : 0, // altura padrão iOS (iPhone X+ 44, outros 20)
    backgroundColor: colors.purple[500], // cor da sua StatusBar
  },
});
