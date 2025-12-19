import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CalendarTodayIcon from "@/components/CalendarTodayIcon";
import DiaListItem from "@/components/DiaListItem";
import Divider from "@/components/Divider";
import { useSaldos } from "@/hooks/useSaldo";
import { useSaldoStyles } from "@/hooks/useSaldoStyles";
import { colors, spacing } from "@/theme/colors";
import { SaldoDia } from "@/types";
import { categorias } from "@/utils/categorias";
import { getMonthName } from "@/utils/dateUtils";
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

  const ROW_HEIGHT = 50;

  // Recarrega quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [mesAtual])
  );

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com navegação de mês */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={irParaHoje}
          style={{ marginRight: spacing.sm }}
        >
          <CalendarTodayIcon size={26} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => mudarMes("anterior")}>
          <Ionicons name="chevron-back" size={24} color={colors.gray[800]} />
        </TouchableOpacity>

        <Text style={styles.mesAno}>
          {getMonthName(mesAtual.getMonth())}/
          {mesAtual.getFullYear().toString().slice(-2)}
        </Text>

        <TouchableOpacity onPress={() => mudarMes("proximo")}>
          <Ionicons name="chevron-forward" size={24} color={colors.gray[800]} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={abrirMenu}
          style={{ marginLeft: spacing.sm }}
        >
          <Ionicons name="menu" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      {/* Filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosContent}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filtroButton,
              filtroCategoria === cat.key && { backgroundColor: cat.color },
            ]}
            onPress={() => setFiltroCategoria(cat.key)}
          >
            <Ionicons
              name={cat.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={filtroCategoria === cat.key ? colors.white : cat.color}
            />
            <Text
              style={[
                styles.filtroTexto,
                filtroCategoria === cat.key && styles.filtroTextoActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cabeçalho da tabela */}
      <View style={styles.tabelaHeader}>
        <View style={styles.diaColuna}>
          <Text style={styles.headerTexto}>Dia</Text>
        </View>
        <View style={styles.valoresColuna}>
          <Text style={styles.headerTexto}>
            {
              categorias.filter((item) => item.key === filtroCategoria)[0]
                ?.label
            }
          </Text>
        </View>
        <View style={styles.headerSaldoColuna}>
          <Ionicons name="trending-up" size={16} color={colors.gray[600]} />
          <Text style={[styles.headerTexto, { marginLeft: 8 }]}>Saldos</Text>
        </View>
      </View>

      {/* Lista de dias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple[500]} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={saldos}
          renderItem={renderDia}
          keyExtractor={(item) => item.dia.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Divider color={colors.gray[100]} />}
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
    </SafeAreaView>
  );
}
