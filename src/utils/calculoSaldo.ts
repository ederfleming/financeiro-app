import { Config, SaldoDia, Transacao } from "@/types";
import { formatDate, isFutura, isHoje } from "./dateUtils";
import { getTransacoesAplicaveisNaData } from "./recorrencia";

/**
 * Normaliza valores monetários (2 casas)
 */
const normalizar = (valor: number) =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

/**
 * Calcula os totais de transações por categoria para um dia específico
 */
export const calcularTotaisDia = (
  data: string,
  transacoes: Transacao[],
  config: Config
) => {
  const totais = {
    entradas: 0,
    saidas: 0,
    diarios: 0,
    cartao: 0,
    economia: 0,
  };

  const transacoesAplicaveis = getTransacoesAplicaveisNaData(transacoes, data);

  // Soma por categoria (normalizando na soma)
  transacoesAplicaveis.forEach((t) => {
    if (t.categoria === "diarios") {
      totais.diarios = normalizar(totais.diarios + t.valor);
    } else {
      totais[t.categoria] = normalizar(totais[t.categoria] + t.valor);
    }
  });

  const gastoDiarioReal = totais.diarios;

  // Lógica do gasto diário padrão
  if (data < config.dataInicial) {
    totais.diarios = 0;
  } else if (gastoDiarioReal === 0 && (isHoje(data) || isFutura(data))) {
    totais.diarios = normalizar(config.gastoDiarioPadrao);
  } else if (gastoDiarioReal === 0) {
    totais.diarios = 0;
  } else {
    totais.diarios = normalizar(gastoDiarioReal);
  }

  return totais;
};

/**
 * Calcula o saldo de um dia específico
 * (FUNÇÃO PURA — NÃO NORMALIZAR AQUI)
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
  config: Config
): number => {
  const dataInicialConfig = new Date(config.dataInicial);
  const anoInicial = dataInicialConfig.getFullYear();
  const mesInicial = dataInicialConfig.getMonth();

  // if (year < anoInicial || (year === anoInicial && month <= mesInicial)) {
  //   return normalizar(config.saldoInicial);
  // }

  // ✨ CORRIGIDO: Se é o mês inicial ou anterior, retorna 0
  // O saldo inicial virá da TRANSAÇÃO, não do config
  if (year < anoInicial || (year === anoInicial && month <= mesInicial)) {
    return 0; // ← MUDOU de config.saldoInicial para 0
  }

  const mesAnterior = month === 0 ? 11 : month - 1;
  const anoAnterior = month === 0 ? year - 1 : year;

  const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();

  let saldoAcumulado = calcularSaldoMesAnterior(
    anoAnterior,
    mesAnterior,
    transacoes,
    diasConciliados,
    config
  );

  for (let dia = 1; dia <= ultimoDiaMesAnterior; dia++) {
    const data = formatDate(new Date(anoAnterior, mesAnterior, dia));
    const totais = calcularTotaisDia(data, transacoes, config);

    saldoAcumulado = normalizar(
      calcularSaldoDia(
        saldoAcumulado,
        totais.entradas,
        totais.saidas,
        totais.diarios,
        totais.cartao,
        totais.economia
      )
    );
  }

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

  let saldoAcumulado = normalizar(
    calcularSaldoMesAnterior(year, month, transacoes, diasConciliados, config)
  );

  datas.forEach((data) => {
    const totais = calcularTotaisDia(data, transacoes, config);

    saldoAcumulado = normalizar(
      calcularSaldoDia(
        saldoAcumulado,
        totais.entradas,
        totais.saidas,
        totais.diarios,
        totais.cartao,
        totais.economia
      )
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
 * Calcula os saldos de todos os dias de um mês específico para o Panorama
 */
export const calcularSaldosTrimestre = (
  year: number,
  month: number,
  transacoes: Transacao[],
  diasConciliados: string[],
  config: Config
): SaldoDia[] => {
  const saldos: SaldoDia[] = [];

  const ultimoDia = new Date(year, month + 1, 0).getDate();

  let saldoAcumulado = normalizar(
    calcularSaldoMesAnterior(year, month, transacoes, diasConciliados, config)
  );

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = formatDate(new Date(year, month, dia));
    const totais = calcularTotaisDia(data, transacoes, config);

    saldoAcumulado = normalizar(
      calcularSaldoDia(
        saldoAcumulado,
        totais.entradas,
        totais.saidas,
        totais.diarios,
        totais.cartao,
        totais.economia
      )
    );

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
  }

  return saldos;
};

/**
 * Formatação
 */
export const formatarMoeda = (valor: number): string =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const formatarMoedaAbreviada = (valor: number): string => {
  const abs = Math.abs(valor);

  if (abs < 1000) {
    return `R$ ${Math.trunc(valor).toLocaleString("pt-BR")}`;
  }

  const inteiro = Math.trunc(valor);
  const milhares = Math.trunc(inteiro / 10) / 100;

  return `R$ ${milhares.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}k`;
};
