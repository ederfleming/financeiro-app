import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Imports das telas
import CadastroScreen from "@/screens/CadastroScreen";
import ConfiguracaoInicialScreen from "@/screens/ConfiguracaoInicialScreen";
import DetalhesScreen from "@/screens/DetalhesScreen";
import LoginScreen from "@/screens/LoginScreen";
import MenuScreen from "@/screens/MenuScreen";
import MetaEconomiaScreen from "@/screens/MetaEconomiaScreen";
import PanoramasScreen from "@/screens/PanoramasScreen";
import PrevisaoGastoDiarioScreen from "@/screens/PrevisaoGastoDiarioScreen";
import SaldosScreen from "@/screens/SaldosScreen";
import TagsScreen from "@/screens/TagsScreen";
import TotaisScreen from "@/screens/TotaisScreen";
import { colors } from "@/theme/colors";
import { RootStackParamList, TabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: colors.purple[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Saldos"
        component={SaldosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Totais"
        component={TotaisScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Botão central "+" */}
      <Tab.Screen
        name="AddPlaceholder"
        component={View}
        options={({ navigation }) => ({
          tabBarLabel: "",
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => navigation.navigate("Cadastro" as never)}
              activeOpacity={0.8}
            >
              <View style={styles.addButton}>
                <Ionicons name="add" size={32} color={colors.white} />
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="Panoramas"
        component={PanoramasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tags"
        component={TagsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        {/* Telas de Onboarding */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="ConfiguracaoInicial"
          component={ConfiguracaoInicialScreen}
        />

        {/* Telas principais */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{
            presentation: "modal",
            title: "Nova Transação",
            headerStyle: {
              backgroundColor: colors.purple[500],
            },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />

        <Stack.Screen name="Menu" component={MenuScreen} />

        <Stack.Screen
          name="PrevisaoGastoDiario"
          component={PrevisaoGastoDiarioScreen}
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="MetaEconomia"
          component={MetaEconomiaScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple[500],
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
