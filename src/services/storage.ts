import { Config, TagsPorCategoria, Transacao } from "@/types";
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
        perfil: {
          // ← ✨ NOVO
          nome: "",
          email: "",
          dataNascimento: "",
        },
        saldoInicial: 0,
        dataInicial: formatDate(new Date()),
        gastosVariaveis: [],
        diasParaDivisao: 30,
        gastoDiarioPadrao: 0,
        percentualEconomia: 0,
        onboardingCompleto: false,
      };
      await setConfig(defaultConfig);
      return defaultConfig;
    }

    const configParsed = JSON.parse(config);

    // ✨ MIGRAÇÃO: Se não tem perfil, adiciona padrão
    if (!configParsed.perfil) {
      configParsed.perfil = {
        nome: "",
        email: "",
        dataNascimento: "",
      };
    }

    return configParsed;
  } catch (error) {
    console.error("Erro ao buscar config:", error);
    return {
      perfil: {
        nome: "",
        email: "",
        dataNascimento: "",
      },
      saldoInicial: 0,
      dataInicial: formatDate(new Date()),
      gastosVariaveis: [],
      diasParaDivisao: 30,
      gastoDiarioPadrao: 0,
      percentualEconomia: 0,
      onboardingCompleto: false,
    };
  }
};

/**
 * Atualiza parcialmente as configurações do app
 */
export const updateConfig = async (
  novaConfig: Partial<Config>
): Promise<void> => {
  try {
    const configAtual = await getConfig();
    const configAtualizada = { ...configAtual, ...novaConfig };
    await setConfig(configAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar config:", error);
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
    const panoramaKeys = allKeys.filter((key) => key.startsWith("@panorama$:"));
    await AsyncStorage.multiRemove(panoramaKeys);
  } catch (error) {
    console.error("Erro ao resetar storage:", error);
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

// ==================== TAGS POR CATEGORIA ====================

/**
 * ✨ NOVA ESTRUTURA: Retorna tags organizadas por categoria
 */
export const getTags = async (): Promise<TagsPorCategoria> => {
  try {
    const tagsJSON = await AsyncStorage.getItem(KEYS.TAGS);

    if (!tagsJSON) {
      // 🔄 MIGRAÇÃO: Limpa tags antigas (formato string[])
      const defaultTags: TagsPorCategoria = {
        entradas: [],
        saidas: [],
        diarios: [],
        cartao: [],
        economia: [],
      };
      await setTags(defaultTags);
      return defaultTags;
    }

    const tags = JSON.parse(tagsJSON);

    // 🔄 MIGRAÇÃO: Se está no formato antigo (string[]), limpa
    if (Array.isArray(tags)) {
      const defaultTags: TagsPorCategoria = {
        entradas: [],
        saidas: [],
        diarios: [],
        cartao: [],
        economia: [],
      };
      await setTags(defaultTags);
      return defaultTags;
    }

    return tags;
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return {
      entradas: [],
      saidas: [],
      diarios: [],
      cartao: [],
      economia: [],
    };
  }
};

/**
 * Salva todas as tags (sobrescreve)
 */
export const setTags = async (tags: TagsPorCategoria): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TAGS, JSON.stringify(tags));
  } catch (error) {
    console.error("Erro ao salvar tags:", error);
    throw error;
  }
};

/**
 * ✨ NOVO: Adiciona uma tag a uma categoria específica
 */
export const addTag = async (
  categoria: keyof TagsPorCategoria,
  nomeTag: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const tags = await getTags();
    const nomeTrimmed = nomeTag.trim();

    // Validações
    if (!nomeTrimmed) {
      return { success: false, error: "Nome da tag não pode ser vazio" };
    }

    if (nomeTrimmed.length > 20) {
      return { success: false, error: "Nome deve ter no máximo 20 caracteres" };
    }

    // Verifica duplicata na mesma categoria
    if (tags[categoria].includes(nomeTrimmed)) {
      return { success: false, error: "Tag já existe nesta categoria" };
    }

    // Limite de 20 tags por categoria
    if (tags[categoria].length >= 20) {
      return {
        success: false,
        error: "Limite de 20 tags por categoria atingido",
      };
    }

    tags[categoria].push(nomeTrimmed);
    await setTags(tags);

    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar tag:", error);
    return { success: false, error: "Erro ao salvar tag" };
  }
};

/**
 * ✨ NOVO: Edita o nome de uma tag e atualiza todas as transações
 */
