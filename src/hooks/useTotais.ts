// src/hooks/useTotais.ts

import { getConfig, getTransacoes } from "@/services/storage";
import { Config, Transacao } from "@/types";
import {
  calcularCustoDeVida,
  calcularDiarioMedio,
  calcularPercentualEconomizado,
  calcularPerformance,
  calcularTotaisMes,
  calcularTotaisPorCategoria,
  getCorBarraDiarioMedio,
  getDiaAtualDoMes,
  getFraseMotivacional,
  getStatusCustoDeVida,
  getStatusPerformance,
  TotaisMes,
  TotaisPorCategoria,
} from "@/utils/totaisUtils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

export const useTotais = () => {
  const navigation = useNavigation();

  // Estado
  const [mesAtual, setMesAtual] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [totaisMes, setTotaisMes] = useState<TotaisMes>({
    entradas: 0,
    saidas: 0,
    diarios: 0,
    cartao: 0,
    economia: 0,
  });
  const [totaisPorCategoria, setTotaisPorCategoria] = useState<
    TotaisPorCategoria[]
  >([]);

  /**
   * Carrega dados do storage e calcula totais
   */
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);

      const [transacoesData, configData] = await Promise.all([
        getTransacoes(),
        getConfig(),
      ]);

      setTransacoes(transacoesData);
      setConfig(configData);

      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();

      // Calcula totais do mês
      const totais = calcularTotaisMes(transacoesData, year, month, configData);
      setTotaisMes(totais);

      // Calcula totais por categoria com tags
      const totaisCategoria = calcularTotaisPorCategoria(
        transacoesData,
        year,
        month,
        configData
      );
      setTotaisPorCategoria(totaisCategoria);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [mesAtual]);

  /**
   * Recarrega dados quando a tela ganha foco
   */
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  /**
   * Muda o mês (anterior/próximo)
   */
  const mudarMes = (direcao: "anterior" | "proximo") => {
    setMesAtual((prev) => {
      const novoDia = new Date(prev);
      if (direcao === "anterior") {
        novoDia.setMonth(novoDia.getMonth() - 1);
      } else {
        novoDia.setMonth(novoDia.getMonth() + 1);
      }
      return novoDia;
    });
  };

  /**
   * Volta para o mês atual
   */
  const irParaHoje = () => {
    setMesAtual(new Date());
  };

  /**
   * Volta para a tela anterior
   */
  const voltar = () => {
    navigation.goBack();
  };

  // ==================== MÉTRICAS CALCULADAS ====================

  const year = mesAtual.getFullYear();
  const month = mesAtual.getMonth();
  const diaAtualDoMes = getDiaAtualDoMes(year, month);

  /**
   * Performance (Entradas - Gastos)
   */
  const performance = calcularPerformance(totaisMes);
  const statusPerformance = getStatusPerformance(performance);

  /**
   * Meta de Economia
   */
  const percentualMeta = config?.percentualEconomia || 0;
  const economiaReal = totaisMes.economia;

  // ✨ CORRIGIDO: Calcula meta em reais com validação
  const metaEmReais =
    config && totaisMes.entradas > 0
      ? Math.round(((totaisMes.entradas * percentualMeta) / 100) * 100) / 100
      : 0;

  const percentualEconomizado = calcularPercentualEconomizado(
    economiaReal,
    totaisMes.entradas,
    percentualMeta
  );
  const fraseMotivacional = getFraseMotivacional(percentualEconomizado);

  /**
   * Custo de Vida
   */
  const custoDeVida = calcularCustoDeVida(totaisMes);
  const statusCustoDeVida = getStatusCustoDeVida(
    custoDeVida,
    totaisMes.entradas
  );

  /**
   * Diário Médio
   */
  const diarioMedio = calcularDiarioMedio(
    transacoes,
    year,
    month,
    diaAtualDoMes
  );
  const gastoDiarioPadrao = config?.gastoDiarioPadrao || 0;
  const corBarraDiarioMedio = getCorBarraDiarioMedio(
    diarioMedio,
    gastoDiarioPadrao
  );
  const percentualBarraDiarioMedio =
    gastoDiarioPadrao > 0
      ? Math.min((diarioMedio / gastoDiarioPadrao) * 100, 100)
      : 0;

  return {
    // Estado
    mesAtual,
    loading,
    config,
    totaisMes,
    totaisPorCategoria,
    diaAtualDoMes,

    // Ações
    mudarMes,
    irParaHoje,
    voltar,
    carregarDados,

    // Métricas: Performance
    performance,
    statusPerformance,

    // Métricas: Meta de Economia
    percentualMeta,
    economiaReal,
    metaEmReais,
    percentualEconomizado,
    fraseMotivacional,

    // Métricas: Custo de Vida
    custoDeVida,
    statusCustoDeVida,

    // Métricas: Diário Médio
    diarioMedio,
    gastoDiarioPadrao,
    corBarraDiarioMedio,
    percentualBarraDiarioMedio,
  };
};
