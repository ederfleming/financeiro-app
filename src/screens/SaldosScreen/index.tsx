import { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Divider from "@/components/Divider";
import {
  getConfig,
  getDiasConciliados,
  getTransacoes,
  toggleDiaConciliado,
} from "@/services/storage";
import { colors, spacing } from "@/theme/colors";
import { Categoria, SaldoDia } from "@/types";
import { calcularSaldosMes, formatarMoeda } from "@/utils/calculoSaldo";
import { categorias } from "@/utils/categorias";
import {
  formatDate,
  getDatesInMonth,
  getMonthName,
  isFimDeSemana,
} from "@/utils/dateUtils";
import { styles } from "./styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SaldosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [saldos, setSaldos] = useState<SaldoDia[]>([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todas">(
    "entradas"
  );
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<SaldoDia>>(null);
  const isFirstLoad = useRef(true);
  const ROW_HEIGHT = 50;

  const totalEntradasMes = useMemo(() => {
    return saldos.reduce((acc, item) => acc + item.entradas, 0);
  }, [saldos]);

  const categoriasMap = useMemo(() => {
    return Object.fromEntries(categorias.map((cat) => [cat.key, cat]));
  }, []);

  const carregarDados = async () => {
    try {
      if (isFirstLoad.current) {
        setLoading(true);
      }

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
        config,
        year, // ✅ Adicionar
        month // ✅ Adicionar
      );
      setSaldos(saldosCalculados);

      // ... resto do código
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
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

  const irParaHoje = () => {
    setMesAtual(new Date());
  };

  const abrirMenu = () => {
    navigation.navigate("Menu");
  };

  const handleDiaPress = (dia: number) => {
    const year = mesAtual.getFullYear();
    const month = mesAtual.getMonth();
    const data = formatDate(new Date(year, month, dia));

    navigation.navigate("Cadastro", {
      data,
      categoria: filtroCategoria === "todas" ? "entradas" : filtroCategoria,
    });
  };

  const renderDia = ({ item }: { item: SaldoDia }) => {
    const categoryItem = categoriasMap[filtroCategoria];
    const valorCategoria = getValorPorCategoria(item);
    const diaDesabilitado = isDiaPassado(item.dia, mesAtual);
    const saldoStyle = getSaldoStyle(item.saldoAcumulado, totalEntradasMes);

    const fimDeSemana = isFimDeSemana(item.dia, mesAtual);
    return (
      <Pressable
        style={[styles.diaRow, diaDesabilitado && styles.diaRowDisabled]}
        onLongPress={() => handleDiaPress(item.dia)}
      >
        {/* Coluna do Dia */}
        <View style={styles.diaColuna}>
          <TouchableOpacity
            style={[
              styles.diaNumero,
              item.conciliado && styles.diaConciliado,
              fimDeSemana && styles.diaRowWeekend,
              { height: filtroCategoria === "todas" ? 120 : 45 },
            ]}
            onPress={() => handleToggleConciliado(item.dia)} // Long press para conciliar
          >
            <Text
              style={[styles.diaTexto, fimDeSemana && styles.diaTextoWeekend]}
            >
              {item.dia}
            </Text>
            {item.conciliado && (
              <View style={styles.checkMark}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Coluna de Valores por Categoria (scroll horizontal) */}
        <Pressable
          style={styles.valoresColuna}
          onLongPress={() => {
            const year = mesAtual.getFullYear();
            const month = mesAtual.getMonth();
            const dataFormatada = formatDate(new Date(year, month, item.dia));
            navigation.navigate("Detalhes", { data: dataFormatada });
          }}
        >
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
                      color={cat.color}
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
        </Pressable>

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
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com navegação de mês */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={irParaHoje}
          style={{ marginRight: spacing.sm }}
        >
          <Ionicons name="today-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

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

        <TouchableOpacity
          onPress={abrirMenu}
          style={{ marginLeft: spacing.sm }}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
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
          <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
          <Text style={[styles.headerTexto, { marginLeft: 8 }]}>Saldos</Text>
        </View>
      </View>

      {/* Lista de dias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={saldos}
          renderItem={renderDia}
          keyExtractor={(item) => item.dia.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <Divider color={colors.backgroundSecondary} />
          )}
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

//Tem um problema Claude... vocÊ não retirou a lista de transações de dentro da tela de cadastro. E a cada item que eu for editar, ele já deve vir preenchido da tela assim como você faz atualmente na tela de cadastro, ou seja, o comportamente de exclusão e edição da tela de cadastro deve ser transferido pra tela de detalhes, que ao redirecionar para a edição de uma transação deve vir preenchido e validado se é uma edição ou uma nova transação.
