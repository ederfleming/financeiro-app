import { Config, SaldoDia, Transacao } from "@/types";
import { formatDate } from "./dateUtils";
import { getTransacoesAplicaveisNaData } from "./recorrencia";

/**
 * Calcula os totais de transações por categoria para um dia específico
 */
export const calcularTotaisDia = (data: string, transacoes: Transacao[]) => {
  const totais = {
    entradas: 0,
    saidas: 0,
    diarios: 0,
    cartao: 0,
    economia: 0,
  };

  // Filtra transações aplicáveis à data (incluindo recorrentes)
  const transacoesAplicaveis = getTransacoesAplicaveisNaData(transacoes, data);

  transacoesAplicaveis.forEach((t) => {
    totais[t.categoria] += t.valor;
  });

  return totais;
};

/**
 * Calcula o saldo de um dia específico
 */
export const calcularSaldoDia = (
  saldoAnterior: number,
  entradas: number,
  saidas: number,
  diarios: number,
  cartao: number,
  economia: number
): number => {
  return saldoAnterior + entradas - saidas - diarios - cartao - economia;
};

/**
 * Calcula o saldo final do mês anterior
 */
export const calcularSaldoMesAnterior = (
  year: number,
  month: number,
  transacoes: Transacao[],
  diasConciliados: string[],
  saldoInicial: number
): number => {
  // Se é janeiro, volta para dezembro do ano anterior
  const mesAnterior = month === 0 ? 11 : month - 1;
  const anoAnterior = month === 0 ? year - 1 : year;

  // Pega o último dia do mês anterior
  const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();

  // Cria array de datas do mês anterior
  const datasMesAnterior: string[] = [];
  for (let dia = 1; dia <= ultimoDiaMesAnterior; dia++) {
    const data = new Date(anoAnterior, mesAnterior, dia);
    datasMesAnterior.push(formatDate(data));
  }

  // Calcula todos os saldos do mês anterior
  let saldoAcumulado = saldoInicial;

  datasMesAnterior.forEach((data) => {
    const totais = calcularTotaisDia(data, transacoes);

    saldoAcumulado = calcularSaldoDia(
      saldoAcumulado,
      totais.entradas,
      totais.saidas,
      totais.diarios,
      totais.cartao,
      totais.economia
    );
  });

  return saldoAcumulado;
};

/**
 * Calcula os saldos de todos os dias do mês
 */
export const calcularSaldosMes = (
  datas: string[],
  transacoes: Transacao[],
  diasConciliados: string[],
  config: Config,
  year: number,
  month: number
): SaldoDia[] => {
  const saldos: SaldoDia[] = [];

  // Busca o saldo inicial do mês (que é o saldo final do mês anterior)
  let saldoAcumulado = calcularSaldoMesAnterior(
    year,
    month,
    transacoes,
    diasConciliados,
    config.saldoInicial
  );

  datas.forEach((data) => {
    const totais = calcularTotaisDia(data, transacoes);

    saldoAcumulado = calcularSaldoDia(
      saldoAcumulado,
      totais.entradas,
      totais.saidas,
      totais.diarios,
      totais.cartao,
      totais.economia
    );

    const dia = parseInt(data.split("-")[2]);

    saldos.push({
      dia,
      entradas: totais.entradas,
      saidas: totais.saidas,
      diarios: totais.diarios,
      cartao: totais.cartao,
      economia: totais.economia,
      saldoAcumulado,
      conciliado: diasConciliados.includes(data),
    });
  });

  return saldos;
};

/**
 * Calcula o gasto diário médio do mês
 */
export const calcularGastoDiarioMedio = (
  transacoes: Transacao[],
  datas: string[]
): number => {
  const totalDiarios = transacoes
    .filter((t) => t.categoria === "diarios" && datas.includes(t.data))
    .reduce((sum, t) => sum + t.valor, 0);

  return datas.length > 0 ? totalDiarios / datas.length : 0;
};

/**
 * Formata valor para moeda brasileira
 */
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
