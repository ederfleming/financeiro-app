import { Recorrencia, Transacao } from "@/types";
import { parseDate } from "./dateUtils";

/**
 * Calcula a próxima data de ocorrência baseada na recorrência
 */
export const calcularProximaData = (
  dataInicial: string, // Espera "2023-12-25"
  recorrencia: Recorrencia
): string | null => {
  // 1. Quebramos a string manualmente para evitar o comportamento UTC do construtor Date
  const partes = dataInicial.split("-");
  const ano = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // Meses em JS começam em 0
  const dia = parseInt(partes[2], 10);

  // 2. Criamos a data no fuso local
  const data = new Date(ano, mes, dia);

  // Resetamos o horário para meio-dia (12:00:00)
  // Isso cria uma "margem de segurança". Mesmo que o fuso mude 1 ou 2 horas,
  // a data continuará sendo a mesma dentro do ciclo de 24h.
  data.setHours(12, 0, 0, 0);

  switch (recorrencia) {
    case "unica":
      return null;
    case "diaria":
      data.setDate(data.getDate() + 1);
      break;
    case "semanal":
      data.setDate(data.getDate() + 7);
      break;
    case "quinzenal":
      data.setDate(data.getDate() + 14);
      break;
    case "cada21dias":
      data.setDate(data.getDate() + 21);
      break;
    case "cada28dias":
      data.setDate(data.getDate() + 28);
      break;
    case "mensal":
      const diaDesejado = data.getDate();
      data.setMonth(data.getMonth() + 1);
      // Se o mês seguinte não tiver o dia (ex: 31 de jan -> 31 de fev),
      // o setDate(0) volta para o último dia do mês correto.
      if (data.getDate() !== diaDesejado) {
        data.setDate(0);
      }
      break;
    default:
      return null;
  }

  // 3. Formatação Manual (NUNCA use toISOString() aqui, pois ele volta para UTC)
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

/**
 * Verifica se uma transação recorrente deve aparecer em uma data específica
 */
export const transacaoAplicavelNaData = (
  transacao: Transacao,
  dataAlvo: string
): boolean => {
  // Se a data está na lista de exclusões, não aplica
  if (transacao.datasExcluidas?.includes(dataAlvo)) {
    return false;
  }

  if (transacao.recorrencia === "unica") {
    return transacao.data === dataAlvo;
  }

  const dataTransacao = parseDate(transacao.data);
  const dataAlvoDate = parseDate(dataAlvo);

  // ✅ IMPORTANTE: Recorrência só funciona pra frente, não pra trás
  if (dataAlvoDate < dataTransacao) {
    return false;
  }

  // Se é a mesma data, aplica
  if (transacao.data === dataAlvo) {
    return true;
  }

  const diffTime = dataAlvoDate.getTime() - dataTransacao.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (transacao.recorrencia) {
    case "diaria": // ✅ Adicionar - todos os dias
      return true; // Sempre aplica para qualquer dia futuro

    case "semanal":
      return diffDays % 7 === 0;

    case "quinzenal":
      return diffDays % 14 === 0;

    case "cada21dias":
      return diffDays % 21 === 0;

    case "cada28dias":
      return diffDays % 28 === 0;

    case "mensal":
      // Verifica se é o mesmo dia do mês
      return dataTransacao.getDate() === dataAlvoDate.getDate();

    default:
      return false;
  }
};

/**
 * Verifica se uma transação recorrente deve aparecer em uma data específica
 * Agora considera o campo dataFimRecorrencia
 */
export const getTransacoesAplicaveisNaData = (
  transacoes: Transacao[],
  data: string
): Transacao[] => {
  const dataAlvo = new Date(data + "T00:00:00");
  const resultado: Transacao[] = [];

  transacoes.forEach((transacao) => {
    const dataInicio = new Date(transacao.data + "T00:00:00");

    // Verifica se a data alvo é anterior ao início da recorrência
    if (dataAlvo < dataInicio) {
      return;
    }

    // ✨ NOVO: Verifica se a recorrência foi encerrada
    if (transacao.dataFimRecorrencia) {
      const dataFim = new Date(transacao.dataFimRecorrencia + "T00:00:00");
      if (dataAlvo > dataFim) {
        return; // Data alvo está após o fim da recorrência
      }
    }

    // Verifica se a data está na lista de exclusões
    if (transacao.datasExcluidas?.includes(data)) {
      return;
    }

    // Verifica se a transação se aplica nesta data baseado na recorrência
    if (transacao.recorrencia === "unica") {
      if (transacao.data === data) {
        resultado.push(aplicarEdicaoEspecifica(transacao, data));
      }
      return;
    }

    // Lógica de recorrência (diaria, semanal, etc.)
    if (verificaSeDataCorresponde(transacao, dataAlvo)) {
      resultado.push(aplicarEdicaoEspecifica(transacao, data));
    }
  });

  return resultado;
};

// Função auxiliar para verificar se data corresponde à recorrência
// Função auxiliar para garantir que o cálculo de dias seja exato e ignore horas/fuso
const getDiffDays = (d1: Date, d2: Date): number => {
  const UTC1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const UTC2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((UTC1 - UTC2) / (1000 * 60 * 60 * 24));
};

const verificaSeDataCorresponde = (
  transacao: Transacao,
  dataAlvo: Date
): boolean => {
  // Criar data de início ignorando horas
  const partes = transacao.data.split("-");
  const dataInicio = new Date(
    parseInt(partes[0]),
    parseInt(partes[1]) - 1,
    parseInt(partes[2])
  );

  const diffDays = getDiffDays(dataAlvo, dataInicio);

  if (diffDays < 0) return false;

  switch (transacao.recorrencia) {
    case "diaria":
      return true;
    case "semanal":
      return diffDays % 7 === 0;
    case "quinzenal":
      return diffDays % 14 === 0; // ✅ CORRIGIDO: de 15 para 14
    case "cada21dias":
      return diffDays % 21 === 0;
    case "cada28dias":
      return diffDays % 28 === 0;
    case "mensal":
      // Para mensal, comparamos o dia do mês diretamente
      return dataAlvo.getDate() === dataInicio.getDate();
    default:
      return false;
  }
};
// Aplica edições específicas se existirem
const aplicarEdicaoEspecifica = (
  transacao: Transacao,
  data: string
): Transacao => {
  if (transacao.edicoesEspecificas?.[data]) {
    return {
      ...transacao,
      ...transacao.edicoesEspecificas[data],
    };
  }
  return transacao;
};