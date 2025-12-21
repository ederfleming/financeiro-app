import { colors } from "@/theme/colors";
import { GastoVariavel } from "@/types";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface GastoVariavelCardProps {
  gasto: GastoVariavel;
  onDelete: (id: string) => void;
}

export default function GastoVariavelCard({
  gasto,
  onDelete,
}: GastoVariavelCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.yellow[300] }, // Cor da categoria 'diario'
          ]}
        >
          <Ionicons
            name="cart-outline" // Ícone representativo de gastos recorrentes/diários
            size={24}
            color={colors.yellow[500]}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.titulo}>{gasto.titulo}</Text>
          {/* Só renderiza a descrição se ela existir */}
          {gasto.descricao ? (
            <Text style={styles.descricao}>{gasto.descricao}</Text>
          ) : null}
        </View>

        <Text style={styles.valor}>{formatarMoeda(gasto.valor)}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(gasto.id)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.red[500]} />
        <Text style={styles.deleteText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
}