export type Categoria =
  | "entradas"
  | "saidas"
  | "diarios"
  | "cartao"
  | "economia"
  | "todas";

export type Recorrencia =
  | "unica"
  | "semanal"
  | "quinzenal"
  | "cada21dias"
  | "cada28dias"
  | "mensal";

export interface Transacao {
  id: string;
  valor: number;
  data: string; // YYYY-MM-DD - Data inicial da recorrência
  categoria: Categoria;
  tag?: string;
  descricao: string;
  recorrencia: Recorrencia;
  datasExcluidas?: string[]; // Datas específicas onde a recorrência foi excluída
  edicoesEspecificas?: {
    // Edições em datas específicas
    [data: string]: Partial<
      Omit<
        Transacao,
        "id" | "recorrencia" | "datasExcluidas" | "edicoesEspecificas"
      >
    >;
  };
}
export interface Config {
  saldoInicial: number;
  dataInicial: string; // ✅ Adicionar
  gastoDiarioPadrao: number;
  percentualEconomia: number;
  onboardingCompleto: boolean; // ✅ Adicionar
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
