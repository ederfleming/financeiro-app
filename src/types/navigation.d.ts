import { Categoria } from "./index";

export type RootStackParamList = {
  Login: undefined; // ✅ Adicionar
  ConfiguracaoInicial: undefined; // ✅ Adicionar
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
  Panoramas: undefined;
  Tags: undefined;
};


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}