import { Config, SaldoDia, Transacao } from "@/types";

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

  transacoes.forEach((t) => {
    if (t.data === data) {
      totais[t.categoria] += t.valor;
    }
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
 * Calcula os saldos de todos os dias do mês
 */
export const calcularSaldosMes = (
  datas: string[],
  transacoes: Transacao[],
  diasConciliados: string[],
  config: Config
): SaldoDia[] => {
  const saldos: SaldoDia[] = [];
  let saldoAcumulado = config.saldoInicial;

  datas.forEach((data, index) => {
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

