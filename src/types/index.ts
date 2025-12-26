export type Categoria =
  | "entradas"
  | "saidas"
  | "diarios"
  | "cartao"
  | "economia";

export type Recorrencia =
  | "unica"
  | "diaria"
  | "semanal"
  | "quinzenal"
  | "cada21dias"
  | "cada28dias"
  | "mensal";

// ==================== TAGS POR CATEGORIA ====================
export interface TagsPorCategoria {
  entradas: string[];
  saidas: string[];
  diarios: string[];
  cartao: string[];
  economia: string[];
}

export interface Transacao {
  id: string;
  valor: number;
  data: string; // YYYY-MM-DD - Data inicial da recorrência
  categoria: Categoria;
  tag?: string;
  descricao: string;
  recorrencia: Recorrencia;
  datasExcluidas?: string[]; // Datas específicas onde a recorrência foi excluída
  dataFimRecorrencia?: string; // ✨ NOVO: Data final da recorrência (YYYY-MM-DD)
  edicoesEspecificas?: {
    [data: string]: Partial<
      Omit<
        Transacao,
        | "id"
        | "recorrencia"
        | "datasExcluidas"
        | "edicoesEspecificas"
        | "dataFimRecorrencia"
      >
    >;
  };
}

export interface GastoVariavel {
  id: string;
  titulo: string;
  descricao?: string;
  valor: number;
}

export interface Config {
  saldoInicial: number;
  dataInicial: string;
  gastosVariaveis: GastoVariavel[]; // ✨ NOVO
  diasParaDivisao: 28 | 30 | 31; // ✨ NOVO
  gastoDiarioPadrao: number; // Calculado automaticamente
  percentualEconomia: number;
  onboardingCompleto: boolean;
}

export interface DiaData {
  data: string; // YYYY-MM-DD
  conciliado: boolean;
  transacoes: Transacao[];
}

export interface SaldoDia {
  dia: number;
  entradas: number;
  saidas: number;
  diarios: number;
  cartao: number;
  economia: number;
  saldoAcumulado: number;
  conciliado: boolean;
}
