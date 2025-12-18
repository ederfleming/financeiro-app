import { colors } from "@/theme/colors";
import { Categoria } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export const categorias: Array<{
  key: Categoria;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = [
  {
    key: "entradas",
    label: "Entradas",
    icon: "arrow-down-circle",
    color: colors.entradas,
  },
  {
    key: "saidas",
    label: "Saídas",
    icon: "arrow-up-circle",
    color: colors.saidas,
  },
  {
    key: "diarios",
    label: "Gastos Diários",
    icon: "calendar",
    color: colors.diarios,
  },
  {
    key: "cartao",
    label: "Cartão de crédito",
    icon: "card",
    color: colors.cartao,
  },
  {
    key: "economia",
    label: "Economia",
    icon: "wallet",
    color: colors.economia,
  },
  { key: "todas", label: "Todas", icon: "apps", color: colors.todas },
];
