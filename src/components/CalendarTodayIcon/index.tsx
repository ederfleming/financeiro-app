import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

interface CalendarTodayIconProps {
  size?: number;
}

export default function CalendarTodayIcon({
  size = 28,
}: CalendarTodayIconProps) {
  const hoje = new Date().getDate();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Topo do calendário */}
      <View style={[styles.header, { height: size * 0.25 }]}>
        <View style={styles.ring} />
        <View style={styles.ring} />
      </View>

      {/* Corpo do calendário com o dia */}
      <View style={styles.body}>
        <Text style={[styles.dayText, { fontSize: size * 0.45 }]}>{hoje}</Text>
      </View>
    </View>
  );
}

