import { Categoria } from "./index";

export type RootStackParamList = {
  MainTabs: undefined;
  Menu: undefined;
  Cadastro: {
    data?: string; // YYYY-MM-DD
    categoria?: Categoria;
  };
};

export type TabParamList = {
  Saldos: undefined;
  Totais: undefined;
  AddPlaceholder: undefined;
  Projeção: undefined;
  Tags: undefined;
};
