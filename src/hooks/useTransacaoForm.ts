import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  addTransacao,
  editarOcorrenciaRecorrente,
  getTagsCategoria,
  getTransacoes,
  updateTransacao,
} from "@/services/storage";
import { Categoria, Recorrencia, Transacao } from "@/types";
import { formatDate, parseDate } from "@/utils/dateUtils";

interface UseTransacaoFormProps {
  dataInicial?: string;
  categoriaInicial?: Categoria;
  transacaoId?: string;
}

export function useTransacaoForm({
  dataInicial,
  categoriaInicial,
  transacaoId,
}: UseTransacaoFormProps = {}) {
  const navigation = useNavigation();

  // Estados do formulário
  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataInicial || formatDate(new Date()));
  const [categoria, setCategoria] = useState<Categoria>(
    categoriaInicial || "entradas"
  );
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recorrencia, setRecorrencia] = useState<Recorrencia>("unica");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [transacaoOriginal, setTransacaoOriginal] = useState<Transacao | null>(
    null
  );

  // Estados dos modais
  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false);
  const [modalRecorrenciaVisible, setModalRecorrenciaVisible] = useState(false);

  // Data formatada para exibição
  const dataObj = parseDate(data);
  const dataFormatada = `${dataObj.getDate().toString().padStart(2, "0")}/${(
    dataObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dataObj.getFullYear()}`;

  useEffect(() => {
    carregarDados();
  }, [transacaoId]);

  useEffect(() => {
    const carregarTags = async () => {
      if (categoria) {
        const tags = await getTagsCategoria(categoria);
        setTagsDisponiveis(tags);

        // Se a tag selecionada não existe mais na nova categoria, limpa
        if (tagSelecionada && !tags.includes(tagSelecionada)) {
          setTagSelecionada("");
        }
      }
    };

    carregarTags();
  }, [categoria]);

  const carregarDados = async () => {
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

  // Formatação de valor
  const formatarValorInput = useCallback((texto: string) => {
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
  }, []);

  const converterValorParaNumero = useCallback(
    (valorFormatado: string): number => {
      if (!valorFormatado) return 0;
      const numeroLimpo = valorFormatado.replace(/\./g, "").replace(",", ".");
      return parseFloat(numeroLimpo);
    },
    []
  );

  // Mudança de data
  const mudarData = useCallback(
    (direcao: "anterior" | "proximo") => {
      const dataAtual = parseDate(data);
      const novaData = new Date(dataAtual);

      if (direcao === "anterior") {
        novaData.setDate(novaData.getDate() - 1);
      } else {
        novaData.setDate(novaData.getDate() + 1);
      }

      setData(formatDate(novaData));
    },
    [data]
  );

  // Validação
  const validarFormulario = useCallback((): boolean => {
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
  }, [valor, data, descricao, converterValorParaNumero]);

  // Salvar (criar ou editar)
  const salvar = useCallback(async () => {
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
  }, [
    validarFormulario,
    transacaoId,
    transacaoOriginal,
    valor,
    data,
    categoria,
    tagSelecionada,
    descricao,
    recorrencia,
    converterValorParaNumero,
    navigation,
  ]);

  // Editar apenas esta ocorrência
  const editarApenasEsta = useCallback(async () => {
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
  }, [
    transacaoId,
    transacaoOriginal,
    data,
    valor,
    categoria,
    tagSelecionada,
    descricao,
    converterValorParaNumero,
    navigation,
  ]);

  // Editar todas as ocorrências
  const editarTodas = useCallback(async () => {
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
  }, [
    transacaoId,
    valor,
    categoria,
    tagSelecionada,
    descricao,
    recorrencia,
    converterValorParaNumero,
    navigation,
  ]);

  return {
    // Estados
    valor,
    data,
    categoria,
    tagSelecionada,
    tagsDisponiveis,
    descricao,
    recorrencia,
    tags,
    loading,
    transacaoOriginal,
    modalEdicaoVisible,
    modalRecorrenciaVisible,
    dataFormatada, // ✅ Agora exportado

    // Setters
    setValor,
    setData,
    setCategoria,
    setTagSelecionada,
    setDescricao,
    setRecorrencia,
    setModalEdicaoVisible,
    setModalRecorrenciaVisible, // ✅ Agora exportado

    // Funções
    formatarValorInput,
    mudarData, // ✅ Agora exportado
    salvar,
    editarApenasEsta,
    editarTodas,

    // Flags
    isEdicao: !!transacaoId,
  };
}
