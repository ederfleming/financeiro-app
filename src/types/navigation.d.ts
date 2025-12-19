import { Categoria } from "./index";

export type RootStackParamList = {
  MainTabs: undefined;
  Menu: undefined;
  Cadastro: {
    data?: string; // YYYY-MM-DD
    categoria?: Categoria;
    transacaoId?: string; // Para edição
  };
  Detalhes: {
    data: string; // YYYY-MM-DD
  };
};

export type TabParamList = {
  Saldos: undefined;
  Totais: undefined;
  AddPlaceholder: undefined;
  Projeção: undefined;
  Tags: undefined;
};


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}