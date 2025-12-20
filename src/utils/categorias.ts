import { colors } from "@/theme/colors";
import { Categoria } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export const categorias = [
  {
    key: "entradas" as const,
    label: "Entradas",
    icon: "arrow-down-circle" as keyof typeof Ionicons.glyphMap,
    color: colors.green[500],
  },
  {
    key: "saidas" as const,
    label: "Saídas",
    icon: "arrow-up-circle" as keyof typeof Ionicons.glyphMap,
    color: colors.red[700],
  },
  {
    key: "diarios" as const,
    label: "Diários",
    icon: "cart-outline" as keyof typeof Ionicons.glyphMap,
    color: colors.orange[300],
  },
  {
    key: "cartao" as const,
    label: "Cartão",
    icon: "card-outline" as keyof typeof Ionicons.glyphMap,
    color: colors.purple[500],
  },
  {
    key: "economia" as const,
    label: "Economia",
    icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
    color: colors.green[900],
  },
  {
    key: "todas" as const,
    label: "Todas",
    icon: "apps" as keyof typeof Ionicons.glyphMap,
    color: colors.blue[300],
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
