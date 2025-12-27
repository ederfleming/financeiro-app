import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardMetrica from "@/components/CardMetrica";
import CategoriaAccordion from "@/components/CategoriaAccordion";
import HeaderMesNavegacao from "@/components/HeaderMesNavegacao";
import LoadingScreen from "@/components/LoadingScreen";
import ProgressBar from "@/components/ProgressBar";
import { useTotais } from "@/hooks/useTotais";
import { colors } from "@/theme/colors";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { categorias } from "@/utils/categorias";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export default function TotaisScreen() {
  const {
    mesAtual,
    loading,
    totaisMes,
    totaisPorCategoria,
    diaAtualDoMes,
    mudarMes,
    irParaHoje,
    voltar,
    performance,
    statusPerformance,
    percentualMeta, // ← NOVO
    economiaReal, // ← NOVO
    metaEmReais,
    percentualEconomizado,
    fraseMotivacional,
    custoDeVida,
    statusCustoDeVida,
    diarioMedio,
    gastoDiarioPadrao,
    corBarraDiarioMedio,
    percentualBarraDiarioMedio,
  } = useTotais();

  if (loading) {
    return <LoadingScreen message="Carregando totais..." />;
  }

  // Ícones das categorias para Performance
  const iconesPerformance = [
    { name: "arrow-down-circle" as const, color: colors.green[500] },
    { name: "remove" as const, color: colors.gray[400] },
    { name: "arrow-up-circle" as const, color: colors.red[700] },
    { name: "remove" as const, color: colors.gray[400] },
    { name: "cart-outline" as const, color: colors.orange[300] },
    { name: "remove" as const, color: colors.gray[400] },
    { name: "wallet-outline" as const, color: colors.green[900] },
    { name: "remove" as const, color: colors.gray[400] },
    { name: "card-outline" as const, color: colors.purple[500] },
  ];

  // Ícones para Custo de Vida
  const iconesCustoDeVida = [
    { name: "arrow-up-circle" as const, color: colors.red[700] },
    { name: "add" as const, color: colors.gray[400] },
    { name: "cart-outline" as const, color: colors.orange[300] },
    { name: "add" as const, color: colors.gray[400] },
    { name: "card-outline" as const, color: colors.purple[500] },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com navegação */}
      <HeaderMesNavegacao
        mesAtual={mesAtual}
        onMudarMes={mudarMes}
        onIrParaHoje={irParaHoje}
        onAbrirMenu={voltar}
        showMenuButton={true}
        showTodayButton={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção: Cálculos do mês */}
        <Text style={styles.secaoTitulo}>Cálculos do mês</Text>

        {/* Card: Performance */}
        <CardMetrica
          titulo="Performance"
          icones={iconesPerformance}
          iconSize={16}
          valor={formatarMoeda(performance)}
          valorCor={statusPerformance.cor}
          subtitulo={statusPerformance.texto}
          subtituloCor={statusPerformance.cor}
        />

        {/* Card: Economizado (Meta de Economia) */}
        <CardMetrica
          titulo="Economizado"
          icones={[
            { name: "wallet-outline", color: colors.green[900] },
            { name: "checkmark-circle", color: colors.green[500] },
          ]}
          iconSize={16}
        >
          <View style={styles.economiaContainer}>
            {/* ✨ NOVO: Aviso se não houver entradas no mês */}
            {totaisMes.entradas === 0 ? (
              <View style={styles.avisoSemEntradas}>
                <Ionicons
                  name="information-circle"
                  size={24}
                  color={colors.yellow[500]}
                />
                <Text style={styles.avisoSemEntradasTexto}>
                  Sem entradas cadastradas neste mês
                </Text>
              </View>
            ) : totaisMes.entradas < 100 ? (
              <View style={styles.avisoSemEntradas}>
                <Ionicons
                  name="alert-circle"
                  size={24}
                  color={colors.yellow[500]}
                />
                <Text style={styles.avisoSemEntradasTexto}>
                  Poucas entradas neste mês. Meta pode estar imprecisa.
                </Text>
              </View>
            ) : null}

            <View style={styles.economiaHeader}>
              <Text style={styles.economiaValor}>
                {formatarMoeda(economiaReal)}
              </Text>
              <Text style={styles.economiaMeta}>
                Meta: {formatarMoeda(metaEmReais)}
              </Text>
            </View>

            <ProgressBar
              percentual={percentualEconomizado}
              cor={colors.green[500]}
              altura={16}
            />

            <Text style={styles.fraseMotivacional}>{fraseMotivacional}</Text>

            {percentualMeta === 0 && (
              <Text style={styles.avisoDefinirMeta}>
                💡 Defina sua meta de economia no Menu → Meta de Economia
              </Text>
            )}
          </View>
        </CardMetrica>

        {/* Card: Custo de Vida */}
        <CardMetrica
          titulo="Custo de vida"
          icones={iconesCustoDeVida}
          iconSize={16}
          valor={formatarMoeda(custoDeVida)}
          valorCor={statusCustoDeVida.cor}
          subtitulo={statusCustoDeVida.texto}
          subtituloCor={statusCustoDeVida.cor}
        />

        {/* Card: Diário Médio */}
        <CardMetrica
          titulo="Diário médio"
          icones={[
            {
              name: "speedometer-outline",
              color: colors.gray[500],
              description: formatarMoeda(gastoDiarioPadrao),
            },
          ]}
          iconSize={16}
        >
          <View style={styles.diarioMedioContainer}>
            {/* Header com ícone e valores */}
            <View style={styles.diarioMedioHeader}>
              <View style={styles.diarioMedioLeft}>
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={colors.orange[300]}
                />
                <Text style={styles.diarioMedioDivisor}>
                  / {diaAtualDoMes > 0 ? diaAtualDoMes : "0"}
                </Text>
              </View>
              <View style={styles.diarioMedioRight}>
                <Text style={styles.diarioMedioValor}>
                  {formatarMoeda(diarioMedio)}
                </Text>
              </View>
            </View>

            {/* Velocímetro (barra de progresso) */}
            {diaAtualDoMes > 0 && (
              <ProgressBar
                percentual={percentualBarraDiarioMedio}
                cor={corBarraDiarioMedio}
                altura={16}
                mostrarPercentual={false}
              />
            )}

            {diaAtualDoMes === 0 && (
              <Text style={styles.diarioMedioAviso}>
                Sem gastos registrados ainda neste mês
              </Text>
            )}
          </View>
        </CardMetrica>

        {/* Seção: Movimentações do mês */}
        <Text style={styles.secaoTitulo}>Movimentações do mês</Text>

        {/* Lista de categorias com accordion */}
        {totaisPorCategoria.map((item) => {
          const categoriaInfo = categorias.find(
            (c) => c.key === item.categoria
          );

          if (!categoriaInfo) return null;

          return (
            <CategoriaAccordion
              key={item.categoria}
              icone={categoriaInfo.icon}
              cor={categoriaInfo.color}
              label={categoriaInfo.label}
              total={item.total}
              tags={item.tags}
            />
          );
        })}

        {/* Espaçamento inferior */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
