import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTransacoesData } from "@/hooks/useTransacoesData";
import { colors } from "@/theme/colors";
import { Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { categorias } from "@/utils/categorias";
import { parseDate } from "@/utils/dateUtils";

// Componentes
import FiltrosCategorias from "@/components/FiltrosCategorias";
import LoadingScreen from "@/components/LoadingScreen";
import ModalExclusaoRecorrente from "@/components/ModalExclusaoRecorrente";
import TransacaoCard from "@/components/TransacaoCard";

import EmptyState from "@/components/EmptyState";
import { styles } from "./styles";

type DetalhesScreenRouteProp = RouteProp<RootStackParamList, "Detalhes">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetalhesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetalhesScreenRouteProp>();

  const { data } = route.params;

  const {
    transacoesFiltradas,
    filtroCategoria,
    loading,
    modalExclusaoVisible,
    transacaoParaExcluir,
    setFiltroCategoria,
    setModalExclusaoVisible,
    setTransacaoParaExcluir,
    iniciarExclusao,
    excluirApenasEsta,
    excluirTodas,
  } = useTransacoesData({ data });

  const handleEditar = (transacao: Transacao) => {
    navigation.navigate("Cadastro", {
      data,
      categoria: transacao.categoria,
      transacaoId: transacao.id,
    });
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

  const dataFormatadaCurta = `${dataObj
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dataObj.getMonth() + 1).toString().padStart(2, "0")}`;

  const renderTransacao = ({ item }: { item: Transacao }) => (
    <TransacaoCard
      transacao={item}
      onEdit={handleEditar}
      onDelete={iniciarExclusao}
    />
  );

  const EmptyComponent = () => (
    <EmptyState
      icon="document-text-outline"
      title="Nenhuma transação"
      subtitle={
        filtroCategoria === "todas"
          ? "Não há transações cadastradas para este dia."
          : `Não há transações de ${
              categorias.find((c) => c.key === filtroCategoria)?.label
            } para este dia.`
      }
      buttonText="Adicionar Transação"
      buttonIcon="add"
      onButtonPress={handleNovaTransacao}
    />
  );
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray[800]} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{dataFormatada}</Text>

        <TouchableOpacity
          onPress={handleNovaTransacao}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={28} color={colors.purple[500]} />
        </TouchableOpacity>
      </View>

      {/* Filtros de categoria */}
      <FiltrosCategorias
        categorias={categorias}
        categoriaSelecionada={filtroCategoria}
        onSelecionar={setFiltroCategoria}
      />

      {/* Lista de transações */}
      {loading ? (
        <LoadingScreen message="Carregando transações..." />
      ) : (
        <FlatList
          data={transacoesFiltradas}
          renderItem={renderTransacao}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Exclusão */}
      <ModalExclusaoRecorrente
        visible={modalExclusaoVisible}
        onClose={() => {
          setModalExclusaoVisible(false);
          setTransacaoParaExcluir(null);
        }}
        onExcluirApenasEsta={excluirApenasEsta}
        onExcluirTodas={excluirTodas}
        dataFormatada={dataFormatadaCurta}
      />
    </SafeAreaView>
  );
}
