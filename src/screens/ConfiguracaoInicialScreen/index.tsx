import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getConfig, setConfig } from "@/services/storage";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConfiguracaoInicialScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [saldoInicial, setSaldoInicial] = useState("");
  const [dataInicial, setDataInicial] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);

  const formatarValorInput = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9]/g, "");

    if (!apenasNumeros) {
      setSaldoInicial("");
      return;
    }

    const numero = parseInt(apenasNumeros) / 100;
    const formatado = numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setSaldoInicial(formatado);
  };

  const converterValorParaNumero = (valorFormatado: string): number => {
    if (!valorFormatado) return 0;
    const numeroLimpo = valorFormatado.replace(/\./g, "").replace(",", ".");
    return parseFloat(numeroLimpo);
  };

  const mudarData = (direcao: "anterior" | "proximo") => {
    const dataAtual = parseDate(dataInicial);
    const novaData = new Date(dataAtual);

    if (direcao === "anterior") {
      novaData.setDate(novaData.getDate() - 1);
    } else {
      novaData.setDate(novaData.getDate() + 1);
    }

    setDataInicial(formatDate(novaData));
  };

  const handleSalvar = async () => {
    if (!saldoInicial) {
      Alert.alert("Erro", "Digite o saldo inicial");
      return;
    }

    try {
      setLoading(true);

      const config = await getConfig();

      await setConfig({
        ...config,
        saldoInicial: converterValorParaNumero(saldoInicial),
        dataInicial,
        onboardingCompleto: true,
      });

      Alert.alert("Sucesso", "Configuração salva com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.replace("MainTabs"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      Alert.alert("Erro", "Não foi possível salvar a configuração");
    } finally {
      setLoading(false);
    }
  };

  const dataObj = parseDate(dataInicial);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="settings" size={60} color={colors.purple[500]} />
            </View>
            <Text style={styles.title}>Configuração Inicial</Text>
            <Text style={styles.subtitle}>
              Vamos configurar seu saldo inicial para começar
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Saldo Inicial */}
            <View style={styles.section}>
              <Text style={styles.label}>Saldo Inicial</Text>
              <Text style={styles.helper}>
                Quanto você tem disponível hoje?
              </Text>
              <View style={styles.valorContainer}>
                <Text style={styles.cifrao}>R$</Text>
                <TextInput
                  style={styles.valorInput}
                  value={saldoInicial}
                  onChangeText={formatarValorInput}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            {/* Data Inicial */}
            <View style={styles.section}>
              <Text style={styles.label}>Data Inicial</Text>
              <Text style={styles.helper}>
                A partir de quando começar a contar?
              </Text>
              <View style={styles.dataSeletor}>
                <TouchableOpacity
                  onPress={() => mudarData("anterior")}
                  style={styles.dataButton}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.purple[500]}
                  />
                </TouchableOpacity>

                <View style={styles.dataDisplay}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.gray[600]}
                  />
                  <Text style={styles.dataTexto}>{dataFormatada}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => mudarData("proximo")}
                  style={styles.dataButton}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.purple[500]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.blue[500]}
              />
              <Text style={styles.infoText}>
                Esses valores serão usados como base para todos os cálculos de
                saldo do aplicativo.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.salvarButton,
              loading && styles.salvarButtonDisabled,
            ]}
            onPress={handleSalvar}
            disabled={loading}
          >
            <Text style={styles.salvarTexto}>
              {loading ? "Salvando..." : "Começar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
