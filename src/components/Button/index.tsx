// components/Button/index.tsx
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { styles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "contained" | "outlined";
  loading?: boolean;
  disabled?: boolean;
  startIcon?: keyof typeof Ionicons.glyphMap; // Ícone à esquerda
  endIcon?: keyof typeof Ionicons.glyphMap; // Ícone à direita
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = "contained",
  loading,
  disabled,
  startIcon,
  endIcon,
  style,
}: ButtonProps) {
  const isOutlined = variant === "outlined";
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        isOutlined ? styles.outlined : styles.contained,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutlined ? colors.purple[500] : colors.white}
        />
      ) : (
        <>
          {startIcon && (
            <Ionicons
              name={startIcon}
              size={20}
              color={isOutlined ? colors.purple[500] : colors.white}
              style={styles.startIcon}
            />
          )}

          <Text
            style={[
              styles.text,
              { color: isOutlined ? colors.purple[500] : colors.white },
            ]}
          >
            {title}
          </Text>

          {endIcon && (
            <Ionicons
              name={endIcon}
              size={20}
              color={isOutlined ? colors.purple[500] : colors.white}
              style={styles.endIcon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}


