import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTags } from "@/hooks/useTags";
import { colors } from "@/theme/colors";
import { Categoria } from "@/types";
import { categoriasParaCadastro } from "@/utils/categorias";
import { styles } from "./styles";

interface CategoriaComTags {
  categoria: Categoria;
  label: string;
  icon: any;
  color: string;
  tags: string[];
  expanded: boolean;
}

export default function TagsScreen() {
  const { tags, loading, adicionarTag, editarTag, removerTag, recarregarTags } =
    useTags();

  const [categoriasExpandidas, setCategoriasExpandidas] = useState<{
    [key in Categoria]?: boolean;
  }>({
    entradas: false,
    saidas: false,
    diarios: false,
    cartao: false,
    economia: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState<Categoria | null>(null);
  const [nomeTag, setNomeTag] = useState("");
  const [tagEditando, setTagEditando] = useState<{
    categoria: Categoria;
    nomeAntigo: string;
  } | null>(null);

  // Prepara dados para o accordion
  const dadosAccordion: CategoriaComTags[] = categoriasParaCadastro.map(
    (cat) => ({
      categoria: cat.key,
      label: cat.label,
      icon: cat.icon,
      color: cat.color,
      tags: tags[cat.key] || [],
      expanded: categoriasExpandidas[cat.key] || false,
    })
  );

  const toggleCategoria = (categoria: Categoria) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const abrirModalAdicionar = (categoria: Categoria) => {
    setCategoriaAtual(categoria);
    setNomeTag("");
    setModalVisible(true);
  };

  const abrirModalEditar = (categoria: Categoria, nomeAntigo: string) => {
    setTagEditando({ categoria, nomeAntigo });
    setNomeTag(nomeAntigo);
    setModalEditVisible(true);
  };

  const handleAdicionar = async () => {
    if (!categoriaAtual) return;

    const resultado = await adicionarTag(categoriaAtual, nomeTag);

    if (resultado.success) {
      setModalVisible(false);
      setNomeTag("");
    } else {
      Alert.alert(
        "Erro",
        resultado.error || "Não foi possível adicionar a tag"
      );
    }
  };

  const handleEditar = async () => {
    if (!tagEditando) return;

    Alert.alert(
      "Confirmar Edição",
      `Deseja realmente editar esta tag?\n\nTodas as transações que usam "${tagEditando.nomeAntigo}" serão atualizadas automaticamente.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            const resultado = await editarTag(
              tagEditando.categoria,
              tagEditando.nomeAntigo,
              nomeTag
            );

            if (resultado.success) {
              setModalEditVisible(false);
              setNomeTag("");
              setTagEditando(null);

              if (resultado.transacoesAtualizadas !== undefined) {
                Alert.alert(
                  "Sucesso",
                  `Tag atualizada!\n\n${resultado.transacoesAtualizadas} transação(ões) foram atualizadas.`
                );
              }
            } else {
              Alert.alert(
                "Erro",
                resultado.error || "Não foi possível editar a tag"
              );
            }
          },
        },
      ]
    );
  };

  const handleRemover = async (categoria: Categoria, nomeTag: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente remover a tag "${nomeTag}"?\n\nAs transações que usam esta tag não serão removidas, apenas ficarão sem tag.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const resultado = await removerTag(categoria, nomeTag);

            if (!resultado.success) {
              Alert.alert(
                "Erro",
                resultado.error || "Não foi possível remover a tag"
              );
            }
          },
        },
      ]
    );
  };

  const renderTagItem = useCallback(
    ({
      item,
      categoria,
      color,
    }: {
      item: string;
      categoria: Categoria;
      color: string;
    }) => (
      <View style={styles.tagItem}>
        <View style={styles.tagItemLeft}>
          <Ionicons name="pricetag" size={16} color={color} />
          <Text style={styles.tagItemText}>{item}</Text>
        </View>

        <View style={styles.tagItemActions}>
          <TouchableOpacity
            style={styles.tagActionButton}
            onPress={() => abrirModalEditar(categoria, item)}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.gray[600]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagActionButton}
            onPress={() => handleRemover(categoria, item)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    []
  );

  const renderCategoria = useCallback(
    ({ item }: { item: CategoriaComTags }) => (
      <View style={styles.categoriaContainer}>
        {/* Header do Accordion */}
        <TouchableOpacity
          style={styles.categoriaHeader}
          onPress={() => toggleCategoria(item.categoria)}
          activeOpacity={0.7}
        >
          <View style={styles.categoriaHeaderLeft}>
            <Ionicons
              name={item.expanded ? "chevron-down" : "chevron-forward"}
              size={24}
              color={colors.gray[600]}
            />
            <View
              style={[
                styles.categoriaIconContainer,
                { backgroundColor: item.color + "20" },
              ]}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.categoriaLabel}>{item.label}</Text>
          </View>

          <View style={styles.categoriaHeaderRight}>
            <Text style={styles.categoriaCount}>
              {item.tags.length} {item.tags.length === 1 ? "tag" : "tags"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Conteúdo Expansível */}
        {item.expanded && (
          <View style={styles.categoriaContent}>
            {item.tags.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma tag cadastrada</Text>
            ) : (
              <FlatList
                data={item.tags}
                keyExtractor={(tag) => `${item.categoria}-${tag}`}
                renderItem={({ item: tag }) =>
                  renderTagItem({
                    item: tag,
                    categoria: item.categoria,
                    color: item.color,
                  })
                }
                scrollEnabled={false}
              />
            )}

            {/* Botão Adicionar Tag */}
            <TouchableOpacity
              style={[
                styles.addTagButton,
                {
                  borderColor: item.color,
                  opacity: item.tags.length >= 20 ? 0.5 : 1,
                },
              ]}
              onPress={() => abrirModalAdicionar(item.categoria)}
              disabled={item.tags.length >= 20}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={item.color}
              />
              <Text style={[styles.addTagText, { color: item.color }]}>
                {item.tags.length >= 20
                  ? "Limite de tags atingido"
                  : "Adicionar tag"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [categoriasExpandidas, tags]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tags</Text>
        <Text style={styles.headerSubtitle}>
          Organize suas transações com tags personalizadas
        </Text>
      </View>

      {/* Lista de Categorias (Accordion) */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={dadosAccordion}
          keyExtractor={(item) => item.categoria}
          renderItem={renderCategoria}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal Adicionar Tag */}
      <Modal
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
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Nova Tag</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.gray[800]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Nome da tag</Text>
              <TextInput
                style={styles.modalInput}
                value={nomeTag}
                onChangeText={setNomeTag}
                placeholder="Ex: Supermercado"
                placeholderTextColor={colors.gray[400]}
                maxLength={20}
                autoFocus
              />
              <Text style={styles.modalHint}>
                Máximo 20 caracteres • {nomeTag.length}/20
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtonConfirm,
                  !nomeTag.trim() && styles.modalButtonDisabled,
                ]}
                onPress={handleAdicionar}
                disabled={!nomeTag.trim()}
              >
                <Text style={styles.modalButtonConfirmText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Editar Tag */}
      <Modal
        visible={modalEditVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalEditVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalEditVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar Tag</Text>
              <TouchableOpacity onPress={() => setModalEditVisible(false)}>
                <Ionicons name="close" size={24} color={colors.gray[800]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Nome da tag</Text>
              <TextInput
                style={styles.modalInput}
                value={nomeTag}
                onChangeText={setNomeTag}
                placeholder="Ex: Supermercado"
                placeholderTextColor={colors.gray[400]}
                maxLength={20}
                autoFocus
              />
              <Text style={styles.modalHint}>
                Máximo 20 caracteres • {nomeTag.length}/20
              </Text>

              <View style={styles.warningBox}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={colors.orange[500]}
                />
                <Text style={styles.warningText}>
                  Todas as transações serão atualizadas automaticamente
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalEditVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtonConfirm,
                  !nomeTag.trim() && styles.modalButtonDisabled,
                ]}
                onPress={handleEditar}
                disabled={!nomeTag.trim()}
              >
                <Text style={styles.modalButtonConfirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
