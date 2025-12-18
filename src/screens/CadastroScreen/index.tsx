import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { addTransacao, getTags } from "@/services/storage";
import { colors } from "@/theme/colors";
import { Categoria, Transacao } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { categorias } from "@/utils/categorias";
import { formatDate, parseDate } from "@/utils/dateUtils";
import { styles } from "./styles";

type CadastroScreenRouteProp = RouteProp<RootStackParamList, "Cadastro">;

export default function CadastroScreen() {
  const navigation = useNavigation();
  const route = useRoute<CadastroScreenRouteProp>();

  // Pega os parâmetros da navegação (se houver)
  const dataInicial = route.params?.data || formatDate(new Date());
  const categoriaInicial = route.params?.categoria || "entradas";

  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataInicial);
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarTags();
  }, []);

  const carregarTags = async () => {
    const tagsCarregadas = await getTags();
    setTags(tagsCarregadas);
  };

  const formatarValorInput = (texto: string) => {
    // Remove tudo que não é número
    const apenasNumeros = texto.replace(/[^0-9]/g, "");

    if (!apenasNumeros) {
      setValor("");
      return;
    }

    // Converte para número e divide por 100 (para ter centavos)
    const numero = parseInt(apenasNumeros) / 100;

    // Formata para moeda brasileira
    const formatado = numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValor(formatado);
  };

  const converterValorParaNumero = (valorFormatado: string): number => {
    if (!valorFormatado) return 0;

    // Remove pontos de milhar e substitui vírgula por ponto
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

    if (!tagSelecionada) {
      Alert.alert("Erro", "Selecione uma tag");
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const novaTransacao: Transacao = {
        id: Date.now().toString(),
        valor: converterValorParaNumero(valor),
        data,
        categoria,
        tag: tagSelecionada,
        descricao,
      };

      await addTransacao(novaTransacao);

      Alert.alert("Sucesso", "Transação cadastrada!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Não foi possível salvar a transação");
    } finally {
      setLoading(false);
    }
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
              {categorias.filter(item => item.key !== "todas").map((cat) => (
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

          {/* Seletor de Tag */}
          <View style={styles.section}>
            <Text style={styles.label}>Tag</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
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

          {/* Input de Descrição */}
          <View style={styles.section}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={styles.descricaoInput}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Compras no mercado"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.salvarButton,
              loading && styles.salvarButtonDisabled,
            ]}
            onPress={handleSalvar}
            disabled={loading}
          >
            <Text style={styles.salvarTexto}>
              {loading ? "Salvando..." : "Salvar Transação"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


