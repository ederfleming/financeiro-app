import { Ionicons } from "@expo/vector-icons";
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

import GastoVariavelCard from "@/components/GastoVariavelCard";
import LoadingScreen from "@/components/LoadingScreen";
import { getConfig, updateConfig } from "@/services/storage";
import { colors } from "@/theme/colors";
import { Config, GastoVariavel } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PrevisaoGastoDiario"
>;

export default function PrevisaoGastoDiarioScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [gastosVariaveis, setGastosVariaveis] = useState<GastoVariavel[]>([]);
  const [diasParaDivisao, setDiasParaDivisao] = useState<28 | 30 | 31>(30);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados do modal
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoDescricao, setNovoDescricao] = useState("");
  const [novoValor, setNovoValor] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const configAtual = await getConfig();
      setConfig(configAtual);
      setGastosVariaveis(configAtual.gastosVariaveis);
      setDiasParaDivisao(configAtual.diasParaDivisao);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      Alert.alert("Erro", "Não foi possível carregar as configurações.");
    } finally {
      setLoading(false);
    }
  }

  function calcularGastoDiario(): number {
    const total = gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);
    return total / diasParaDivisao;
  }

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

  function handleAdicionarGasto() {
    if (!novoTitulo.trim()) {
      Alert.alert("Atenção", "Informe o título do gasto.");
      return;
    }

    const valor = converterValorParaNumero(novoValor);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert("Atenção", "Informe um valor válido maior que zero.");
      return;
    }

    const novoGasto: GastoVariavel = {
      id: Date.now().toString(),
      titulo: novoTitulo,
      descricao: novoDescricao,
      valor,
    };

    setGastosVariaveis([...gastosVariaveis, novoGasto]);

    // Limpar campos
    setNovoTitulo("");
    setNovoDescricao("");
    setNovoValor("");
    setModalVisible(false);
  }

  function handleRemoverGasto(id: string) {
    Alert.alert("Confirmar exclusão", "Deseja remover este gasto variável?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setGastosVariaveis(gastosVariaveis.filter((g) => g.id !== id));
        },
      },
    ]);
  }

  async function handleSalvar() {
    if (gastosVariaveis.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um gasto variável.");
      return;
    }

    try {
      setLoading(true);

      const novoGastoDiario = calcularGastoDiario();

      await updateConfig({
        gastosVariaveis,
        diasParaDivisao,
        gastoDiarioPadrao: novoGastoDiario,
      });

      Alert.alert(
        "Sucesso",
        "Previsão de gasto diário atualizada com sucesso!",
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

  const gastoDiarioCalculado = calcularGastoDiario();
  const totalGastos = gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);

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

        <Text style={styles.headerTitle}>Previsão de Gasto Diário</Text>

        <View
          style={styles.headerButton}
        >
      
        </View>
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
              Este valor será usado como estimativa nos dias sem gasto real.
              Dias passados sem gasto permanecerão zerados.
            </Text>
          </View>

          {/* Divisor de dias */}
          <View style={styles.section}>
            <Text style={styles.label}>Dividir gastos por:</Text>
            <View style={styles.diasButtonContainer}>
              {([28, 30, 31] as const).map((dias) => (
                <TouchableOpacity
                  key={dias}
                  style={[
                    styles.diasButton,
                    diasParaDivisao === dias && styles.diasButtonActive,
                  ]}
                  onPress={() => setDiasParaDivisao(dias)}
                >
                  <Text
                    style={[
                      styles.diasButtonText,
                      diasParaDivisao === dias && styles.diasButtonTextActive,
                    ]}
                  >
                    {dias} dias
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lista de gastos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Gastos Variáveis</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {gastosVariaveis.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="cart-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyStateText}>
                  Nenhum gasto variável cadastrado
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Adicione gastos mensais como aluguel, condomínio, etc.
                </Text>
              </View>
            ) : (
              gastosVariaveis.map((gasto) => (
                <GastoVariavelCard
                  key={gasto.id}
                  gasto={gasto}
                  onDelete={handleRemoverGasto}
                />
              ))
            )}
          </View>

          {/* Resumo */}
          {gastosVariaveis.length > 0 && (
            <View style={styles.resumo}>
              <View style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>Total mensal:</Text>
                <Text style={styles.resumoValue}>
                  R$ {totalGastos.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>Divisão por:</Text>
                <Text style={styles.resumoValue}>{diasParaDivisao} dias</Text>
              </View>
              <View style={[styles.resumoRow, styles.resumoRowDestaque]}>
                <Text style={styles.resumoLabelDestaque}>Gasto diário:</Text>
                <Text style={styles.resumoValueDestaque}>
                  R$ {gastoDiarioCalculado.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[
              styles.salvarButton,
              gastosVariaveis.length === 0 && styles.salvarButtonDisabled,
            ]}
            onPress={handleSalvar}
            disabled={gastosVariaveis.length === 0}
          >
            <Text style={styles.salvarTexto}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de adicionar gasto */}
      {/* <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Novo Gasto Variável</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.gray[800]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Título *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Aluguel"
                value={novoTitulo}
                onChangeText={setNovoTitulo}
                placeholderTextColor={colors.gray[400]}
              />

              <Text style={styles.modalLabel}>Descrição (opcional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Apartamento Centro"
                value={novoDescricao}
                onChangeText={setNovoDescricao}
                placeholderTextColor={colors.gray[400]}
              />

              <Text style={styles.modalLabel}>Valor *</Text>
              <View style={styles.valorContainer}>
                <Text style={styles.cifrao}>R$</Text>
                <TextInput
                  style={styles.valorInput}
                  placeholder="0,00"
                  value={novoValor}
                  onChangeText={formatarValorInput}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setModalVisible(false);
                  setNovoTitulo("");
                  setNovoDescricao("");
                  setNovoValor("");
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAdicionarGasto}
              >
                <Text style={styles.modalButtonTextPrimary}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal> */}
      {/* Modal de adicionar gasto reaproveitavel */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>Novo Gasto Variável</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.gray[800]} />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.modalBody}>
                  <Text style={styles.label}>Título (Obrigatório)</Text>
                  <TextInput
                    style={styles.input}
                    value={novoTitulo}
                    onChangeText={setNovoTitulo}
                    placeholder="Ex: Aluguel"
                    placeholderTextColor={colors.gray[400]}
                  />

                  <Text style={[styles.label, { marginTop: 16 }]}>
                    Descrição (Opcional)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={novoDescricao}
                    onChangeText={setNovoDescricao}
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
                      value={novoValor}
                      onChangeText={(t) => formatarValorInput(t, setNovoValor)}
                      keyboardType="numeric"
                      placeholder="0,00"
                      placeholderTextColor={colors.gray[400]}
                    />
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSecondary]}
                      onPress={() => {
                        setModalVisible(false);
                        setNovoTitulo("");
                        setNovoDescricao("");
                        setNovoValor("");
                      }}
                    >
                      <Text style={styles.modalButtonTextSecondary}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonPrimary]}
                      onPress={handleAdicionarGasto}
                    >
                      <Text style={styles.modalButtonTextPrimary}>
                        Adicionar
                      </Text>
                    </TouchableOpacity>
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
