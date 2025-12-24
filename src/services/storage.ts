import { Config, Transacao } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { getTransacoesAplicaveisNaData } from "@/utils/recorrencia";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys para o AsyncStorage
const KEYS = {
  TRANSACOES: "@panorama$:transacoes",
  TRANSACOES_MES: (year: number, month: number) =>
    `@panorama$:transacoes:${year}-${month}`,
  CONFIG: "@panorama$:config",
  DIAS_CONCILIADOS: "@panorama$:dias_conciliados",
  TAGS: "@panorama$:tags",
};

// ==================== CONFIG ====================
export const getConfig = async (): Promise<Config> => {
  try {
    const config = await AsyncStorage.getItem(KEYS.CONFIG);
    if (!config) {
      const defaultConfig: Config = {
        saldoInicial: 0,
        dataInicial: formatDate(new Date()),
        gastosVariaveis: [], // ✨ NOVO
        diasParaDivisao: 30, // ✨ NOVO
        gastoDiarioPadrao: 0,
        percentualEconomia: 0,
        onboardingCompleto: false,
      };
      await setConfig(defaultConfig);
      return defaultConfig;
    }
    return JSON.parse(config);
  } catch (error) {
    console.error("Erro ao buscar config:", error);
    return {
      saldoInicial: 0,
      dataInicial: formatDate(new Date()),
      gastosVariaveis: [], // ✨ NOVO
      diasParaDivisao: 30, // ✨ NOVO
      gastoDiarioPadrao: 0,
      percentualEconomia: 0,
      onboardingCompleto: false,
    };
  }
};

/**
 * Atualiza parcialmente as configurações do app
 */
export const updateConfig = async (novaConfig: Partial<Config>): Promise<void> => {
  try {
    const configAtual = await getConfig();
    const configAtualizada = { ...configAtual, ...novaConfig };
    await setConfig(configAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar config:', error);
    throw error;
  }
};

/**
 * Reseta completamente o storage (remove todas as chaves do app)
 * ⚠️ CUIDADO: Esta operação é IRREVERSÍVEL!
 */
export const resetStorage = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const panoramaKeys = allKeys.filter((key) => key.startsWith('@panorama$:'));
    await AsyncStorage.multiRemove(panoramaKeys);
  } catch (error) {
    console.error('Erro ao resetar storage:', error);
    throw error;
  }
};

// ✅ Adicionar função para verificar onboarding
export const isOnboardingCompleto = async (): Promise<boolean> => {
  try {
    const config = await getConfig();
    return config.onboardingCompleto;
  } catch (error) {
    console.error("Erro ao verificar onboarding:", error);
    return false;
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
/**
 * Salva todas as transações (mantém para compatibilidade e migração)
 */
const saveAllTransacoes = async (transacoes: Transacao[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
};

/**
 * Organiza transações por mês e salva separadamente
 */
const saveTransacoesPorMes = async (transacoes: Transacao[]): Promise<void> => {
  const transacoesPorMes: { [key: string]: Transacao[] } = {};

  transacoes.forEach((t) => {
    const [year, month] = t.data.split("-");
    const key = `${year}-${month}`;

    if (!transacoesPorMes[key]) {
      transacoesPorMes[key] = [];
    }
    transacoesPorMes[key].push(t);
  });

  // Salva cada mês separadamente
  for (const [key, trans] of Object.entries(transacoesPorMes)) {
    const [year, month] = key.split("-");
    await AsyncStorage.setItem(
      KEYS.TRANSACOES_MES(parseInt(year), parseInt(month)),
      JSON.stringify(trans)
    );
  }
};

export const getTransacoes = async (): Promise<Transacao[]> => {
  try {
    const transacoes = await AsyncStorage.getItem(KEYS.TRANSACOES);
    return transacoes ? JSON.parse(transacoes) : [];
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
};

/**
 * Busca transações de um mês específico (otimizado)
 */
export const getTransacoesMes = async (
  year: number,
  month: number
): Promise<Transacao[]> => {
  try {
    const key = KEYS.TRANSACOES_MES(year, month);
    const transacoes = await AsyncStorage.getItem(key);

    if (transacoes) {
      return JSON.parse(transacoes);
    }

    // Fallback: se não existe por mês, busca de todas e filtra
    const todas = await getTransacoes();
    return todas.filter((t) => {
      const [y, m] = t.data.split("-").map(Number);
      return y === year && m === month + 1; // month é 0-indexed
    });
  } catch (error) {
    console.error("Erro ao buscar transações do mês:", error);
    return [];
  }
};

export const addTransacao = async (transacao: Transacao): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    transacoes.push(transacao);

    // Salva no índice geral
    await saveAllTransacoes(transacoes);

    // Reorganiza e salva por mês
    await saveTransacoesPorMes(transacoes);
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

      await saveAllTransacoes(transacoes);
      await saveTransacoesPorMes(transacoes);
    }
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
  }
};

export const deleteTransacao = async (id: string): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const filtered = transacoes.filter((t) => t.id !== id);

    await saveAllTransacoes(filtered);
    await saveTransacoesPorMes(filtered);
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

      // await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
      await saveAllTransacoes(transacoes);
      await saveTransacoesPorMes(transacoes);
    }
  } catch (error) {
    console.error("Erro ao excluir ocorrência recorrente:", error);
  }
};

/**
 * ✨ NOVA FUNÇÃO: Exclui uma transação recorrente a partir de uma data específica
 * Define o campo dataFimRecorrencia para o dia anterior à data de exclusão
 */
export const excluirRecorrenciaAPartirDe = async (
  id: string,
  dataInicio: string
): Promise<void> => {
  try {
    const transacoes = await getTransacoes();
    const index = transacoes.findIndex((t) => t.id === id);

    if (index !== -1) {
      // Calcula a data final (dia anterior ao início da exclusão)
      const dataInicioObj = new Date(dataInicio + "T00:00:00");
      dataInicioObj.setDate(dataInicioObj.getDate() - 1);
      const dataFim = dataInicioObj.toISOString().split("T")[0];

      transacoes[index] = {
        ...transacoes[index],
        dataFimRecorrencia: dataFim,
      };

      await AsyncStorage.setItem(KEYS.TRANSACOES, JSON.stringify(transacoes));
    }
  } catch (error) {
    console.error("Erro ao excluir recorrência a partir de data:", error);
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
