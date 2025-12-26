import { Categoria, Config, Transacao } from "@/types";
import { getTransacoesAplicaveisNaData } from "./recorrencia";

/**
 * Interface para totais do mês
 */
export interface TotaisMes {
  entradas: number;
  saidas: number;
  diarios: number;
  cartao: number;
  economia: number;
}

/**
 * Interface para tag com total
 */
export interface TagTotal {
  nome: string;
  valor: number;
  percentual: number;
}

/**
 * Interface para totais agrupados por categoria
 */
export interface TotaisPorCategoria {
  categoria: Categoria;
  total: number;
  tags: TagTotal[];
}

/**
 * Calcula os totais de todas as categorias para um mês específico
 */

export const calcularTotaisMes = (
  transacoes: Transacao[],
  year: number,
  month: number,
  config: Config
): TotaisMes => {
  const totais: TotaisMes = {
    entradas: 0,
    saidas: 0,
    diarios: 0,
    cartao: 0,
    economia: 0,
  };

  const ultimoDia = new Date(year, month + 1, 0).getDate();

  let contagemEntradas = 0;

  // Itera por todos os dias do mês
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    const transacoesDoDia = getTransacoesAplicaveisNaData(transacoes, data);

    const entradasDoDia = transacoesDoDia.filter(
      (t) => t.categoria === "entradas"
    );

    if (entradasDoDia.length > 0) {
      entradasDoDia.forEach((t) => {
        contagemEntradas++;
      });
    }

    // Soma por categoria
    transacoesDoDia.forEach((t) => {
      totais[t.categoria] += t.valor;
    });
  }

  // Normaliza valores (2 casas decimais)
  Object.keys(totais).forEach((key) => {
    totais[key as Categoria] = Math.round(totais[key as Categoria] * 100) / 100;
  });

  return totais;
};

/**
 * Agrupa transações por tag dentro de uma categoria
 */
export const agruparPorTags = (
  transacoes: Transacao[],
  categoria: Categoria,
  year: number,
  month: number
): TagTotal[] => {
  const agrupamento: { [tag: string]: number } = {};
  let totalCategoria = 0;

  const ultimoDia = new Date(year, month + 1, 0).getDate();

  // Itera por todos os dias do mês
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    const transacoesDoDia = getTransacoesAplicaveisNaData(transacoes, data);

    // Filtra por categoria e agrupa por tag
    transacoesDoDia
      .filter((t) => t.categoria === categoria)
      .forEach((t) => {
        const tagNome = t.tag || "Sem tag";
        agrupamento[tagNome] = (agrupamento[tagNome] || 0) + t.valor;
        totalCategoria += t.valor;
      });
  }

  // Converte para array e calcula percentuais
  const tags: TagTotal[] = Object.entries(agrupamento)
    .map(([nome, valor]) => ({
      nome,
      valor: Math.round(valor * 100) / 100,
      percentual:
        totalCategoria > 0 ? Math.round((valor / totalCategoria) * 100) : 0,
    }))
    .sort((a, b) => b.valor - a.valor); // Ordena por valor decrescente

  return tags;
};

/**
 * Calcula totais por categoria com tags
 */
export const calcularTotaisPorCategoria = (
  transacoes: Transacao[],
  year: number,
  month: number,
  config: Config
): TotaisPorCategoria[] => {
  const totaisMes = calcularTotaisMes(transacoes, year, month, config);
  const categorias: Categoria[] = [
    "entradas",
    "saidas",
    "diarios",
    "cartao",
    "economia",
  ];

  return categorias.map((categoria) => ({
    categoria,
    total: totaisMes[categoria],
    tags: agruparPorTags(transacoes, categoria, year, month),
  }));
};

/**
 * Calcula a performance do mês (entradas - gastos)
 */
export const calcularPerformance = (totais: TotaisMes): number => {
  const gastos =
    totais.saidas + totais.diarios + totais.cartao + totais.economia;
  return Math.round((totais.entradas - gastos) * 100) / 100;
};

/**
 * Retorna o status da performance
 */
