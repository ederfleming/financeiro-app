import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";

import {
  getConfig,
  getDiasConciliados,
  getTransacoes,
} from "@/services/storage";
import { SaldoDia } from "@/types";
import { RootStackParamList } from "@/types/navigation";
import { calcularSaldosTrimestre } from "@/utils/calculoSaldo";
import { getInicioTrimestre, getMonthName } from "@/utils/dateUtils";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface SaldoTrimestreColuna {
  mes: Date;
  saldos: SaldoDia[];
}

export function usePanoramas() {
  const navigation = useNavigation<NavigationProp>();

  // Estados
  const [colunasTrimestre, setColunasTrimestre] = useState<
    SaldoTrimestreColuna[]
  >([]);
 const [primeiroMesTrimestre, setPrimeiroMesTrimestre] = useState(
   getInicioTrimestre(new Date())
 );

  const [loading, setLoading] = useState(true);

  // Computed values
  const mesesExibidos = useMemo(() => {
    return colunasTrimestre.map((col) => col.mes);
  }, [colunasTrimestre]);

  // ==================== FUNÇÕES DE DADOS ====================

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);

      const transacoes = await getTransacoes();
      const diasConciliados = await getDiasConciliados();
      const config = await getConfig();

      // Calcula 3 meses sequenciais a partir do primeiroMesTrimestre
      const colunas: SaldoTrimestreColuna[] = [];

      for (let i = 0; i < 3; i++) {
        const mes = new Date(primeiroMesTrimestre);
        mes.setMonth(mes.getMonth() + i);

        const year = mes.getFullYear();
        const month = mes.getMonth();

        const saldos = calcularSaldosTrimestre(
          year,
          month,
          transacoes,
          diasConciliados,
          config
        );

        colunas.push({ mes, saldos });
      }

      setColunasTrimestre(colunas);
    } catch (error) {
      console.error("Erro ao carregar panorama:", error);
    } finally {
      setLoading(false);
    }
  }, [primeiroMesTrimestre]);


  function formatarTituloTrimestre(meses: Date[]) {
    if (meses.length === 0) return "";

    const inicio = meses[0];
    const fim = meses[meses.length - 1];

    const mesInicio = getMonthName(inicio.getMonth()).slice(0, 3);
    const mesFim = getMonthName(fim.getMonth()).slice(0, 3);
    const ano = inicio.getFullYear().toString().slice(-2);

    return `${mesInicio}–${mesFim}/${ano}`;
  }

 

  // ==================== FUNÇÕES DE NAVEGAÇÃO ====================

  const mudarTrimestre = useCallback(
    (direcao: "anterior" | "proximo") => {
      const novoMes = new Date(primeiroMesTrimestre);

      if (direcao === "anterior") {
        novoMes.setMonth(novoMes.getMonth() - 3);
      } else {
        novoMes.setMonth(novoMes.getMonth() + 3);
      }

      setPrimeiroMesTrimestre(novoMes);
    },
    [primeiroMesTrimestre]
  );

const irParaTrimestreAtual = useCallback(() => {
  setPrimeiroMesTrimestre(getInicioTrimestre(new Date()));
}, []);


  const abrirMenu = useCallback(() => {
    navigation.navigate("Menu");
  }, [navigation]);

  // ==================== RETORNO ====================

  return {
    // Estados
    colunasTrimestre,
    primeiroMesTrimestre,
    loading,
    mesesExibidos,

    // Funções
    carregarDados,
    formatarTituloTrimestre,
    mudarTrimestre,
    irParaTrimestreAtual,
    abrirMenu,
  };
}