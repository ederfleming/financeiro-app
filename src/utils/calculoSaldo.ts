import { Config, SaldoDia, Transacao } from "@/types";
import { formatDate, isFutura, isHoje } from "./dateUtils";
import { getTransacoesAplicaveisNaData } from "./recorrencia";

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

  // Filtra transações aplicáveis à data (incluindo recorrentes)
  const transacoesAplicaveis = getTransacoesAplicaveisNaData(transacoes, data);

  // Calcula os totais por categoria
  transacoesAplicaveis.forEach((t) => {
    if (t.categoria === "diarios") {
      totais.diarios += t.valor;
    } else {
      totais[t.categoria] += t.valor;
    }
  });

  // ✨ LÓGICA DO GASTO DIÁRIO PADRÃO
  const gastoDiarioReal = totais.diarios;

  // Verifica se o dia está antes da dataInicial configurada
  if (data < config.dataInicial) {
    totais.diarios = 0; // Dias antes da config ficam zerados
  }
  // Se não tem gasto real E (é hoje OU é futuro) → usa estimativa
  else if (gastoDiarioReal === 0 && (isHoje(data) || isFutura(data))) {
    totais.diarios = config.gastoDiarioPadrao;
  }
  // Se não tem gasto real E é passado → fica zero
  else if (gastoDiarioReal === 0) {
    totais.diarios = 0;
  }
  // Se tem gasto real → usa o real (qualquer dia)
  else {
    totais.diarios = gastoDiarioReal;
  }

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
  config: Config
): number => {
  // Se é o mês/ano da data inicial configurada, retorna o saldo inicial
  const dataInicialConfig = new Date(config.dataInicial);
  const anoInicial = dataInicialConfig.getFullYear();
  const mesInicial = dataInicialConfig.getMonth();

  // ✅ Se é o mês inicial ou anterior a ele, usa o saldo inicial da config
  if (year < anoInicial || (year === anoInicial && month <= mesInicial)) {
    return config.saldoInicial;
  }

  // Calcula o mês anterior
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

  // Calcula todos os saldos do mês anterior recursivamente
  let saldoAcumulado = calcularSaldoMesAnterior(
    anoAnterior,
    mesAnterior,
    transacoes,
    diasConciliados,
    config
  );

  datasMesAnterior.forEach((data) => {
    const totais = calcularTotaisDia(data, transacoes, config);

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

  // ✅ Busca o saldo inicial do mês (que é o saldo final do mês anterior)
  let saldoAcumulado = calcularSaldoMesAnterior(
    year,
    month,
    transacoes,
    diasConciliados,
    config
  );

  datas.forEach((data) => {
    const totais = calcularTotaisDia(data, transacoes, config);

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