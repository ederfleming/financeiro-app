import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  deleteTransacao,
  excluirOcorrenciaRecorrente,
  getTransacoesPorDataComRecorrencia,
} from "@/services/storage";
import { colors } from "@/theme/colors";
import { Categoria, Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { categorias } from "@/utils/categorias";
import { parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type DetalhesScreenRouteProp = RouteProp<RootStackParamList, "Detalhes">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetalhesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetalhesScreenRouteProp>();

  const { data } = route.params;

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas" > ("todas");
  const [loading, setLoading] = useState(true);
  const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] =
    useState<Transacao | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [data])
  );

  const carregarDados = async () => {
    try {
      setLoading(true);
      const transacoesCarregadas = await getTransacoesPorDataComRecorrencia(
        data
      );
      setTransacoes(transacoesCarregadas);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const transacoesFiltradas =
    filtroCategoria === "todas"
      ? transacoes
      : transacoes.filter((t) => t.categoria === filtroCategoria);

  const handleEditar = (transacao: Transacao) => {
    navigation.navigate("Cadastro", {
      data,
      categoria: transacao.categoria,
      transacaoId: transacao.id,
    });
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
            } catch (error) {
              console.error("Erro ao excluir transação:", error);
              Alert.alert("Erro", "Não foi possível excluir a transação");
            }
          },
        },
      ]
    );
  };

  const handleNovaTransacao = () => {
    navigation.navigate("Cadastro", {
      data,
      categoria: filtroCategoria === "todas" ? "entradas" : filtroCategoria,
    });
  };

  const dataObj = parseDate(data);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  const renderTransacao = ({ item }: { item: Transacao }) => {
    const cat = categorias.find((c) => c.key === item.categoria);

    return (
      <View style={styles.transacaoItem}>
        <View style={styles.transacaoHeader}>
          <View
            style={[
              styles.transacaoIconeContainer,
              { backgroundColor: cat?.color + "20" },
            ]}
          >
            <Ionicons
              name={cat?.icon || "help-circle"}
              size={24}
              color={cat?.color || colors.gray[600]}
            />
          </View>
          <View style={styles.transacaoInfo}>
            <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
            <View style={styles.transacaoMeta}>
              <Text style={styles.transacaoCategoria}>{cat?.label}</Text>
              {item.tag && (
                <>
                  <Text style={styles.transacaoSeparador}>•</Text>
                  <Text style={styles.transacaoTag}>{item.tag}</Text>
                </>
              )}
              {item.recorrencia !== "unica" && (
                <>
                  <Text style={styles.transacaoSeparador}>•</Text>
                  <Ionicons
                    name="repeat-outline"
                    size={12}
                    color={colors.gray[400]}
                  />
                </>
              )}
            </View>
          </View>
          <Text style={styles.transacaoValor}>{formatarMoeda(item.valor)}</Text>
        </View>
        <View style={styles.transacaoAcoes}>
          <TouchableOpacity
            style={styles.acaoButton}
            onPress={() => handleEditar(item)}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.purple[500]}
            />
            <Text style={styles.acaoTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acaoButton}
            onPress={() => handleRemover(item)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.red[500]} />
            <Text style={[styles.acaoTexto, { color: colors.red[500] }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="document-text-outline"
        size={64}
        color={colors.gray[400]}
      />
      <Text style={styles.emptyTitle}>Nenhuma transação</Text>
      <Text style={styles.emptySubtitle}>
        {filtroCategoria === "todas"
          ? "Não há transações cadastradas para este dia."
          : `Não há transações de ${
              categorias.find((c) => c.key === filtroCategoria)?.label
            } para este dia.`}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleNovaTransacao}
      >
        <Ionicons name="add" size={20} color={colors.white} />
        <Text style={styles.emptyButtonText}>Adicionar Transação</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{dataFormatada}</Text>

        <TouchableOpacity
          onPress={handleNovaTransacao}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosContent}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filtroButton,
              filtroCategoria === cat.key && { backgroundColor: cat.color },
            ]}
            onPress={() => setFiltroCategoria(cat.key)}
          >
            <Ionicons
              name={cat.icon}
              size={20}
              color={filtroCategoria === cat.key ? colors.white : cat.color}
            />
            <Text
              style={[
                styles.filtroTexto,
                filtroCategoria === cat.key && styles.filtroTextoActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de transações */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple[500]} />
        </View>
      ) : (
        <FlatList
          data={transacoesFiltradas}
          renderItem={renderTransacao}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Exclusão */}
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
              <Ionicons
                name="alert-circle"
                size={48}
                color={colors.yellow[500]}
              />
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
                color={colors.purple[500]}
              />
              <View style={styles.opcaoExclusaoTexto}>
                <Text style={styles.opcaoExclusaoTitulo}>
                  Apenas esta ocorrência
                </Text>
                <Text style={styles.opcaoExclusaoDescricao}>
                  Exclui apenas a transação do dia{" "}
                  {dataObj.getDate().toString().padStart(2, "0")}/
                  {(dataObj.getMonth() + 1).toString().padStart(2, "0")}
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
              <Ionicons name="repeat" size={24} color={colors.red[500]} />
              <View style={styles.opcaoExclusaoTexto}>
                <Text
                  style={[
                    styles.opcaoExclusaoTitulo,
                    { color: colors.red[500] },
                  ]}
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
    </SafeAreaView>
  );
}
