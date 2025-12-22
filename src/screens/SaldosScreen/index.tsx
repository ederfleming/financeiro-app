import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DiaListItem from "@/components/DiaListItem";
import Divider from "@/components/Divider";
import FiltrosCategorias from "@/components/FiltrosCategorias";
import HeaderMesNavegacao from "@/components/HeaderMesNavegacao";
import LoadingScreen from "@/components/LoadingScreen";
import TabelaHeader from "@/components/TabelaHeader";
import { useSaldos } from "@/hooks/useSaldos";
import { useSaldoStyles } from "@/hooks/useSaldoStyles";
import { colors } from "@/theme/colors";
import { SaldoDia } from "@/types";
import { categorias } from "@/utils/categorias";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { styles } from "./styles";

export default function SaldosScreen() {
  const {
    saldos,
    mesAtual,
    filtroCategoria,
    loading,
    totalEntradasMes,
    listRef,
    setFiltroCategoria,
    carregarDados,
    mudarMes,
    irParaHoje,
    toggleDiaConciliado,
    abrirMenu,
    abrirCadastro,
    abrirDetalhes,
  } = useSaldos();

  const { getSaldoStyle, isDiaPassado } = useSaldoStyles();

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-50, 50]) // ✨ Só ativa com movimento horizontal significativo
    .onEnd((event) => {
      const SWIPE_THRESHOLD = 50;

      if (event.translationX > SWIPE_THRESHOLD) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // ✨ Feedback tátil
        mudarMes("anterior");
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // ✨ Feedback tátil
        mudarMes("proximo");
      }
    });

  const renderDia = ({ item }: { item: SaldoDia }) => (
    <DiaListItem
      item={item}
      mesAtual={mesAtual}
      filtroCategoria={filtroCategoria}
      totalEntradasMes={totalEntradasMes}
      onToggleConciliado={toggleDiaConciliado}
      onLongPressDia={abrirCadastro}
      onLongPressValores={abrirDetalhes}
      getSaldoStyle={getSaldoStyle}
      isDiaPassado={isDiaPassado}
    />
  );

  // ✅ Configuração das colunas da tabela
  const colunas = [
    { key: "dia", label: "Dia", width: 60, align: "center" as const },
    {
      key: "valores",
      label:
        categorias.find((item) => item.key === filtroCategoria)?.label || "",
      width: "flex" as const,
      align: "center" as const,
    },
    {
      key: "saldos",
      label: "Saldos",
      icon: "trending-up" as keyof typeof Ionicons.glyphMap,
      width: 120,
      align: "center" as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <HeaderMesNavegacao
        mesAtual={mesAtual}
        onMudarMes={mudarMes}
        onIrParaHoje={irParaHoje}
        onAbrirMenu={abrirMenu}
      />

      {/* Filtros */}
      <FiltrosCategorias
        categorias={categorias}
        categoriaSelecionada={filtroCategoria}
        onSelecionar={setFiltroCategoria}
      />

      {/* ✅ Cabeçalho da tabela componentizado */}
      <TabelaHeader columns={colunas} />

      {/* Lista de dias */}
      <GestureDetector gesture={swipeGesture}>
        <View collapsable={false} style={{ flex: 1 }}>
          {loading ? (
            <LoadingScreen message="Carregando saldos..." />
          ) : (
            <FlatList
              ref={listRef}
              data={saldos}
              renderItem={renderDia}
              keyExtractor={(item) => item.dia.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={(item) => {
                const today = new Date();
                const isTodayInCurrentMonth =
                  today.getMonth() === mesAtual.getMonth() &&
                  today.getFullYear() === mesAtual.getFullYear();
                if (
                  isTodayInCurrentMonth &&
                  item.leadingItem.dia === today.getDate()
                ) {
                  return <Divider color={colors.purple[500]} />;
                }
                return <Divider color={colors.gray[100]} />;
              }}
              getItemLayout={(_, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                listRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
            />
          )}
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}
