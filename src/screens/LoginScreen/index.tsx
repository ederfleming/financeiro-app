import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { isOnboardingCompleto } from "@/services/storage";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    verificarBiometria();
  }, []);

  const verificarBiometria = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(compatible && enrolled);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Verifica se já completou o onboarding
      const onboardingCompleto = await isOnboardingCompleto();

      if (!onboardingCompleto) {
        // Primeira vez - vai para configuração inicial
        navigation.replace("ConfiguracaoInicial");
        return;
      }

      // Já tem configuração - pede autenticação biométrica
      if (hasBiometrics) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentique-se para acessar",
          fallbackLabel: "Usar senha",
          cancelLabel: "Cancelar",
        });

        if (result.success) {
          navigation.replace("MainTabs");
        } else {
          Alert.alert("Erro", "Autenticação falhou. Tente novamente.");
        }
      } else {
        // Não tem biometria configurada, deixa entrar direto
        navigation.replace("MainTabs");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Não foi possível realizar o login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
           <Image
              source={require("../../../assets/ios-icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Panorama$</Text>
          <Text style={styles.appSubtitle}>Controle suas finanças</Text>
        </View>

        {/* Botão de Login */}
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {hasBiometrics && !loading && (
              <Ionicons
                name="finger-print"
                size={24}
                color={colors.purple[500]}
                style={styles.loginIcon}
              />
            )}
            <Text style={styles.loginButtonText}>
              {loading ? "Carregando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {hasBiometrics && (
            <Text style={styles.biometricsText}>
              Use a autenticação {"\n"}biométrica para entrar
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
