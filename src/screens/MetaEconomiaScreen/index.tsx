import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoadingScreen from "@/components/LoadingScreen";
import { getConfig, getTransacoes, updateConfig } from "@/services/storage";
import { colors } from "@/theme/colors";
import { Config, Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MetaEconomia"
>;

export default function MetaEconomiaScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [percentual, setPercentual] = useState(0);
  const [valorReais, setValorReais] = useState("");
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [modalEstimativaVisible, setModalEstimativaVisible] = useState(false);
  const [estimativaInput, setEstimativaInput] = useState("");
  const [percentualInput, setPercentualInput] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const configAtual = await getConfig();
      const transacoes = await getTransacoes();

      setConfig(configAtual);

      const mediaEntradas = calcularMediaMensalEntradas(
        transacoes,
        configAtual.dataInicial
      );

      if (mediaEntradas === 0) {
        setModalEstimativaVisible(true);
      } else {
        setTotalEntradas(mediaEntradas);
        setPercentual(configAtual.percentualEconomia);
        setPercentualInput(configAtual.percentualEconomia.toFixed(1)); // ← NOVO

        const valorCalculado =
          (mediaEntradas * configAtual.percentualEconomia) / 100;
        const valorFormatado = valorCalculado.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setValorReais(valorFormatado);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  function calcularMediaMensalEntradas(
    transacoes: Transacao[],
    dataInicial: string
  ): number {
    const hoje = new Date();
    const dataInicialDate = new Date(dataInicial);

    const diffMeses =
      (hoje.getFullYear() - dataInicialDate.getFullYear()) * 12 +
      (hoje.getMonth() - dataInicialDate.getMonth()) +
      1;

    const entradasTotal = transacoes
      .filter((t) => t.categoria === "entradas")
      .reduce((acc, t) => {
        if (t.recorrencia === "unica") {
          return acc + t.valor;
        } else {
          return acc + t.valor * diffMeses;
        }
      }, 0);

    return diffMeses > 0 ? entradasTotal / diffMeses : 0;
  }

  function handleSliderChange(value: number) {
    const percentualArredondado = Math.round(value * 2) / 2;
    setPercentual(percentualArredondado);
    setPercentualInput(percentualArredondado.toFixed(1)); // ← NOVO

    const valorCalculado = (totalEntradas * percentualArredondado) / 100;
    const valorFormatado = valorCalculado.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValorReais(valorFormatado);
  }

  function handlePercentualInputChange(text: string) {
    // Atualiza o input visual imediatamente
    setPercentualInput(text);

    // Se vazio, zera tudo
    if (text === "" || text === "0" || text === "0,") {
      setPercentual(0);
      setValorReais("0,00");
      return;
    }

    // Tenta converter para número
    const numeroLimpo = text.replace(",", ".");
    const valor = parseFloat(numeroLimpo);

    // Se for número válido, atualiza (limitando a 100)
    if (!isNaN(valor) && valor >= 0) {
      const valorLimitado = Math.min(valor, 100); // ← LIMITA A 100
      setPercentual(valorLimitado);

      const valorCalculado = (totalEntradas * valorLimitado) / 100;
      const valorFormatado = valorCalculado.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setValorReais(valorFormatado);
    }
  }

  function handlePercentualBlur() {
    if (percentualInput === "" || percentual === 0) {
      setPercentualInput("0,0");
      return;
    }

    // Formata com 1 casa decimal
    setPercentualInput(percentual.toFixed(1));
  }

  function handleValorReaisInputChange(text: string) {
    // Remove tudo exceto números
    const numeros = text.replace(/[^0-9]/g, "");

    if (numeros === "") {
      setValorReais("");
      setPercentual(0);
      return;
    }

    // Converte para número (centavos)
    const valorEmCentavos = parseInt(numeros);
    const valor = valorEmCentavos / 100;

    // Formata no padrão brasileiro
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValorReais(valorFormatado);

    // Calcula percentual
    const novoPercentual =
      totalEntradas > 0 ? (valor / totalEntradas) * 100 : 0;
    setPercentual(Math.min(Math.round(novoPercentual * 2) / 2, 100));
  }

  function handleConfirmarEstimativa() {
    // Remove tudo exceto números
    const numeros = estimativaInput.replace(/[^0-9]/g, "");

    if (numeros === "") {
      Alert.alert("Atenção", "Informe um valor válido maior que zero.");
      return;
    }

    // Converte para número (centavos)
    const valorEmCentavos = parseInt(numeros);
    const valor = valorEmCentavos / 100;

    if (valor <= 0) {
      Alert.alert("Atenção", "Informe um valor válido maior que zero.");
      return;
    }

    setTotalEntradas(valor);
    setModalEstimativaVisible(false);
    setPercentual(config?.percentualEconomia || 0);

    const valorCalculado = (valor * (config?.percentualEconomia || 0)) / 100;
    const valorFormatado = valorCalculado.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValorReais(valorFormatado);
  }

  async function handleSalvar() {
    try {
      setLoading(true);

      await updateConfig({
        percentualEconomia: percentual,
      });

      Alert.alert("Sucesso", "Meta de economia salva com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar a meta.");
    } finally {
      setLoading(false);
    }
  }

  // ✨ Converte o valor formatado de volta para número
  function converterValorParaNumero(valorFormatado: string): number {
    if (!valorFormatado) return 0;
    const numeroLimpo = valorFormatado.replace(/\./g, "").replace(",", ".");
    return parseFloat(numeroLimpo) || 0;
  }

  if (loading || !config) {
    return <LoadingScreen />;
  }

  const valorEconomizado = converterValorParaNumero(valorReais);

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

        <Text style={styles.headerTitle}>Meta de Economia</Text>

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
          {/* Total de Entradas */}
          <View style={styles.entradasCard}>
            <View style={styles.entradasIconContainer}>
              <Ionicons
                name="trending-up"
                size={28}
                color={colors.green[700]}
              />
            </View>
            <View style={styles.entradasContent}>
              <Text style={styles.entradasLabel}>Média Mensal de Entradas</Text>
              <Text style={styles.entradasValor}>
                R${" "}
                {totalEntradas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>

          {/* Título da Seção */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🎯 Quanto você quer economizar?
            </Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={0.5}
              value={percentual}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={colors.purple[500]}
              maximumTrackTintColor={colors.gray[300]}
              thumbTintColor={colors.purple[500]}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0%</Text>
              <Text style={styles.sliderLabelCenter}>
                {percentual.toFixed(1)}%
              </Text>
              <Text style={styles.sliderLabel}>100%</Text>
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Percentual</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={percentualInput}
                  onChangeText={handlePercentualInputChange}
                  onBlur={handlePercentualBlur} // ← NOVO
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.gray[400]}
                  placeholder="0,0"
                />
                <Text style={styles.inputSuffix}>%</Text>
              </View>
            </View>

            <Text style={styles.inputSeparator}>ou</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Valor em R$</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputPrefix}>R$</Text>
                <TextInput
                  style={styles.input}
                  value={valorReais}
                  onChangeText={handleValorReaisInputChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>
          </View>

          {/* Resumo */}
          <View style={styles.resumo}>
            <Ionicons name="wallet" size={24} color={colors.purple[500]} />
            <View style={styles.resumoContent}>
              <Text style={styles.resumoLabel}>Você pretende economizar:</Text>
              <Text style={styles.resumoValor}>
                R${" "}
                {valorEconomizado.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                por mês
              </Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.purple[500]}
            />
            <Text style={styles.infoText}>
              Esta meta será usada na tela de Totais para acompanhar seu
              progresso mensal de economia.
            </Text>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
            <Text style={styles.salvarTexto}>Salvar Meta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Estimativa */}
      <Modal
        visible={modalEstimativaVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons
                name="help-circle"
                size={32}
                color={colors.purple[500]}
              />
              <Text style={styles.modalTitulo}>Estimativa de Entradas</Text>
            </View>

            <Text style={styles.modalDescricao}>
              Você ainda não possui entradas cadastradas. Para definir sua meta
              de economia, informe uma estimativa de quanto você espera receber
              por mês:
            </Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Estimativa Mensal</Text>
              <View style={styles.valorContainer}>
                <Text style={styles.cifrao}>R$</Text>
                <TextInput
                  style={styles.valorInput}
                  value={estimativaInput}
                  onChangeText={(text) => {
                    // Remove tudo exceto números
                    const numeros = text.replace(/[^0-9]/g, "");

                    if (numeros === "") {
                      setEstimativaInput("");
                      return;
                    }

                    // Converte para número (centavos)
                    const valorEmCentavos = parseInt(numeros);
                    const valor = valorEmCentavos / 100;

                    // Formata no padrão brasileiro
                    const valorFormatado = valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });

                    setEstimativaInput(valorFormatado);
                  }}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={colors.gray[400]}
                  autoFocus
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleConfirmarEstimativa}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
