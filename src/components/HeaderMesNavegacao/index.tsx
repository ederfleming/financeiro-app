import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import CalendarTodayIcon from "@/components/CalendarTodayIcon";
import { getMonthName } from "@/utils/dateUtils";
import { styles } from "./styles";

interface HeaderMesNavegacaoProps {
  mesAtual?: Date; // ⬅️ agora opcional
  tituloCustom?: string; // ✨ NOVO
  onMudarMes: (direcao: "anterior" | "proximo") => void;
  onIrParaHoje: () => void;
  onAbrirMenu?: () => void;
  showMenuButton?: boolean;
  showTodayButton?: boolean;
  todayButtonAccessibilityLabel?: string; // ✨ NOVO (opcional)
}

export default function HeaderMesNavegacao({
  mesAtual,
  tituloCustom,
  onMudarMes,
  onIrParaHoje,
  onAbrirMenu,
  showMenuButton = true,
  showTodayButton = true,
  todayButtonAccessibilityLabel = "Ir para hoje", // ✨ NOVO
}: HeaderMesNavegacaoProps) {
  return (
    <View style={styles.header}>
      {/* Botão Ir para Hoje/Trimestre Atual */}
      {showTodayButton && (
        <TouchableOpacity
          onPress={onIrParaHoje}
          style={styles.todayButton}
          accessibilityLabel={todayButtonAccessibilityLabel} // ✨ NOVO
        >
          <CalendarTodayIcon size={30} />
        </TouchableOpacity>
      )}

      {/* Navegação Anterior */}
      <TouchableOpacity onPress={() => onMudarMes("anterior")}>
        <Ionicons name="chevron-back" size={24} style={styles.icon} />
      </TouchableOpacity>

      {/* Mês/Ano */}
      <Text style={styles.mesAno}>
        {tituloCustom
          ? tituloCustom
          : mesAtual
          ? `${getMonthName(mesAtual.getMonth())}/${mesAtual
              .getFullYear()
              .toString()
              .slice(-2)}`
          : ""}
      </Text>

      {/* Navegação Próximo */}
      <TouchableOpacity onPress={() => onMudarMes("proximo")}>
        <Ionicons name="chevron-forward" size={24} style={styles.icon} />
      </TouchableOpacity>

      {/* Botão Menu */}
      {showMenuButton && onAbrirMenu && (
        <TouchableOpacity onPress={onAbrirMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}
