import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resetStorage } from "@/services/storage";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

export default function MenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  function handlePrevisaoGastoDiario() {
    navigation.navigate("PrevisaoGastoDiario");
  }

  function handleReiniciarPanoramas() {
    Alert.alert(
      "⚠️ Atenção: Ação Irreversível",
      "Você está prestes a APAGAR TODOS OS DADOS do aplicativo:\n\n" +
        "• Todas as transações\n" +
        "• Todas as tags\n" +
        "• Todas as configurações\n" +
        "• Gastos variáveis\n" +
        "• Dias conciliados\n\n" +
        "Esta ação NÃO PODE SER DESFEITA!\n\n" +
        "Deseja realmente continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, apagar tudo",
          style: "destructive",
          onPress: confirmarReset,
        },
      ]
    );
  }

  async function confirmarReset() {
    try {
      await resetStorage();

      // Reset completo da navegação (não permite voltar)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ConfiguracaoInicial" }],
        })
      );
    } catch (error) {
      console.error("Erro ao resetar:", error);
      Alert.alert(
        "Erro",
        "Não foi possível resetar o aplicativo. Tente novamente."
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ✨ Header com botão de voltar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.purple[500]} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Menu</Text>
          <Text style={styles.headerSubtitle}>Configurações e opções</Text>
        </View>
        {/* View vazia para manter o título centralizado */}
        <View style={styles.backButton} />
      </View>

      {/* Menu Items */}
      <View style={styles.menuList}>
        {/* Previsão de Gasto Diário */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handlePrevisaoGastoDiario}
        >
          <View
            style={[
              styles.menuIconContainer,
              { backgroundColor: colors.purple[100] },
            ]}
          >
            <Ionicons name="calculator" size={24} color={colors.purple[500]} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Previsão de Gasto Diário</Text>
            <Text style={styles.menuItemDescription}>
              Edite seus gastos variáveis mensais
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Reiniciar Panoramas */}
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemDanger]}
          onPress={handleReiniciarPanoramas}
        >
          <View
            style={[
              styles.menuIconContainer,
              { backgroundColor: colors.red[100] },
            ]}
          >
            <Ionicons name="trash" size={24} color={colors.red[500]} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, styles.menuItemTitleDanger]}>
              Reiniciar Panoramas
            </Text>
            <Text style={styles.menuItemDescription}>
              Apaga todos os dados e reinicia o app
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.red[500]} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Panorama$ v1.0.0</Text>
        <Text style={styles.footerSubtext}>
          Controle financeiro inteligente
        </Text>
      </View>
    </SafeAreaView>
  );
}
