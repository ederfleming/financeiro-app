import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

interface ProgressBarProps {
  percentual: number; // 0 a 100
  cor: string;
  altura?: number;
  mostrarPercentual?: boolean;
}

export default function ProgressBar({
  percentual,
  cor,
  altura = 12,
  mostrarPercentual = true,
}: ProgressBarProps) {
  const percentualLimitado = Math.max(0, Math.min(100, percentual));

  return (
    <View style={styles.container}>
      <View style={[styles.barraFundo, { height: altura }]}>
        <View
          style={[
            styles.barraPreenchida,
            {
              width: `${percentualLimitado}%`,
              backgroundColor: cor,
              height: altura,
            },
          ]}
        />
      </View>
      {mostrarPercentual && (
        <Text style={styles.percentualTexto}>{percentualLimitado}%</Text>
      )}
    </View>
  );
}
