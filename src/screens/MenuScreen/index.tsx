import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, View } from "react-native";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

export default function MenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Menu</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
