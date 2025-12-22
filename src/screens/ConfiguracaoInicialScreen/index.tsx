import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
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

import Button from "@/components/Button"; // ✨ Novo componente
import GastoVariavelCard from "@/components/GastoVariavelCard";
import { getConfig, setConfig } from "@/services/storage";
import { colors } from "@/theme/colors";
import { GastoVariavel } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConfiguracaoInicialScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Estados do Step 1
  const [saldoInicial, setSaldoInicial] = useState("");
  const [dataInicial, setDataInicial] = useState(formatDate(new Date()));

  // Estados do Step 2
  const [gastosVariaveis, setGastosVariaveis] = useState<GastoVariavel[]>([]);
  const [diasParaDivisao, setDiasParaDivisao] = useState<28 | 30 | 31>(30);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);

  // ✨ Novos campos do Gasto
  const [novoGastoTitulo, setNovoGastoTitulo] = useState("");
  const [novoGastoDescricao, setNovoGastoDescricao] = useState("");
  const [novoGastoValor, setNovoGastoValor] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ========== UTILS & FORMATADORES ==========
  const formatarValorInput = (texto: string, setter: (v: string) => void) => {
    const apenasNumeros = texto.replace(/[^0-9]/g, "");
    if (!apenasNumeros) {
      setter("");
      return;
    }
    const numero = parseInt(apenasNumeros) / 100;
    const formatado = numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setter(formatado);
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

  // ========== FUNÇÕES DO STEP 2 ==========
  const adicionarGasto = () => {
    if (!novoGastoDescricao.trim()) {
      Alert.alert("Erro", "Digite a descrição do gasto");
      return;
    }
    if (!novoGastoValor) {
      Alert.alert("Erro", "Digite o valor do gasto");
      return;
    }

    const novoGasto: GastoVariavel = {
      id: Date.now().toString(),
      titulo: novoGastoTitulo.trim(),
      descricao: novoGastoDescricao.trim(),
      valor: converterValorParaNumero(novoGastoValor),
    };

    setGastosVariaveis([...gastosVariaveis, novoGasto]);
    setNovoGastoTitulo("");
    setNovoGastoDescricao("");
    setNovoGastoValor("");
    setModalGastoVisible(false);
  };

  const removerGasto = (id: string) => {
    Alert.alert("Remover gasto", "Deseja remover este gasto variável?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setGastosVariaveis(gastosVariaveis.filter((g) => g.id !== id));
        },
      },
    ]);
  };

  const calcularTotalGastos = (): number => {
    return gastosVariaveis.reduce((acc, gasto) => acc + gasto.valor, 0);
  };

  const calcularGastoDiario = (): number => {
    const total = calcularTotalGastos();
    return total / diasParaDivisao;
  };

  const handleFinalizar = async () => {
    try {
      setLoading(true);

      const config = await getConfig();
      const gastoDiario = calcularGastoDiario();

      await setConfig({
        ...config,
        saldoInicial: converterValorParaNumero(saldoInicial),
        dataInicial,
        gastosVariaveis,
        diasParaDivisao,
        gastoDiarioPadrao: gastoDiario,
        onboardingCompleto: true,
      });

      Alert.alert(
        "Sucesso",
        `Configuração salva com sucesso!\n\nGasto diário recomendado: ${formatarMoeda(
          gastoDiario
        )}`,
        [
          {
            text: "OK",
            onPress: () => navigation.replace("MainTabs"),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      Alert.alert("Erro", "Não foi possível salvar a configuração");
    } finally {
      setLoading(false);
    }
  };

  const fecharEResetarModal = () => {
    setNovoGastoTitulo("");
    setNovoGastoDescricao("");
    setNovoGastoValor("");
    setModalGastoVisible(false);
  };

  // ========== FORMATAÇÃO DE UI ==========
  const dataObj = parseDate(dataInicial);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  const totalGastos = calcularTotalGastos();
  const gastoDiario = calcularGastoDiario();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: step === 1 ? "50%" : "100%" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Etapa {step} de 2</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <View>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="wallet"
                    size={60}
                    color={colors.purple[500]}
                  />
                </View>
                <Text style={styles.title}>Saldo Inicial</Text>
                <Text style={styles.subtitle}>
                  Quanto você tem disponível hoje?
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.section}>
                  <Text style={styles.label}>Saldo Inicial</Text>
                  <View style={styles.valorContainer}>
                    <Text style={styles.cifrao}>R$</Text>
                    <TextInput
                      style={styles.valorInput}
                      value={saldoInicial}
                      onChangeText={(t) =>
                        formatarValorInput(t, setSaldoInicial)
                      }
                      keyboardType="numeric"
                      placeholder="0,00"
                    />
                  </View>
                </View>

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
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="calculator"
                    size={60}
                    color={colors.purple[500]}
                  />
                </View>
                <Text style={styles.title}>Gastos Variáveis</Text>
                <Text style={styles.subtitle}>
                  Cadastre seus gastos mensais fixos
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.section}>
                  <Text style={styles.label}>
                    Dividir gastos por quantos dias?
                  </Text>
                  <View style={styles.diasSeletor}>
                    {[28, 30, 31].map((dias) => (
                      <TouchableOpacity
                        key={dias}
                        style={[
                          styles.diaButton,
                          diasParaDivisao === dias && styles.diaButtonActive,
                        ]}
                        onPress={() => setDiasParaDivisao(dias as 28 | 30 | 31)}
                      >
                        <Text
                          style={[
                            styles.diaButtonText,
                            diasParaDivisao === dias &&
                              styles.diaButtonTextActive,
                          ]}
                        >
                          {dias} dias
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <View style={styles.listHeader}>
                    <Text style={styles.label}>Seus gastos</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setModalGastoVisible(true)}
                    >
                      <Ionicons name="add" size={20} color={colors.white} />
                      <Text style={styles.addButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>

                  {gastosVariaveis.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="wallet-outline"
                        size={48}
                        color={colors.gray[300]}
                      />
                      <Text style={styles.emptyText}>
                        Nenhum gasto cadastrado
                      </Text>
                      <Text style={styles.emptySubtext}>
                        Adicione seus gastos mensais fixos
                      </Text>
                    </View>
                  ) : (
                    <>
                      {gastosVariaveis.map((gasto) => (
                        <GastoVariavelCard
                          key={gasto.id}
                          gasto={gasto}
                          onDelete={removerGasto}
                        />
                      ))}

                      {/* Resumo */}
                      <View style={styles.resumo}>
                        <View style={styles.resumoLinha}>
                          <Text style={styles.resumoLabel}>Total mensal:</Text>
                          <Text style={styles.resumoValor}>
                            {formatarMoeda(totalGastos)}
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.resumoLinha}>
                          <Text style={styles.resumoLabelDestaque}>
                            Gasto diário recomendado:
                          </Text>
                          <Text style={styles.resumoValorDestaque}>
                            {formatarMoeda(gastoDiario)}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer com o novo Componente Button ✨ */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.gray[100],
          }}
        >
          {step === 2 && (
            <Button
              title="Voltar"
              variant="outlined"
              onPress={() => setStep(1)}
              startIcon="arrow-back"
            />
          )}
          <Button
            title={step === 1 ? "Próximo" : "Finalizar"}
            onPress={
              step === 1
                ? () =>
                    saldoInicial
                      ? setStep(2)
                      : Alert.alert("Erro", "Informe o saldo")
                : handleFinalizar
            }
            loading={loading}
            endIcon={step === 1 ? "arrow-forward" : "checkmark-done"}
          />
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={modalGastoVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharEResetarModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={fecharEResetarModal}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>Novo Gasto Variável</Text>
                <TouchableOpacity onPress={fecharEResetarModal}>
                  <Ionicons name="close" size={24} color={colors.gray[800]} />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalBody}>
                  <Text style={styles.label}>Título (Obrigatório)</Text>
                  <TextInput
                    style={styles.input}
                    value={novoGastoTitulo}
                    onChangeText={setNovoGastoTitulo}
                    placeholder="Ex: Aluguel"
                    placeholderTextColor={colors.gray[400]}
                  />

                  <Text style={[styles.label, { marginTop: 16 }]}>
                    Descrição (Opcional)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={novoGastoDescricao}
                    onChangeText={setNovoGastoDescricao}
                    placeholder="Ex: Vence todo dia 10"
                    placeholderTextColor={colors.gray[400]}
                  />

                  <Text style={[styles.label, { marginTop: 16 }]}>
                    Valor Mensal
                  </Text>
                  <View style={styles.valorContainer}>
                    <Text style={styles.cifrao}>R$</Text>
                    <TextInput
                      style={styles.valorInput}
                      value={novoGastoValor}
                      onChangeText={(t) =>
                        formatarValorInput(t, setNovoGastoValor)
                      }
                      keyboardType="numeric"
                      placeholder="0,00"
                      placeholderTextColor={colors.gray[400]}
                    />
                  </View>

                  <View
                    style={{
                      marginTop: 24,
                      paddingBottom: Platform.OS === "ios" ? 20 : 0,
                    }}
                  >
                    <Button
                      title="Adicionar Gasto"
                      onPress={adicionarGasto}
                      startIcon="add"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
