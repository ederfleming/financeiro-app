import { Ionicons } from "@expo/vector-icons";
import React, { Fragment, ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

interface CardMetricaProps {
  titulo: string;
  icones?: Array<{
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    description?: string;
  }>;
  iconSize?: number;
  valor?: string;
  valorCor?: string;
  subtitulo?: string;
  subtituloCor?: string;
  children?: ReactNode;
}

export default function CardMetrica({
  titulo,
  icones,
  iconSize = 18,
  valor,
  valorCor,
  subtitulo,
  subtituloCor,
  children,
}: CardMetricaProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        {icones && icones.length > 0 && (
          <View style={styles.iconesContainer}>
            {icones.map((icone, index) => (
              <Fragment key={index}>
                <Ionicons
                  name={icone.name}
                  size={iconSize}
                  color={icone.color}
                  style={styles.icone}
                />

                {icone.description && (
                  <Text style={styles.description}>{icone.description}</Text>
                )}
              </Fragment>
            ))}
          </View>
        )}
      </View>

      {/* Valor principal */}
      {valor && (
        <Text style={[styles.valor, { color: valorCor }]}>{valor}</Text>
      )}

      {/* Subtítulo */}
      {subtitulo && (
        <Text style={[styles.subtitulo, { color: subtituloCor }]}>
          {subtitulo}
        </Text>
      )}

      {/* Conteúdo adicional */}
      {children}
    </View>
  );
}
