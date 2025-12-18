import { colors } from "@/theme/colors";
import { Categoria } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export const categorias = [
  {
    key: "entradas" as const,
    label: "Entradas",
    icon: "arrow-down-circle" as keyof typeof Ionicons.glyphMap,
    color: colors.entradas,
  },
  {
    key: "saidas" as const,
    label: "Saídas",
    icon: "arrow-up-circle" as keyof typeof Ionicons.glyphMap,
    color: colors.saidas,
  },
  {
    key: "diarios" as const,
    label: "Diários",
    icon: "calendar" as keyof typeof Ionicons.glyphMap,
    color: colors.diarios,
  },
  {
    key: "cartao" as const,
    label: "Cartão",
    icon: "card" as keyof typeof Ionicons.glyphMap,
    color: colors.cartao,
  },
  {
    key: "economia" as const,
    label: "Economia",
    icon: "wallet" as keyof typeof Ionicons.glyphMap,
    color: colors.economia,
  },
  {
    key: "todas" as const,
    label: "Todas",
    icon: "apps" as keyof typeof Ionicons.glyphMap,
    color: colors.todas,
  },
];

// Exportar categorias sem "todas" para uso no cadastro
export const categoriasParaCadastro = categorias.filter(
  (item) => item.key !== "todas"
) as Array<{
  key: Categoria;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}>;
