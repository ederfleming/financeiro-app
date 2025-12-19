import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
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

import {
  addTransacao,
  editarOcorrenciaRecorrente,
  getTags,
  getTransacoes,
  updateTransacao,
} from "@/services/storage";
import { colors } from "@/theme/colors";
import { Categoria, Recorrencia, Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { categoriasParaCadastro } from "@/utils/categorias";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type CadastroScreenRouteProp = RouteProp<RootStackParamList, "Cadastro">;

export default function CadastroScreen() {
  const navigation = useNavigation();
  const route = useRoute<CadastroScreenRouteProp>();

  const dataInicial = route.params?.data || formatDate(new Date());
  const categoriaInicial = route.params?.categoria || "entradas";
  const transacaoId = route.params?.transacaoId; // ID da transação para editar

  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataInicial);
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recorrencia, setRecorrencia] = useState<Recorrencia>("unica");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [transacaoOriginal, setTransacaoOriginal] = useState<Transacao | null>(
    null
  );
  const [modalRecorrenciaVisible, setModalRecorrenciaVisible] = useState(false);
  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const tagsCarregadas = await getTags();
    setTags(tagsCarregadas);

    // Se tem transacaoId, é uma edição - carregar os dados
    if (transacaoId) {
      const todasTransacoes = await getTransacoes();
      const transacao = todasTransacoes.find((t) => t.id === transacaoId);

      if (transacao) {
        setTransacaoOriginal(transacao);
        setValor(
          transacao.valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
        setCategoria(transacao.categoria);
        setTagSelecionada(transacao.tag || "");
        setDescricao(transacao.descricao);
        setRecorrencia(transacao.recorrencia);
      }
    }
  };

  const recorrencias: Array<{
    key: Recorrencia;
    label: string;
    descricao: string;
  }> = [
    { key: "unica", label: "Única", descricao: "Não se repete" },
    { key: "semanal", label: "Semanal", descricao: "A cada 7 dias" },
    { key: "quinzenal", label: "Quinzenal", descricao: "A cada 14 dias" },
    { key: "cada21dias", label: "Cada 21 dias", descricao: "A cada 3 semanas" },
    { key: "cada28dias", label: "Cada 28 dias", descricao: "A cada 4 semanas" },
    { key: "mensal", label: "Mensal", descricao: "Todo mês no mesmo dia" },
  ];

  const formatarValorInput = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9]/g, "");

    if (!apenasNumeros) {
      setValor("");
      return;
    }

    const numero = parseInt(apenasNumeros) / 100;
    const formatado = numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValor(formatado);
  };

  const converterValorParaNumero = (valorFormatado: string): number => {
    if (!valorFormatado) return 0;
    const numeroLimpo = valorFormatado.replace(/\./g, "").replace(",", ".");
    return parseFloat(numeroLimpo);
  };

  const validarFormulario = (): boolean => {
    if (!valor || converterValorParaNumero(valor) === 0) {
      Alert.alert("Erro", "Digite um valor válido");
      return false;
    }

    if (!data) {
      Alert.alert("Erro", "Selecione uma data");
      return false;
    }

    if (!descricao.trim()) {
      Alert.alert("Erro", "Digite uma descrição");
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      if (transacaoId && transacaoOriginal) {
        // Está editando
        if (transacaoOriginal.recorrencia !== "unica") {
          // É recorrente, mostrar opções
          setModalEdicaoVisible(true);
          setLoading(false);
          return;
        }

        // Não é recorrente, edita normal
        await updateTransacao(transacaoId, {
          valor: converterValorParaNumero(valor),
          data,
          categoria,
          tag: tagSelecionada || undefined,
          descricao,
          recorrencia,
        });

        Alert.alert("Sucesso", "Transação atualizada!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // Nova transação
        const novaTransacao: Transacao = {
          id: Date.now().toString(),
          valor: converterValorParaNumero(valor),
          data,
          categoria,
          tag: tagSelecionada || undefined,
          descricao,
          recorrencia,
        };

        await addTransacao(novaTransacao);

        Alert.alert("Sucesso", "Transação cadastrada!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Não foi possível salvar a transação");
    } finally {
      setLoading(false);
    }
  };

  const handleEditarApenasEsta = async () => {
    if (!transacaoId || !transacaoOriginal) return;

    try {
      await editarOcorrenciaRecorrente(transacaoId, data, {
        valor: converterValorParaNumero(valor),
        categoria,
        tag: tagSelecionada || undefined,
        descricao,
      });

      setModalEdicaoVisible(false);
      Alert.alert("Sucesso", "Ocorrência atualizada!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao editar ocorrência:", error);
      Alert.alert("Erro", "Não foi possível editar a ocorrência");
    }
  };

  const handleEditarTodas = async () => {
    if (!transacaoId) return;

    try {
      await updateTransacao(transacaoId, {
        valor: converterValorParaNumero(valor),
        categoria,
        tag: tagSelecionada || undefined,
        descricao,
        recorrencia,
      });

      setModalEdicaoVisible(false);
      Alert.alert("Sucesso", "Todas as ocorrências atualizadas!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      Alert.alert("Erro", "Não foi possível editar a transação");
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const mudarData = (direcao: "anterior" | "proximo") => {
    const dataAtual = parseDate(data);
    const novaData = new Date(dataAtual);

    if (direcao === "anterior") {
      novaData.setDate(novaData.getDate() - 1);
    } else {
      novaData.setDate(novaData.getDate() + 1);
    }

    setData(formatDate(novaData));
  };

  const dataObj = parseDate(data);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  const recorrenciaSelecionada = recorrencias.find(
    (r) => r.key === recorrencia
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Data</Text>

        <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>
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
          {/* Seletor de Data */}
          <View style={styles.section}>
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

          {/* Input de Valor */}
          <View style={styles.section}>
            <Text style={styles.label}>Valor</Text>
            <View style={styles.valorContainer}>
              <Text style={styles.cifrao}>R$</Text>
              <TextInput
                style={styles.valorInput}
                value={valor}
                onChangeText={formatarValorInput}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          {/* Seletor de Categoria */}
          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriasContainer}
            >
              {categoriasParaCadastro.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoriaButton,
                    categoria === cat.key && {
                      backgroundColor: cat.color,
                      borderColor: cat.color,
                    },
                  ]}
                  onPress={() => setCategoria(cat.key)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={24}
                    color={categoria === cat.key ? colors.white : cat.color}
                  />
                  <Text
                    style={[
                      styles.categoriaTexto,
                      categoria === cat.key && styles.categoriaTextoActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input de Descrição */}
          <View style={styles.section}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.descricaoInput}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Compras no mercado"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          {/* Seletor de Recorrência */}
          <View style={styles.section}>
            <Text style={styles.label}>Recorrência</Text>
            <TouchableOpacity
              style={styles.recorrenciaButton}
              onPress={() => setModalRecorrenciaVisible(true)}
            >
              <Ionicons
                name="repeat-outline"
                size={20}
                color={colors.gray[600]}
              />
              <View style={styles.recorrenciaTextoContainer}>
                <Text style={styles.recorrenciaLabel}>
                  {recorrenciaSelecionada?.label}
                </Text>
                <Text style={styles.recorrenciaDescricao}>
                  {recorrenciaSelecionada?.descricao}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
          </View>

          {/* Seletor de Tag (Opcional) */}
          <View style={styles.section}>
            <Text style={styles.label}>Tag (opcional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              <TouchableOpacity
                style={[
                  styles.tagButton,
                  !tagSelecionada && styles.tagButtonActive,
                ]}
                onPress={() => setTagSelecionada("")}
              >
                <Text
                  style={[
                    styles.tagTexto,
                    !tagSelecionada && styles.tagTextoActive,
                  ]}
                >
                  Nenhuma
                </Text>
              </TouchableOpacity>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    tagSelecionada === tag && styles.tagButtonActive,
                  ]}
                  onPress={() => setTagSelecionada(tag)}
                >
                  <Text
                    style={[
                      styles.tagTexto,
                      tagSelecionada === tag && styles.tagTextoActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[
              styles.salvarButton,
              loading && styles.salvarButtonDisabled,
            ]}
            onPress={handleSalvar}
            disabled={loading}
          >
            <Text style={styles.salvarTexto}>
              {loading
                ? "Salvando..."
                : transacaoId
                ? "Atualizar Transação"
                : "Adicionar Transação"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de Recorrência */}
      <Modal
        visible={modalRecorrenciaVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalRecorrenciaVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalRecorrenciaVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecione a Recorrência</Text>
              <TouchableOpacity
                onPress={() => setModalRecorrenciaVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.gray[800]} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {recorrencias.map((rec) => (
                <TouchableOpacity
                  key={rec.key}
                  style={[
                    styles.recorrenciaOption,
                    recorrencia === rec.key && styles.recorrenciaOptionActive,
                  ]}
                  onPress={() => {
                    setRecorrencia(rec.key);
                    setModalRecorrenciaVisible(false);
                  }}
                >
                  <View>
                    <Text style={styles.recorrenciaOptionLabel}>
                      {rec.label}
                    </Text>
                    <Text style={styles.recorrenciaOptionDescricao}>
                      {rec.descricao}
                    </Text>
                  </View>
                  {recorrencia === rec.key && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.purple[500]}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Edição de Recorrência */}
      <Modal
        visible={modalEdicaoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEdicaoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalExclusaoContent}>
            <View style={styles.modalExclusaoHeader}>
              <Ionicons name="create" size={48} color={colors.purple[500]} />
              <Text style={styles.modalExclusaoTitulo}>
                Editar transação recorrente
              </Text>
              <Text style={styles.modalExclusaoSubtitulo}>
                Esta é uma transação recorrente. O que deseja editar?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.opcaoExclusaoButton}
              onPress={handleEditarApenasEsta}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.purple[500]}
              />
              <View style={styles.opcaoExclusaoTexto}>
                <Text style={styles.opcaoExclusaoTitulo}>
                  Apenas esta ocorrência
                </Text>
                <Text style={styles.opcaoExclusaoDescricao}>
                  Edita apenas a transação do dia{" "}
                  {dataObj.getDate().toString().padStart(2, "0")}/
                  {(dataObj.getMonth() + 1).toString().padStart(2, "0")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.opcaoExclusaoButton}
              onPress={handleEditarTodas}
            >
              <Ionicons name="repeat" size={24} color={colors.purple[500]} />
              <View style={styles.opcaoExclusaoTexto}>
                <Text style={styles.opcaoExclusaoTitulo}>
                  Todas as ocorrências
                </Text>
                <Text style={styles.opcaoExclusaoDescricao}>
                  Edita esta e todas as futuras ocorrências
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelarExclusaoButton}
              onPress={() => setModalEdicaoVisible(false)}
            >
              <Text style={styles.cancelarExclusaoTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
