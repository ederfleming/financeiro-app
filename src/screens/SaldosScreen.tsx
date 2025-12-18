import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ColorValue,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getConfig,
  getDiasConciliados,
  getTransacoes,
  toggleDiaConciliado,
} from "@/services/storage";
import { borderRadius, colors, fontSize, spacing } from "@/theme/colors";
import { Categoria, SaldoDia } from "@/types";
import { calcularSaldosMes, formatarMoeda } from "@/utils/calculoSaldo";
import { formatDate, getDatesInMonth, getMonthName } from "@/utils/dateUtils";

export default function SaldosScreen() {
  const [saldos, setSaldos] = useState<SaldoDia[]>([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas">(
    "entradas"
  );
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<SaldoDia>>(null);
  const ROW_HEIGHT = 50;

  const totalEntradasMes = useMemo(() => {
    return saldos.reduce((acc, item) => acc + item.entradas, 0);
  }, [saldos]);

  const categorias: Array<{
    key: Categoria | "todas";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: ColorValue;
  }> = [
    {
      key: "entradas",
      label: "Entradas",
      icon: "arrow-down-circle",
      color: colors.entradas,
    },
    {
      key: "saidas",
      label: "Saídas",
      icon: "arrow-up-circle",
      color: colors.saidas,
    },
    {
      key: "diarios",
      label: "Diários",
      icon: "calendar",
      color: colors.diarios,
    },
    { key: "cartao", label: "Cartão", icon: "card", color: colors.cartao },
    {
      key: "economia",
      label: "Economia",
      icon: "wallet",
      color: colors.economia,
    },
    { key: "todas", label: "Todas", icon: "apps", color: colors.todas },
  ];

  const categoriasMap = useMemo(() => {
    return Object.fromEntries(categorias.map((cat) => [cat.key, cat]));
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const year = mesAtual.getFullYear();
      const month = mesAtual.getMonth();

      const datas = getDatesInMonth(year, month);
      const transacoes = await getTransacoes();
      const diasConciliados = await getDiasConciliados();
      const config = await getConfig();

      const saldosCalculados = calcularSaldosMes(
        datas,
        transacoes,
        diasConciliados,
        config
      );
      setSaldos(saldosCalculados);

      setTimeout(() => {
        const hoje = new Date();

        if (
          hoje.getMonth() === mesAtual.getMonth() &&
          hoje.getFullYear() === mesAtual.getFullYear()
        ) {
          const indexHoje = saldosCalculados.findIndex(
            (item) => item.dia === hoje.getDate()
          );

          if (indexHoje >= 0) {
            listRef.current?.scrollToIndex({
              index: indexHoje,
              animated: true,
            });

            requestAnimationFrame(() => {
              listRef.current?.scrollToOffset({
                offset: ROW_HEIGHT * indexHoje,
                animated: false,
              });
            });
          }
        }
      }, 0);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [mesAtual])
  );

  const mudarMes = (direcao: "anterior" | "proximo") => {
    const novoMes = new Date(mesAtual);
    if (direcao === "anterior") {
      novoMes.setMonth(novoMes.getMonth() - 1);
    } else {
      novoMes.setMonth(novoMes.getMonth() + 1);
    }
    setMesAtual(novoMes);
  };

  const handleToggleConciliado = async (dia: number) => {
    const year = mesAtual.getFullYear();
    const month = mesAtual.getMonth();
    const data = formatDate(new Date(year, month, dia));

    await toggleDiaConciliado(data);

    setSaldos((prev) =>
      prev.map((item) =>
        item.dia === dia ? { ...item, conciliado: !item.conciliado } : item
      )
    );
  };

  const getValorPorCategoria = (saldo: SaldoDia): number => {
    switch (filtroCategoria) {
      case "entradas":
        return saldo.entradas;
      case "saidas":
        return saldo.saidas;
      case "diarios":
        return saldo.diarios;
      case "cartao":
        return saldo.cartao;
      case "economia":
        return saldo.economia;
      default:
        return 0;
    }
  };

  function getSaldoStyle(saldo: number, totalEntradas: number) {
    if (totalEntradas === 0) {
      return {
        backgroundColor: colors.errorLight,
        textColor: colors.textPrimary,
      };
    }

    const percentual = (saldo / totalEntradas) * 100;

    if (percentual >= 70)
      return {
        backgroundColor: colors.successDark,
        textColor: colors.white,
      };

    if (percentual >= 40)
      return {
        backgroundColor: colors.successLight,
        textColor: colors.textPrimary,
      };

    if (percentual >= 0)
      return {
        backgroundColor: colors.warningLight,
        textColor: colors.textPrimary,
      };

    if (percentual >= -10)
      return {
        backgroundColor: colors.errorLight,
        textColor: colors.textPrimary,
      };

    return {
      backgroundColor: colors.errorDark,
      textColor: colors.white,
    };
  }

  function isDiaPassado(dia: number, mesAtual: Date) {
    const hoje = new Date();
    const dataDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);

    hoje.setHours(0, 0, 0, 0);
    dataDia.setHours(0, 0, 0, 0);

    return dataDia < hoje;
  }

  const renderDia = ({ item }: { item: SaldoDia }) => {
    const categoryItem = categoriasMap[filtroCategoria];
    const valorCategoria = getValorPorCategoria(item);
    const diaDesabilitado = isDiaPassado(item.dia, mesAtual);
    const saldoStyle = getSaldoStyle(item.saldoAcumulado, totalEntradasMes);

    return (
      <View style={[styles.diaRow, diaDesabilitado && styles.diaRowDisabled]}>
        {/* Coluna do Dia */}
        <View style={styles.diaColuna}>
          <TouchableOpacity
            style={[styles.diaNumero, item.conciliado && styles.diaConciliado]}
            onPress={() => handleToggleConciliado(item.dia)}
          >
            <Text style={styles.diaTexto}>{item.dia}</Text>
            {item.conciliado && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Coluna de Valores por Categoria (scroll horizontal) */}
        <View style={styles.valoresColuna}>
          {filtroCategoria === "todas" ? (
            categorias
              .filter((categorie) => categorie.key !== "todas")
              .map((cat) => {
                const valor = item[cat.key];

                return (
                  <View key={cat.key} style={styles.valorLinha}>
                    <Ionicons
                      name={cat.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={
                        filtroCategoria === cat.key ? colors.white : cat.color
                      }
                    />
                    <Text
                      style={[styles.valorTexto, { paddingRight: spacing.md }]}
                    >
                      {valor > 0 ? formatarMoeda(valor) : "R$ 0,00"}
                    </Text>
                  </View>
                );
              })
          ) : (
            <View style={styles.valorLinha}>
              <Ionicons
                name={categoryItem.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={categoryItem.color}
              />
              <Text style={[styles.valorTexto, { paddingRight: spacing.md }]}>
                {valorCategoria > 0 ? formatarMoeda(valorCategoria) : "R$ 0,00"}
              </Text>
            </View>
          )}
        </View>

        {/* Coluna de Saldo */}
        <View
          style={[
            styles.rowSaldoColuna,
            { backgroundColor: saldoStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.saldoTexto, { color: saldoStyle.textColor }]}>
            {formatarMoeda(item.saldoAcumulado)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com navegação de mês */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => mudarMes("anterior")}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.mesAno}>
          {getMonthName(mesAtual.getMonth())}/
          {mesAtual.getFullYear().toString().slice(-2)}
        </Text>

        <TouchableOpacity onPress={() => mudarMes("proximo")}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textPrimary}
          />
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
          <Text style={styles.headerTexto}>{filtroCategoria}</Text>
        </View>
        <View style={styles.headerSaldoColuna}>
          <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
          <Text style={[styles.headerTexto, { marginLeft: 8 }]}>Saldos</Text>
        </View>
      </View>

      {/* Lista de dias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={saldos}
          renderItem={renderDia}
          keyExtractor={(item) => item.dia.toString()}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mesAno: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  filtrosContainer: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtrosContent: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filtroButton: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.backgroundTertiary,
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  filtroTexto: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  filtroTextoActive: {
    color: colors.textLight,
  },
  tabelaHeader: {
    flexDirection: "row",

    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  headerTexto: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  diaRow: {
    minHeight: 50,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    alignItems: "stretch",
  },
  diaRowDisabled: {
    opacity: 0.4,
  },
  diaColuna: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  diaNumero: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundTertiary,
    position: "relative",
  },
  diaConciliado: {
    backgroundColor: colors.successLight,
  },
  diaTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  checkMark: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  valoresColuna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.lg,
  },
  valorLinha: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  valorLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  valorTexto: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  headerSaldoColuna: {
    width: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  rowSaldoColuna: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  saldoPositivo: {
    backgroundColor: colors.saldoPositivo,
  },
  saldoNegativo: {
    backgroundColor: colors.saldoNegativo,
  },
  saldoTexto: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  saldoTextoNegativo: {
    color: colors.errorDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
