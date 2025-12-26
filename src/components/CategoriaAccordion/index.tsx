import { colors } from "@/theme/colors";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface TagTotal {
  nome: string;
  valor: number;
  percentual: number;
}

interface CategoriaAccordionProps {
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
  label: string;
  total: number;
  tags: TagTotal[];
}

export default function CategoriaAccordion({
  icone,
  cor,
  label,
  total,
  tags,
}: CategoriaAccordionProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header clicável */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpandido(!expandido)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name={icone} size={24} color={cor} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.total}>{formatarMoeda(total)}</Text>
          <Ionicons
            name={expandido ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.gray[400]}
          />
        </View>
      </TouchableOpacity>

      {/* Lista de tags (expandível) */}
      {expandido && tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <View style={styles.tagLeft}>
                <Ionicons name="pricetag" size={16} color={cor} />
                <Text style={styles.tagNome}>{tag.nome}</Text>
              </View>
              <View style={styles.tagRight}>
                <Text style={styles.tagValor}>{formatarMoeda(tag.valor)}</Text>
                <Text style={styles.tagPercentual}>({tag.percentual}%)</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
