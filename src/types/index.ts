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
  data: string;
  categoria: Categoria;
  tag?: string;
  descricao: string;
  recorrencia: Recorrencia;
  datasExcluidas?: string[];
  dataFimRecorrencia?: string;
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
export interface UserProfile {
  nome: string;
  email: string;
  dataNascimento: string; // YYYY-MM-DD
}
export interface Config {
  perfil: UserProfile;
  saldoInicial: number;
  dataInicial: string;
  gastosVariaveis: GastoVariavel[];
  diasParaDivisao: 28 | 30 | 31;
  gastoDiarioPadrao: number;
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
