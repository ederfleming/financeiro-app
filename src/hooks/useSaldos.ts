import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList } from "react-native";

import {
  getConfig,
  getDiasConciliados,
  getTransacoes,
  toggleDiaConciliado as toggleDiaConciliadoStorage,
} from "@/services/storage";
import { Categoria, SaldoDia } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { calcularSaldosMes } from "@/utils/calculoSaldo";
import { formatDate, getDatesInMonth } from "@/utils/dateUtils";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useSaldos() {
  const navigation = useNavigation<NavigationProp>();

  // Estados
  const [saldos, setSaldos] = useState<SaldoDia[]>([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas">(
    "entradas"
  );
  const [loading, setLoading] = useState(true);

  // Refs
  const listRef = useRef<FlatList<SaldoDia>>(null);
  const isFirstLoad = useRef(true);

  // Computed values
  const totalEntradasMes = useMemo(() => {
    return saldos.reduce((acc, item) => acc + item.entradas, 0);
  }, [saldos]);

  // ==================== FUNÇÕES DE SCROLL ====================

  const scrollParaDia = useCallback(
    (year: number, month: number, saldosData: SaldoDia[]) => {
      const hoje = new Date();
      const isMesAtual =
        hoje.getMonth() === month && hoje.getFullYear() === year;

      let indexAlvo: number;

      if (isMesAtual) {
        indexAlvo = saldosData.findIndex((item) => item.dia === hoje.getDate());
      } else {
        indexAlvo = 0;
      }

      if (indexAlvo >= 0 && listRef.current) {
        listRef.current.scrollToIndex({
          index: indexAlvo,
          animated: true,
          viewPosition: 0,
        });
      }
    },
    []
  );

  const irParaHoje = useCallback(() => {
    const hoje = new Date();
    setMesAtual(hoje);

    setTimeout(() => {
      const indexHoje = saldos.findIndex((item) => item.dia === hoje.getDate());

      if (indexHoje >= 0 && listRef.current) {
        listRef.current.scrollToIndex({
          index: indexHoje,
          animated: true,
          viewPosition: 0,
        });
      }
    }, 100);
  }, [saldos]);

  // ==================== FUNÇÕES DE DADOS ====================

  const carregarDados = useCallback(async () => {
    try {
      if (isFirstLoad.current) {
        setLoading(true);
      }

      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();

      const datas = getDatesInMonth(year, month);
      const transacoes = await getTransacoes();
      const diasConciliados = await getDiasConciliados();
      const config = await getConfig();

      const saldosCalculados = calcularSaldosMes(
        datas,
        transacoes,
        diasConciliados,
        config,
        year,
        month
      );
      setSaldos(saldosCalculados);

      setTimeout(() => {
        scrollParaDia(year, month, saldosCalculados);
      }, 100);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, [mesAtual, scrollParaDia]);

  // ==================== FUNÇÕES DE NAVEGAÇÃO ====================

  const mudarMes = useCallback(
    (direcao: "anterior" | "proximo") => {
      const novoMes = new Date(mesAtual);
      if (direcao === "anterior") {
        novoMes.setMonth(novoMes.getMonth() - 1);
      } else {
        novoMes.setMonth(novoMes.getMonth() + 1);
      }
      setMesAtual(novoMes);
    },
    [mesAtual]
  );

  const abrirMenu = useCallback(() => {
    navigation.navigate("Menu");
  }, [navigation]);

  const abrirCadastro = useCallback(
    (dia: number) => {
      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();
      const data = formatDate(new Date(year, month, dia));

      navigation.navigate("Cadastro", {
        data,
        categoria: filtroCategoria === "todas" ? "entradas" : filtroCategoria,
      });
    },
    [mesAtual, filtroCategoria, navigation]
  );

  const abrirDetalhes = useCallback(
    (dia: number, filter: string) => {
      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();
      const dataFormatada = formatDate(new Date(year, month, dia));
      navigation.navigate("Detalhes", { data: dataFormatada, filter });
    },
    [mesAtual, navigation]
  );

  // ==================== FUNÇÕES DE AÇÕES ====================

  const toggleDiaConciliado = useCallback(
    async (dia: number) => {
      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();
      const data = formatDate(new Date(year, month, dia));

      await toggleDiaConciliadoStorage(data);

      setSaldos((prev) =>
        prev.map((item) =>
          item.dia === dia ? { ...item, conciliado: !item.conciliado } : item
        )
      );
    },
    [mesAtual]
  );

  // ==================== RETORNO ====================

  return {
    // Estados
    saldos,
    mesAtual,
    filtroCategoria,
    loading,
    totalEntradasMes,

    // Refs
    listRef,

    // Setters
    setFiltroCategoria,

    // Funções
    carregarDados,
    mudarMes,
    irParaHoje,
    toggleDiaConciliado,
    abrirMenu,
    abrirCadastro,
    abrirDetalhes,
  };
}
