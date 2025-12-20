import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { colors } from "@/theme/colors";
import { Categoria } from "@/types";
import { styles } from "./styles";

export interface CategoriaFiltro {
  key: Categoria | "todas";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface FiltrosCategoriasProps {
  categorias: CategoriaFiltro[];
  categoriaSelecionada: Categoria | "todas";
  onSelecionar: (categoria: Categoria | "todas") => void;
}

export default function FiltrosCategorias({
  categorias,
  categoriaSelecionada,
  onSelecionar,
}: FiltrosCategoriasProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categorias.map((cat) => {
        const isSelected = categoriaSelecionada === cat.key;

        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filtroButton,
              isSelected && { backgroundColor: cat.color },
            ]}
            onPress={() => onSelecionar(cat.key)}
          >
            <Ionicons
              name={cat.icon}
              size={20}
              color={isSelected ? colors.white : cat.color}
            />
            <Text
              style={[
                styles.filtroTexto,
                isSelected && styles.filtroTextoActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