export const getStatusPerformance = (
  performance: number
): {
  texto: string;
  cor: string;
} => {
  if (performance > 0) {
    return {
      texto: "Sobrou dinheiro",
      cor: "#00A933", // colors.green[500]
    };
  } else if (performance < 0) {
    return {
      texto: "Faltou dinheiro",
      cor: "#F44336", // colors.red[500]
    };
  } else {
    return {
      texto: "Zero a zero",
      cor: "#666666", // colors.gray[600]
    };
  }
};

/**
 * Calcula o custo de vida (saídas + diários + cartão)
 */
export const calcularCustoDeVida = (totais: TotaisMes): number => {
  return (
    Math.round((totais.saidas + totais.diarios + totais.cartao) * 100) / 100
  );
};

/**
 * Retorna o status do custo de vida em relação às entradas
 */
export const getStatusCustoDeVida = (
  custoDeVida: number,
  entradas: number
): {
  texto: string;
  cor: string;
} => {
  if (entradas === 0) {
    return {
      texto: "Sem entradas cadastradas",
      cor: "#666666", // colors.gray[600]
    };
  }

  const percentual = (custoDeVida / entradas) * 100;

  if (percentual <= 80) {
    return {
      texto: "Dentro da renda",
      cor: "#00A933", // colors.green[500]
    };
  } else if (percentual <= 100) {
    return {
      texto: "Fora da renda",
      cor: "#FFC107", // colors.yellow[500]
    };
  } else {
    return {
      texto: "Muito fora da renda",
      cor: "#F44336", // colors.red[500]
    };
  }
};

/**
 * Calcula o diário médio (soma de gastos diários / dia atual do mês)
 */
export const calcularDiarioMedio = (
  transacoes: Transacao[],
  year: number,
  month: number,
  diaAtual: number
): number => {
  let totalDiarios = 0;

  // Soma gastos diários até o dia atual
  for (let dia = 1; dia <= diaAtual; dia++) {
    const data = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    const transacoesDoDia = getTransacoesAplicaveisNaData(transacoes, data);

    transacoesDoDia
      .filter((t) => t.categoria === "diarios")
      .forEach((t) => {
        totalDiarios += t.valor;
      });
  }

  const media = diaAtual > 0 ? totalDiarios / diaAtual : 0;
  return Math.round(media * 100) / 100;
};

/**
 * Retorna a cor da barra do diário médio baseado na comparação
 */
export const getCorBarraDiarioMedio = (
  diarioMedio: number,
  gastoDiarioPadrao: number
): string => {
  if (diarioMedio <= gastoDiarioPadrao) {
    return "#00A933"; // Verde (dentro)
  } else if (diarioMedio <= gastoDiarioPadrao * 1.2) {
    return "#FFC107"; // Amarelo (atenção - até 20% acima)
  } else {
    return "#F44336"; // Vermelho (muito acima)
  }
};

/**
 * Calcula o percentual economizado em relação à meta
 */
export const calcularPercentualEconomizado = (
  economiaReal: number,
  entradas: number,
  percentualMeta: number
): number => {
  if (entradas === 0 || percentualMeta === 0) return 0;

  const metaEmReais = (entradas * percentualMeta) / 100;
  const percentualEconomizado = (economiaReal / metaEmReais) * 100;

  return Math.round(Math.min(percentualEconomizado, 100));
};

/**
 * Retorna frase motivacional baseada no percentual de economia
 */
export const getFraseMotivacional = (percentual: number): string => {
  if (percentual === 0) {
    return "Todo começo é importante! Comece a economizar hoje";
  } else if (percentual <= 20) {
    return "Você deu o primeiro passo! Continue economizando";
  } else if (percentual <= 50) {
    return "Você está no caminho certo! Siga em frente";
  } else if (percentual <= 80) {
    return "Ótimo progresso! Você está quase lá";
  } else if (percentual < 100) {
    return "Incrível! Falta pouco para alcançar sua meta";
  } else {
    return "Parabéns! Você alcançou sua meta! 🎉";
  }
};

/**
 * Retorna o dia atual do mês considerando o mês selecionado
 */
export const getDiaAtualDoMes = (year: number, month: number): number => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Se for o mês/ano atual, retorna o dia atual
  if (year === anoAtual && month === mesAtual) {
    return hoje.getDate();
  }

  // Se for mês passado, retorna último dia do mês
  if (year < anoAtual || (year === anoAtual && month < mesAtual)) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Se for mês futuro, retorna 0 (não há gastos reais ainda)
  return 0;
};
