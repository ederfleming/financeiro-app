export type Categoria =
  | "entradas"
  | "saidas"
  | "diarios"
  | "cartao"
  | "economia"
  | "todas";

export interface Transacao {
  id: string;
  valor: number;
  data: string; // YYYY-MM-DD
  categoria: Categoria;
  tag: string;
  descricao: string;
}

export interface Config {
  saldoInicial: number;
  gastoDiarioPadrao: number;
  percentualEconomia: number;
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
