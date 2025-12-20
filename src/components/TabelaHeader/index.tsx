import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

interface TabelaHeaderColumn {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  width?: number | "flex";
  align?: "left" | "center" | "right";
}

interface TabelaHeaderProps {
  columns: TabelaHeaderColumn[];
}

export default function TabelaHeader({ columns }: TabelaHeaderProps) {
  return (
    <View style={styles.container}>
      {columns.map((column) => {
        const columnStyle = [
          styles.column,
          column.width === "flex" && styles.columnFlex,
          column.width &&
            typeof column.width === "number" && { width: column.width },
          column.align === "center" && styles.columnCenter,
          column.align === "right" && styles.columnRight,
        ];

        return (
          <View key={column.key} style={columnStyle}>
            {column.icon && (
              <Ionicons
                name={column.icon}
                size={16}
                color={colors.gray[600]}
                style={styles.icon}
              />
            )}
            <Text style={styles.headerTexto}>{column.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
