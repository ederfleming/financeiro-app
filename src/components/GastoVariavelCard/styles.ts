// components/GastoVariavelCard/styles.ts
import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  // ✨ Novo estilo para o Título
  titulo: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray[900],
    marginBottom: 2,
  },
  // ✨ Ajustado para parecer uma descrição/apoio
  descricao: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray[500],
  },
  valor: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray[900],
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  deleteText: {
    fontSize: 14,
    color: colors.red[500],
    marginLeft: 8,
    fontWeight: "500",
  },
});
