import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing } from "@/theme/colors";
import { Categoria, SaldoDia } from "@/types";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { categorias } from "@/utils/categorias";
import { isFimDeSemana } from "@/utils/dateUtils";
import { styles } from "./styles";

interface DiaListItemProps {
  item: SaldoDia;
  mesAtual: Date;
  filtroCategoria: Categoria | "todas";
  totalEntradasMes: number;
  onToggleConciliado: (dia: number) => void;
  onLongPressDia: (dia: number) => void;
  onLongPressValores: (dia: number) => void;
  getSaldoStyle: (
    saldo: number,
    totalEntradas: number
  ) => {
    backgroundColor: string;
    textColor: string;
  };
  isDiaPassado: (dia: number, mesAtual: Date) => boolean;
}

export default function DiaListItem({
  item,
  mesAtual,
  filtroCategoria,
  totalEntradasMes,
  onToggleConciliado,
  onLongPressDia,
  onLongPressValores,
  getSaldoStyle,
  isDiaPassado,
}: DiaListItemProps) {
  const categoriasMap = useMemo(() => {
    return Object.fromEntries(categorias.map((cat) => [cat.key, cat]));
  }, []);

  const categoryItem = categoriasMap[filtroCategoria];
  const diaDesabilitado = isDiaPassado(item.dia, mesAtual);
  const saldoStyle = getSaldoStyle(item.saldoAcumulado, totalEntradasMes);
  const fimDeSemana = isFimDeSemana(item.dia, mesAtual);

  const getValorPorCategoria = (): number => {
    switch (filtroCategoria) {
      case "entradas":
        return item.entradas;
      case "saidas":
        return item.saidas;
      case "diarios":
        return item.diarios;
      case "cartao":
        return item.cartao;
      case "economia":
        return item.economia;
      default:
        return 0;
    }
  };

  const valorCategoria = getValorPorCategoria();

  return (
    <Pressable
      style={[styles.diaRow, diaDesabilitado && styles.diaRowDisabled]}
      onLongPress={() => onLongPressDia(item.dia)}
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
          onPress={() => onToggleConciliado(item.dia)}
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

      {/* Coluna de Valores por Categoria */}
      <Pressable
        style={styles.valoresColuna}
        onLongPress={() => onLongPressValores(item.dia)}
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
}