export const editTag = async (
  categoria: keyof TagsPorCategoria,
  nomeAntigo: string,
  nomeNovo: string
): Promise<{
  success: boolean;
  error?: string;
  transacoesAtualizadas?: number;
}> => {
  try {
    const tags = await getTags();
    const nomeNovoTrimmed = nomeNovo.trim();

    // Validações
    if (!nomeNovoTrimmed) {
      return { success: false, error: "Nome da tag não pode ser vazio" };
    }

    if (nomeNovoTrimmed.length > 20) {
      return { success: false, error: "Nome deve ter no máximo 20 caracteres" };
    }

    // Verifica se tag antiga existe
    const index = tags[categoria].indexOf(nomeAntigo);
    if (index === -1) {
      return { success: false, error: "Tag não encontrada" };
    }

    // Verifica duplicata (se o nome mudou)
    if (
      nomeAntigo !== nomeNovoTrimmed &&
      tags[categoria].includes(nomeNovoTrimmed)
    ) {
      return {
        success: false,
        error: "Já existe uma tag com este nome nesta categoria",
      };
    }

    // Atualiza o nome da tag
    tags[categoria][index] = nomeNovoTrimmed;
    await setTags(tags);

    // 🔄 Atualiza todas as transações que usam essa tag
    const transacoes = await getTransacoes();
    let contador = 0;

    const transacoesAtualizadas = transacoes.map((t) => {
      if (t.categoria === categoria && t.tag === nomeAntigo) {
        contador++;
        return { ...t, tag: nomeNovoTrimmed };
      }
      return t;
    });

    await saveAllTransacoes(transacoesAtualizadas);
    await saveTransacoesPorMes(transacoesAtualizadas);

    return { success: true, transacoesAtualizadas: contador };
  } catch (error) {
    console.error("Erro ao editar tag:", error);
    return { success: false, error: "Erro ao atualizar tag" };
  }
};

/**
 * ✨ NOVO: Remove uma tag de uma categoria
 */
export const deleteTag = async (
  categoria: keyof TagsPorCategoria,
  nomeTag: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const tags = await getTags();
    const index = tags[categoria].indexOf(nomeTag);

    if (index === -1) {
      return { success: false, error: "Tag não encontrada" };
    }

    tags[categoria].splice(index, 1);
    await setTags(tags);

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar tag:", error);
    return { success: false, error: "Erro ao remover tag" };
  }
};

/**
 * ✨ NOVO: Retorna apenas as tags de uma categoria específica
 */
export const getTagsCategoria = async (
  categoria: keyof TagsPorCategoria
): Promise<string[]> => {
  try {
    const tags = await getTags();
    return tags[categoria] || [];
  } catch (error) {
    console.error("Erro ao buscar tags da categoria:", error);
    return [];
  }
};

// ==================== SALDO INICIAL ====================

/**
 * ✨ NOVO: Cria a tag "Saldo Inicial" se não existir
 */
export const criarTagSaldoInicial = async (): Promise<void> => {
  try {
    const tags = await getTags();

    // Verifica se tag já existe
    if (!tags.entradas.includes("Saldo Inicial")) {
      tags.entradas.push("Saldo Inicial");
      await setTags(tags);
    }
  } catch (error) {
    console.error("Erro ao criar tag Saldo Inicial:", error);
    throw error;
  }
};

/**
 * ✨ NOVO: Cria a transação de saldo inicial
 */
export const criarTransacaoSaldoInicial = async (
  valor: number,
  data: string
): Promise<void> => {
  try {
    const transacao: Transacao = {
      id: `saldo-inicial-${Date.now()}`,
      valor,
      data,
      categoria: "entradas",
      tag: "Saldo Inicial",
      descricao: "Saldo inicial da conta",
      recorrencia: "unica",
    };

    await addTransacao(transacao);
  } catch (error) {
    console.error("Erro ao criar transação de saldo inicial:", error);
    throw error;
  }
};

/**
 * ✨ NOVO: Verifica se já existe transação de saldo inicial
 */
export const existeTransacaoSaldoInicial = async (): Promise<boolean> => {
  try {
    const transacoes = await getTransacoes();
    return transacoes.some(
      (t) => t.categoria === "entradas" && t.tag === "Saldo Inicial"
    );
  } catch (error) {
    console.error("Erro ao verificar transação de saldo inicial:", error);
    return false;
  }
};