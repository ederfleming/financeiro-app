import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import {
  deleteTransacao,
  excluirOcorrenciaRecorrente,
  excluirRecorrenciaAPartirDe,
  getTransacoesPorDataComRecorrencia,
} from "@/services/storage";
import { Categoria, Transacao } from "@/types";

interface UseTransacoesDataProps {
  data: string;
}

export function useTransacoesData({ data }: UseTransacoesDataProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas">(
    "todas"
  );
  const [loading, setLoading] = useState(true);
  const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] =
    useState<Transacao | null>(null);

  const carregarDados = useCallback(async () => {
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
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const transacoesFiltradas =
    filtroCategoria === "todas"
      ? transacoes
      : transacoes.filter((t) => t.categoria === filtroCategoria);

  const iniciarExclusao = useCallback(
    (transacao: Transacao) => {
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
    },
    [carregarDados]
  );

  const excluirApenasEsta = useCallback(async () => {
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
  }, [transacaoParaExcluir, data, carregarDados]);

  const excluirTodas = useCallback(async () => {
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
  }, [transacaoParaExcluir, carregarDados]);

  // ✨ NOVA FUNÇÃO: Exclui desta data em diante
  const excluirDestaEmDiante = useCallback(async () => {
    if (!transacaoParaExcluir) return;

    try {
      await excluirRecorrenciaAPartirDe(transacaoParaExcluir.id, data);
      setModalExclusaoVisible(false);
      setTransacaoParaExcluir(null);
      await carregarDados();

      // ✨ Alert de sucesso
      Alert.alert(
        "Sucesso",
        "Transações a partir desta data foram excluídas com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao excluir recorrência a partir de data:", error);
      Alert.alert("Erro", "Não foi possível excluir a recorrência");
    }
  }, [transacaoParaExcluir, data, carregarDados]);

  return {
    // Estados
    transacoes,
    transacoesFiltradas,
    filtroCategoria,
    loading,
    modalExclusaoVisible,
    transacaoParaExcluir,

    // Setters
    setFiltroCategoria,
    setModalExclusaoVisible,
    setTransacaoParaExcluir,

    // Funções
    carregarDados,
    iniciarExclusao,
    excluirApenasEsta,
    excluirDestaEmDiante, // ✨ NOVO
    excluirTodas,
  };
}