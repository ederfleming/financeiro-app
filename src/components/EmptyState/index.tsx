import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";
import { styles } from "./styles";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({
  icon = "document-text-outline",
  title,
  subtitle,
  buttonText,
  onButtonPress,
  buttonIcon = "add",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.gray[400]} />

      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Ionicons name={buttonIcon} size={20} color={colors.white} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
