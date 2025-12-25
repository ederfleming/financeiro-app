import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderMesNavegacao from "@/components/HeaderMesNavegacao";
import LoadingScreen from "@/components/LoadingScreen";
import { useSaldoStyles } from "@/hooks/useSaldoStyles";
import { SaldoDia } from "@/types";
import { getMonthName, isFimDeSemana } from "@/utils/dateUtils";

import { usePanoramas } from "@/hooks/usePanoramas";
import { colors } from "@/theme/colors";
import { formatarMoedaAbreviada } from "@/utils/calculoSaldo";
import { styles } from "./styles";

export default function PanoramasScreen() {
  const {
    colunasTrimestre,
    loading,
    mesesExibidos,
    carregarDados,
    formatarTituloTrimestre,
    mudarTrimestre,
    irParaTrimestreAtual,
    abrirMenu,
  } = usePanoramas();

  const { getSaldoStyle } = useSaldoStyles();

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-50, 50])
    .onEnd((event) => {
      const SWIPE_THRESHOLD = 50;

      if (event.translationX > SWIPE_THRESHOLD) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        mudarTrimestre("anterior");
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        mudarTrimestre("proximo");
      }
    });

  const renderColuna = (col: { mes: Date; saldos: SaldoDia[] }) => {
    const mesAbreviado = getMonthName(col.mes.getMonth()).slice(0, 3); // Jan, Fev, Mar
    const anoAbreviado = col.mes.getFullYear().toString().slice(-2); // 25

    return (
      <View key={col.mes.toISOString()} style={styles.coluna}>
        {/* Header da coluna */}
        <View style={styles.colunaHeader}>
          <Text style={styles.colunaHeaderText}>
            {mesAbreviado}/{anoAbreviado}
          </Text>
        </View>

        {/* Lista de dias */}
        <View style={styles.colunaScroll}>
          {col.saldos.map((item) => {
            const saldoStyle = getSaldoStyle(item.saldoAcumulado, 2000); //TODO: Corrigir esse segundo parametro
            const mesAtual = new Date();
            const fimDeSemana = isFimDeSemana(item.dia, mesAtual);

            const isToday =
              item.dia === mesAtual.getDate() &&
              col.mes.getMonth() === mesAtual.getMonth() &&
              col.mes.getFullYear() === mesAtual.getFullYear();

            return (
              <View
                key={item.dia}
                style={[
                  styles.diaRow,
                  isToday && {
                    borderBottomWidth: 2,
                    borderBottomColor: colors.purple[500],
                  },
                ]}
              >
                <View style={styles.diaColuna}>
                  <View
                    style={[
                      styles.diaNumero,
                      fimDeSemana && styles.diaRowWeekend,
                      isToday && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.purple[500],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diaTexto,
                        fimDeSemana && styles.diaTextoWeekend,
                      ]}
                    >
                      {item.dia}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.rowSaldoColuna,
                    { backgroundColor: saldoStyle.backgroundColor },
                  ]}
                >
                  <Text
                    style={[styles.saldoTexto, { color: saldoStyle.textColor }]}
                  >
                    {formatarMoedaAbreviada(item.saldoAcumulado)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ✨ Header usa o primeiro mês do trimestre
  const tituloTrimestre = formatarTituloTrimestre(mesesExibidos);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <HeaderMesNavegacao
        tituloCustom={tituloTrimestre}
        onMudarMes={(d) => mudarTrimestre(d)}
        onIrParaHoje={irParaTrimestreAtual}
        onAbrirMenu={abrirMenu}
        todayButtonAccessibilityLabel="Ir para trimestre atual"
      />

      {/* Conteúdo */}
      <GestureDetector gesture={swipeGesture}>
        <View collapsable={false} style={{ flex: 1 }}>
          {loading ? (
            <LoadingScreen message="Carregando panorama..." />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={styles.trimestreContainer}>
                {colunasTrimestre.map((col) => renderColuna(col))}
              </View>
            </ScrollView>
          )}
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}
