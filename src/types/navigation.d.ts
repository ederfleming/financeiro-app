import { Categoria } from "./index";

export type RootStackParamList = {
  Login: undefined;
  ConfiguracaoInicial: undefined;
  MainTabs: undefined;
  Menu: undefined;
  PrevisaoGastoDiario: undefined; // ← NOVA ROTA
  Cadastro: {
    data?: string; // YYYY-MM-DD
    categoria?: Categoria;
    transacaoId?: string; // Para edição
  };
  Detalhes: {
    data: string; // YYYY-MM-DD
    filter: string; // filtro selecionado
  };
};

export type TabParamList = {
  Saldos: undefined;
  Totais: undefined;
  AddPlaceholder: undefined;
  Panoramas: undefined;
  Tags: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps;
BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>;
