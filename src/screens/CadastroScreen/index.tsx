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
  deleteTransacao,
  editarOcorrenciaRecorrente,
  excluirOcorrenciaRecorrente,
  getTags,
  getTransacoesPorDataComRecorrencia,
  updateTransacao,
} from "@/services/storage";
import { colors } from "@/theme/colors";
import { Categoria, Recorrencia, Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { categorias, categoriasParaCadastro } from "@/utils/categorias";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type CadastroScreenRouteProp = RouteProp<RootStackParamList, "Cadastro">;

export default function CadastroScreen() {
  const navigation = useNavigation();
  const route = useRoute<CadastroScreenRouteProp>();

  const dataInicial = route.params?.data || formatDate(new Date());
  const categoriaInicial = route.params?.categoria || "entradas";

  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataInicial);
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recorrencia, setRecorrencia] = useState<Recorrencia>("unica");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [transacoesDia, setTransacoesDia] = useState<Transacao[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [transacaoOriginal, setTransacaoOriginal] = useState<Transacao | null>(
    null
  ); // ✅ Guardar transação original
  const [modalRecorrenciaVisible, setModalRecorrenciaVisible] = useState(false);
  const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false); // ✅ Novo modal
  const [transacaoParaExcluir, setTransacaoParaExcluir] =
    useState<Transacao | null>(null);

  useEffect(() => {
    carregarDados();
  }, [data]);

  const carregarDados = async () => {
    const tagsCarregadas = await getTags();
    setTags(tagsCarregadas);

    const transacoes = await getTransacoesPorDataComRecorrencia(data);
    setTransacoesDia(transacoes);
  };

  const recorrencias: Array<{
    key: Recorrencia;
    label: string;
    descricao: string;
  }> = [
    { key: "unica", label: "Única", descricao: "Não se repete" },
    { key: "semanal", label: "Semanal", descricao: "A cada 7 dias" },
    { key: "quinzenal", label: "Quinzenal", descricao: "A cada 14 dias" },
    { key: "cada21dias", label: "Cada 21 dias", descricao: "A cada 21 dias" },
    { key: "cada28dias", label: "Cada 28 dias", descricao: "A cada 28 dias" },
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

  const limparFormulario = () => {
    setValor("");
    setDescricao("");
    setTagSelecionada("");
    setRecorrencia("unica");
    setEditandoId(null);
    setTransacaoOriginal(null);
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      if (editandoId && transacaoOriginal) {
        // ✅ Se é recorrente e está editando, mostrar opções
        if (transacaoOriginal.recorrencia !== "unica") {
          setModalEdicaoVisible(true);
          setLoading(false);
          return;
        }

        // Se não for recorrente, edita normal
        await updateTransacao(editandoId, {
          valor: converterValorParaNumero(valor),
          data,
          categoria,
          tag: tagSelecionada || undefined,
          descricao,
          recorrencia,
        });
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
      }

      limparFormulario();
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Não foi possível salvar a transação");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Editar apenas esta ocorrência
  const handleEditarApenasEsta = async () => {
    if (!editandoId || !transacaoOriginal) return;

    try {
      await editarOcorrenciaRecorrente(editandoId, data, {
        valor: converterValorParaNumero(valor),
        categoria,
        tag: tagSelecionada || undefined,
        descricao,
      });

      setModalEdicaoVisible(false);
      limparFormulario();
      await carregarDados();
    } catch (error) {
      console.error("Erro ao editar ocorrência:", error);
      Alert.alert("Erro", "Não foi possível editar a ocorrência");
    }
  };

  // ✅ Editar todas as ocorrências
  const handleEditarTodas = async () => {
    if (!editandoId) return;

    try {
      await updateTransacao(editandoId, {
        valor: converterValorParaNumero(valor),
        categoria,
        tag: tagSelecionada || undefined,
        descricao,
        recorrencia,
      });

      setModalEdicaoVisible(false);
      limparFormulario();
      await carregarDados();
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      Alert.alert("Erro", "Não foi possível editar a transação");
    }
  };

  const handleEditar = (transacao: Transacao) => {
    setEditandoId(transacao.id);
    setTransacaoOriginal(transacao); // ✅ Guardar original
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
  };

  const handleRemover = (transacao: Transacao) => {
    if (transacao.recorrencia !== "unica") {
      setTransacaoParaExcluir(transacao);
      setModalExclusaoVisible(true);
    } else {
      Alert.alert(
        "Confirmar exclusão",
        "Deseja realmente excluir esta transação?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              await deleteTransacao(transacao.id);
              await carregarDados();
              if (editandoId === transacao.id) {
                limparFormulario();
              }
            },
          },
        ]
      );
    }
  };

  const handleExcluirApenasEsta = async () => {
    if (!transacaoParaExcluir) return;

    try {
      await excluirOcorrenciaRecorrente(transacaoParaExcluir.id, data);
      setModalExclusaoVisible(false);
      setTransacaoParaExcluir(null);
      await carregarDados();

      if (editandoId === transacaoParaExcluir.id) {
        limparFormulario();
      }
    } catch (error) {
      console.error("Erro ao excluir ocorrência:", error);
      Alert.alert("Erro", "Não foi possível excluir a ocorrência");
    }
  };

  const handleExcluirTodas = async () => {
    if (!transacaoParaExcluir) return;

    Alert.alert(
      "Confirmar exclusão total",
      "Isso vai excluir TODAS as ocorrências desta transação recorrente. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir Todas",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransacao(transacaoParaExcluir.id);
              setModalExclusaoVisible(false);
              setTransacaoParaExcluir(null);
              await carregarDados();

              if (editandoId === transacaoParaExcluir.id) {
                limparFormulario();
              }
            } catch (error) {
              console.error("Erro ao excluir transação:", error);
              Alert.alert("Erro", "Não foi possível excluir a transação");
            }
          },
        },
      ]
    );
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
    limparFormulario();
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
            <Text style={styles.label}>Data</Text>
            <View style={styles.dataSeletor}>
              <TouchableOpacity
                onPress={() => mudarData("anterior")}
                style={styles.dataButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <View style={styles.dataDisplay}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
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
                  color={colors.primary}
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
                placeholderTextColor={colors.textTertiary}
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
              placeholderTextColor={colors.textTertiary}
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
                color={colors.textSecondary}
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
                color={colors.textTertiary}
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
                : editandoId
                ? "Atualizar Transação"
                : "Adicionar Transação"}
            </Text>
          </TouchableOpacity>

          {editandoId && (
            <TouchableOpacity
              style={styles.cancelarButton}
              onPress={limparFormulario}
            >
              <Text style={styles.cancelarTexto}>Cancelar Edição</Text>
            </TouchableOpacity>
          )}

          {/* Lista de Transações do Dia */}
          {transacoesDia.length > 0 && (
            <View style={styles.listaSection}>
              <Text style={styles.listaTitulo}>
                Transações do dia ({transacoesDia.length})
              </Text>
              {transacoesDia.map((transacao) => {
                const cat = categorias.find(
                  (c) => c.key === transacao.categoria
                );
                return (
                  <View key={transacao.id} style={styles.transacaoItem}>
                    <View style={styles.transacaoHeader}>
                      <View style={styles.transacaoIconeContainer}>
                        <Ionicons
                          name={cat?.icon || "help-circle"}
                          size={24}
                          color={cat?.color || colors.textSecondary}
                        />
                      </View>
                      <View style={styles.transacaoInfo}>
                        <Text style={styles.transacaoDescricao}>
                          {transacao.descricao}
                        </Text>
                        <View style={styles.transacaoMeta}>
                          <Text style={styles.transacaoCategoria}>
                            {cat?.label}
                          </Text>
                          {transacao.tag && (
                            <>
                              <Text style={styles.transacaoSeparador}>•</Text>
                              <Text style={styles.transacaoTag}>
                                {transacao.tag}
                              </Text>
                            </>
                          )}
                          {transacao.recorrencia !== "unica" && (
                            <>
                              <Text style={styles.transacaoSeparador}>•</Text>
                              <Ionicons
                                name="repeat-outline"
                                size={12}
                                color={colors.textTertiary}
                              />
                            </>
                          )}
                        </View>
                      </View>
                      <Text style={styles.transacaoValor}>
                        {formatarMoeda(transacao.valor)}
                      </Text>
                    </View>
                    <View style={styles.transacaoAcoes}>
                      <TouchableOpacity
                        style={styles.acaoButton}
                        onPress={() => handleEditar(transacao)}
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.acaoTexto}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acaoButton}
                        onPress={() => handleRemover(transacao)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.error}
                        />
                        <Text
                          style={[styles.acaoTexto, { color: colors.error }]}
                        >
                          Excluir
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
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
                <Ionicons name="close" size={24} color={colors.textPrimary} />
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
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ✅ ADICIONAR: Modal de Exclusão de Recorrência */}
      <Modal
        visible={modalExclusaoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalExclusaoVisible(false);
          setTransacaoParaExcluir(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalExclusaoContent}>
            <View style={styles.modalExclusaoHeader}>
              <Ionicons name="alert-circle" size={48} color={colors.warning} />
              <Text style={styles.modalExclusaoTitulo}>
                Excluir transação recorrente
              </Text>
              <Text style={styles.modalExclusaoSubtitulo}>
                Esta é uma transação recorrente. O que deseja fazer?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.opcaoExclusaoButton}
              onPress={handleExcluirApenasEsta}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.opcaoExclusaoTexto}>
                <Text style={styles.opcaoExclusaoTitulo}>
                  Apenas esta ocorrência
                </Text>
                <Text style={styles.opcaoExclusaoDescricao}>
                  Exclui apenas a transação do dia{" "}
                  {parseDate(data).getDate().toString().padStart(2, "0")}/
                  {(parseDate(data).getMonth() + 1).toString().padStart(2, "0")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.opcaoExclusaoButton,
                styles.opcaoExclusaoButtonDanger,
              ]}
              onPress={handleExcluirTodas}
            >
              <Ionicons name="repeat" size={24} color={colors.error} />
              <View style={styles.opcaoExclusaoTexto}>
                <Text
                  style={[styles.opcaoExclusaoTitulo, { color: colors.error }]}
                >
                  Todas as ocorrências
                </Text>
                <Text style={styles.opcaoExclusaoDescricao}>
                  Exclui esta e todas as futuras ocorrências
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelarExclusaoButton}
              onPress={() => {
                setModalExclusaoVisible(false);
                setTransacaoParaExcluir(null);
              }}
            >
              <Text style={styles.cancelarExclusaoTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ NOVO: Modal de Edição de Recorrência */}
      <Modal
        visible={modalEdicaoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalEdicaoVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalExclusaoContent}>
            <View style={styles.modalExclusaoHeader}>
              <Ionicons name="create" size={48} color={colors.primary} />
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
                color={colors.primary}
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
              <Ionicons name="repeat" size={24} color={colors.primary} />
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
              onPress={() => {
                setModalEdicaoVisible(false);
              }}
            >
              <Text style={styles.cancelarExclusaoTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
