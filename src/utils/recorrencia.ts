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
 * Filtra transações que se aplicam a uma data específica (incluindo recorrentes)
 * e aplica edições específicas se houver
 */
export const getTransacoesAplicaveisNaData = (
  todasTransacoes: Transacao[],
  data: string
): Transacao[] => {
  return todasTransacoes
    .filter((transacao) => transacaoAplicavelNaData(transacao, data))
    .map((transacao) => {
      // Se há edição específica para esta data, aplica
      if (transacao.edicoesEspecificas?.[data]) {
        return {
          ...transacao,
          ...transacao.edicoesEspecificas[data],
        };
      }
      return transacao;
    });
};