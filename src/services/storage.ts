import { Config, Transacao } from "@/types";
import { getTransacoesAplicaveisNaData } from "@/utils/recorrencia";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys para o AsyncStorage
const KEYS = {
  TRANSACOES: "@financeiro:transacoes",
  CONFIG: "@financeiro:config",
  DIAS_CONCILIADOS: "@financeiro:dias_conciliados",
  TAGS: "@financeiro:tags",
};

// ==================== CONFIG ====================
export const getConfig = async (): Promise<Config> => {
  try {
    const config = await AsyncStorage.getItem(KEYS.CONFIG);
    if (!config) {
      const defaultConfig: Config = {
        saldoInicial: 0,
        gastoDiarioPadrao: 0,
        percentualEconomia: 0,
      };
      await setConfig(defaultConfig);
      return defaultConfig;
    }
    return JSON.parse(config);
  } catch (error) {
    console.error("Erro ao buscar config:", error);
    return {
      saldoInicial: 0,
      gastoDiarioPadrao: 0,
      percentualEconomia: 0,
    };
  }
};

export const setConfig = async (config: Config): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error("Erro ao salvar config:", error);
  }
};

// ==================== TRANSAÇÕES ====================
export const getTransacoes = async (): Promise<Transacao[]> => {
  try {
    const transacoes = await AsyncStorage.getItem(KEYS.TRANSACOES);
    return transacoes ? JSON.parse(transacoes) : [];
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
};

export const addTransacao = async (transacao: Transacao): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    transacoes.push(transacao);
    await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
  }
};

export const updateTransacao = async (
  id: string,
  transacao: Partial<Transacao>
): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const index = transacoes.findIndex((t) => t.id === id);
    if (index !== -1) {
      transacoes[index] = { ...transacoes[index], ...transacao };
      await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
    }
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
  }
};

export const deleteTransacao = async (id: string): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const filtered = transacoes.filter((t) => t.id !== id);
    await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
  }
};

export const getTransacoesPorData = async (
  data: string
): Promise<Transacao[]> => {
  try {
    const transacoes = await getTransacoes();
    return transacoes.filter((t) => t.data === data);
  } catch (error) {
    console.error("Erro ao buscar transações por data:", error);
    return [];
  }
};

/**
 * Busca transações de uma data específica, incluindo recorrentes
 */
export const getTransacoesPorDataComRecorrencia = async (
  data: string
): Promise<Transacao[]> => {
  try {
    const todasTransacoes = await getTransacoes();
    return getTransacoesAplicaveisNaData(todasTransacoes, data);
  } catch (error) {
    console.error("Erro ao buscar transações por data com recorrência:", error);
    return [];
  }
};

/**
 * Exclui uma ocorrência específica de uma transação recorrente
 */
export const excluirOcorrenciaRecorrente = async (
  id: string,
  dataExclusao: string
): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const index = transacoes.findIndex((t) => t.id === id);

    if (index !== -1) {
      const transacao = transacoes[index];
      const datasExcluidas = transacao.datasExcluidas || [];

      if (!datasExcluidas.includes(dataExclusao)) {
        datasExcluidas.push(dataExclusao);
      }

      transacoes[index] = {
        ...transacao,
        datasExcluidas,
      };

      await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
    }
  } catch (error) {
    console.error("Erro ao excluir ocorrência recorrente:", error);
  }
};

/**
 * Edita uma ocorrência específica de uma transação recorrente
 */
export const editarOcorrenciaRecorrente = async (
  id: string,
  dataEdicao: string,
  dados: Partial<
    Omit<
      Transacao,
      "id" | "recorrencia" | "datasExcluidas" | "edicoesEspecificas"
    >
  >
): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const index = transacoes.findIndex((t) => t.id === id);

    if (index !== -1) {
      const transacao = transacoes[index];
      const edicoesEspecificas = transacao.edicoesEspecificas || {};

      edicoesEspecificas[dataEdicao] = dados;

      transacoes[index] = {
        ...transacao,
        edicoesEspecificas,
      };

      await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
    }
  } catch (error) {
    console.error("Erro ao editar ocorrência recorrente:", error);
  }
};

// ==================== DIAS CONCILIADOS ====================
export const getDiasConciliados = async (): Promise<string[]> => {
  try {
    const dias = await AsyncStorage.getItem(KEYS.DIAS_CONCILIADOS);
    return dias ? JSON.parse(dias) : [];
  } catch (error) {
    console.error("Erro ao buscar dias conciliados:", error);
    return [];
  }
};

export const toggleDiaConciliado = async (data: string): Promise<void> => {
  try {
    const dias = await getDiasConciliados();
    const index = dias.indexOf(data);

    if (index === -1) {
      dias.push(data);
    } else {
      dias.splice(index, 1);
    }

    await AsyncStorage.setItem(KEYS.DIAS_CONCILIADOS, JSON.stringify(dias));
  } catch (error) {
    console.error("Erro ao toggle dia conciliado:", error);
  }
};

export const isDiaConciliado = async (data: string): Promise<boolean> => {
  try {
    const dias = await getDiasConciliados();
    return dias.includes(data);
  } catch (error) {
    console.error("Erro ao verificar dia conciliado:", error);
    return false;
  }
};



// ==================== TAGS ====================
export const getTags = async (): Promise<string[]> => {
  try {
    const tags = await AsyncStorage.getItem(KEYS.TAGS);
    return tags
      ? JSON.parse(tags)
      : ["Alimentação", "Transporte", "Lazer", "Saúde", "Educação"];
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return ["Alimentação", "Transporte", "Lazer", "Saúde", "Educação"];
  }
};

export const addTag = async (tag: string): Promise<void> => {
  try {
    const tags = await getTags();
    if (!tags.includes(tag)) {
      tags.push(tag);
      await AsyncStorage.setItem(KEYS.TAGS, JSON.stringify(tags));
    }
  } catch (error) {
    console.error("Erro ao adicionar tag:", error);
  }
};

export const deleteTag = async (tag: string): Promise<void> => {
  try {
    const tags = await getTags();
    const filtered = tags.filter((t) => t !== tag);
    await AsyncStorage.setItem(KEYS.TAGS, JSON.stringify(filtered));
  } catch (error) {
    console.error("Erro ao deletar tag:", error);
  }
};
