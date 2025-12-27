import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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

import LoadingScreen from "@/components/LoadingScreen";
import {
  criarTagSaldoInicial,
  criarTransacaoSaldoInicial,
  getConfig,
  getTransacoes,
  updateConfig,
  updateTransacao
} from "@/services/storage";
import { colors } from "@/theme/colors";
import { Config } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RedefinirSaldoInicial"
>;

export default function RedefinirSaldoInicialScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [saldoInicial, setSaldoInicial] = useState("");
  const [dataInicial, setDataInicial] = useState(formatDate(new Date()));

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const configAtual = await getConfig();
      setConfig(configAtual);

      // Formata saldo inicial
      const saldoFormatado = configAtual.saldoInicial.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setSaldoInicial(saldoFormatado);
      setDataInicial(configAtual.dataInicial);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      Alert.alert("Erro", "Não foi possível carregar as configurações.");
    } finally {
      setLoading(false);
    }
  }

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
    direcao === "anterior"
      ? novaData.setDate(novaData.getDate() - 1)
      : novaData.setDate(novaData.getDate() + 1);
    setDataInicial(formatDate(novaData));
  };

async function handleSalvar() {
  const novoSaldo = converterValorParaNumero(saldoInicial);

  if (novoSaldo <= 0) {
    Alert.alert("Atenção", "Informe um saldo inicial válido.");
    return;
  }

  try {
    setLoading(true);

    // ✨ CORRIGIDO: Busca todas as transações
    const transacoes = await getTransacoes();

    // Encontra a transação de saldo inicial
    const transacaoSaldoInicial = transacoes.find(
      (t) => t.categoria === "entradas" && t.tag === "Saldo Inicial"
    );

    if (transacaoSaldoInicial) {
      // ✨ ATUALIZA a transação existente com novos valores
      await updateTransacao(transacaoSaldoInicial.id, {
        valor: novoSaldo,
        data: dataInicial,
      });
    } else {
      // Se não existe, cria nova
      await criarTagSaldoInicial();
      await criarTransacaoSaldoInicial(novoSaldo, dataInicial);
    }

    // ✨ ATUALIZA config (SEM criar nova transação)
    await updateConfig({
      saldoInicial: novoSaldo,
      dataInicial,
    });

    Alert.alert(
      "Sucesso",
      "Saldo inicial atualizado com sucesso!\n\nTodos os cálculos foram recalculados.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  } catch (error) {
    console.error("Erro ao salvar:", error);
    Alert.alert("Erro", "Não foi possível salvar as alterações.");
  } finally {
    setLoading(false);
  }
}
  if (loading || !config) {
    return <LoadingScreen />;
  }

  const dataObj = parseDate(dataInicial);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Redefinir Saldo Inicial</Text>

        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.purple[500]}
            />
            <Text style={styles.infoText}>
              Alterar o saldo inicial irá recalcular todos os saldos e
              projeções. A transação de "Saldo Inicial" será atualizada
              automaticamente.
            </Text>
          </View>

          {/* Saldo Inicial */}
          <View style={styles.section}>
            <Text style={styles.label}>Saldo Inicial</Text>
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
            <View style={styles.dataSeletor}>
              <TouchableOpacity onPress={() => mudarData("anterior")}>
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color={colors.purple[500]}
                />
              </TouchableOpacity>
              <View style={styles.dataDisplay}>
                <Text style={styles.dataTexto}>{dataFormatada}</Text>
              </View>
              <TouchableOpacity onPress={() => mudarData("proximo")}>
                <Ionicons
                  name="chevron-forward"
                  size={32}
                  color={colors.purple[500]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Aviso */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={colors.yellow[700]} />
            <Text style={styles.warningText}>
              Esta alteração afetará todos os cálculos de saldo e panoramas. A
              transação de entrada "Saldo Inicial" será atualizada com os novos
              valores.
            </Text>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
            <Text style={styles.salvarTexto}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}