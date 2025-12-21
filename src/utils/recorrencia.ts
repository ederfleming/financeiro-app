import { Recorrencia, Transacao } from "@/types";
import { formatDate, parseDate } from "./dateUtils";

/**
 * Calcula a próxima data de ocorrência baseada na recorrência
 */
export const calcularProximaData = (
  dataInicial: string,
  recorrencia: Recorrencia
): string | null => {
  const data = parseDate(dataInicial);

  switch (recorrencia) {
    case "unica":
      return null;

    case "diaria": // ✅ Adicionar
      data.setDate(data.getDate() + 1);
      return formatDate(data);

    case "semanal":
      data.setDate(data.getDate() + 7);
      return formatDate(data);

    case "quinzenal":
      data.setDate(data.getDate() + 14);
      return formatDate(data);

    case "cada21dias":
      data.setDate(data.getDate() + 21);
      return formatDate(data);

    case "cada28dias":
      data.setDate(data.getDate() + 28);
      return formatDate(data);

    case "mensal":
      data.setMonth(data.getMonth() + 1);
      return formatDate(data);

    default:
      return null;
  }
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
const verificaSeDataCorresponde = (
  transacao: Transacao,
  dataAlvo: Date
): boolean => {
  const dataInicio = new Date(transacao.data + "T00:00:00");
  const diffTime = dataAlvo.getTime() - dataInicio.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (transacao.recorrencia) {
    case "diaria":
      return diffDays >= 0;
    case "semanal":
      return diffDays >= 0 && diffDays % 7 === 0;
    case "quinzenal":
      return diffDays >= 0 && diffDays % 15 === 0;
    case "cada21dias":
      return diffDays >= 0 && diffDays % 21 === 0;
    case "cada28dias":
      return diffDays >= 0 && diffDays % 28 === 0;
    case "mensal":
      return (
        diffDays >= 0 &&
        dataAlvo.getDate() === dataInicio.getDate() &&
        (dataAlvo.getMonth() >= dataInicio.getMonth() ||
          dataAlvo.getFullYear() > dataInicio.getFullYear())
      );
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