import { colors } from "@/theme/colors";
import React from "react";
import { ActivityIndicator, Text, View, ViewStyle } from "react-native";
import { styles } from "./styles";

interface LoadingScreenProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export default function LoadingScreen({
  message,
  size = "large",
  color = colors.purple[500],
  style,
}: LoadingScreenProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
