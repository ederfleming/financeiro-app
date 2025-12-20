import { colors } from "@/theme/colors";
import { useMemo } from "react";

export function useSaldoStyles() {
  const getSaldoStyle = useMemo(
    // TODO: Mudar total de entrada para o gasto váriavel mensal
    () => (saldo: number, totalEntradas: number) => {
      const totalVariavelMensal = 2000; // Valor fixo temporário
      if (saldo === 0) {
        return {
          backgroundColor: colors.red[200],
          textColor: colors.gray[800],
        };
      }

      const percentual = (saldo / totalVariavelMensal) * 100;

      if (percentual >= 70)
        return {
          backgroundColor: colors.green[500],
          textColor: colors.white,
        };

      if (percentual >= 40)
        return {
          backgroundColor: colors.green[200],
          textColor: colors.gray[800],
        };

      if (percentual >= 0)
        return {
          backgroundColor: colors.yellow[200],
          textColor: colors.gray[800],
        };

      if (percentual >= -20)
        return {
          backgroundColor: colors.red[200],
          textColor: colors.gray[800],
        };

      return {
        backgroundColor: colors.red[700],
        textColor: colors.white,
      };
    },
    []
  );

  const isDiaPassado = useMemo(
    () => (dia: number, mesAtual: Date) => {
      const hoje = new Date();
      const dataDia = new Date(
        mesAtual.getFullYear(),
        mesAtual.getMonth(),
        dia
      );

      hoje.setHours(0, 0, 0, 0);
      dataDia.setHours(0, 0, 0, 0);

      return dataDia < hoje;
    },
    []
  );

  return {
    getSaldoStyle,
    isDiaPassado,
  };
}
