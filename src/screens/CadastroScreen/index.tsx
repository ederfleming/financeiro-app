import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
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

import ModalEdicaoRecorrente from "@/components/ModalEdicaoRecorrente";
import { useTransacaoForm } from "@/hooks/useTransacaoForm";
import { colors } from "@/theme/colors";
import { Recorrencia } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { categoriasParaCadastro } from "@/utils/categorias";
import { styles } from "./styles";

type CadastroScreenRouteProp = RouteProp<RootStackParamList, "Cadastro">;

const RECORRENCIAS: Array<{
  key: Recorrencia;
  label: string;
  descricao: string;
}> = [
  { key: "unica", label: "Única", descricao: "Não se repete" },
  { key: "diaria", label: "Diária", descricao: "Todos os dias" },
  { key: "semanal", label: "Semanal", descricao: "A cada 7 dias" },
  { key: "quinzenal", label: "Quinzenal", descricao: "A cada 14 dias" },
  { key: "cada21dias", label: "Cada 21 dias", descricao: "A cada 21 dias" },
  { key: "cada28dias", label: "Cada 28 dias", descricao: "A cada 28 dias" },
  { key: "mensal", label: "Mensal", descricao: "Todo mês no mesmo dia" },
];

export default function CadastroScreen() {
  const navigation = useNavigation();
  const route = useRoute<CadastroScreenRouteProp>();

  const {
    // Estados
    valor,
    categoria,
    tagSelecionada,
    descricao,
    recorrencia,
    tags,
    loading,
    modalEdicaoVisible,
    modalRecorrenciaVisible,
    dataFormatada,
    isEdicao,

    // Setters
    setCategoria,
    setTagSelecionada,
    setDescricao,
    setRecorrencia,
    setModalEdicaoVisible,
    setModalRecorrenciaVisible,

    // Funções
    formatarValorInput,
    mudarData,
    salvar,
    editarApenasEsta,
    editarTodas,
  } = useTransacaoForm({
    dataInicial: route.params?.data,
    categoriaInicial: route.params?.categoria,
    transacaoId: route.params?.transacaoId,
  });

  const recorrenciaSelecionada = RECORRENCIAS.find(
    (r) => r.key === recorrencia
  );

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

        <Text style={styles.headerTitle}>
          {isEdicao ? "Editar" : "Nova Transação"}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
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
            onPress={salvar}
            disabled={loading}
          >
            <Text style={styles.salvarTexto}>
              {loading
                ? "Salvando..."
                : isEdicao
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
              {RECORRENCIAS.map((rec) => (
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
      <ModalEdicaoRecorrente
        visible={modalEdicaoVisible}
        onClose={() => setModalEdicaoVisible(false)}
        onEditarApenasEsta={editarApenasEsta}
        onEditarTodas={editarTodas}
        dataFormatada={dataFormatada}
      />
    </SafeAreaView>
  );
}
