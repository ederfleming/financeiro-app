import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";
import { Transacao } from "@/types";
import { formatarMoeda } from "@/utils/calculoSaldo";
import { categorias } from "@/utils/categorias";
import { styles } from "./styles";

interface TransacaoCardProps {
  transacao: Transacao;
  onEdit?: (transacao: Transacao) => void;
  onDelete?: (transacao: Transacao) => void;
  showActions?: boolean;
}

export default function TransacaoCard({
  transacao,
  onEdit,
  onDelete,
  showActions = true,
}: TransacaoCardProps) {
  const categoria = categorias.find((c) => c.key === transacao.categoria);

  return (
    <View style={styles.container}>
      {/* Header: Ícone, Info e Valor */}
      <View style={styles.header}>
        {/* Ícone da Categoria */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoria?.color + "20" || colors.gray[200] },
          ]}
        >
          <Ionicons
            name={categoria?.icon || "help-circle"}
            size={24}
            color={categoria?.color || colors.gray[600]}
          />
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.descricao}>{transacao.descricao}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.categoriaLabel}>{categoria?.label}</Text>

            {transacao.tag && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.tag}>{transacao.tag}</Text>
              </>
            )}

            {transacao.recorrencia !== "unica" && (
              <>
                <Text style={styles.separator}>•</Text>
                <Ionicons
                  name="repeat-outline"
                  size={12}
                  color={colors.gray[400]}
                />
              </>
            )}
          </View>
        </View>

        {/* Valor */}
        <Text style={styles.valor}>{formatarMoeda(transacao.valor)}</Text>
      </View>

      {/* Ações: Tag + Editar e Excluir */}
      {showActions && (onEdit || onDelete || transacao.tag) && (
        <View style={styles.actionsContainer}>
          {/* Tag à esquerda */}
          {transacao.tag && (
            <View style={styles.tagContainer}>
              <Ionicons
                name="pricetag"
                size={16}
                color={categoria?.color || colors.gray[600]}
              />
              <Text style={[styles.tagText, ,]}>{transacao.tag}</Text>
            </View>
          )}

          {/* Botões à direita */}
          <View style={styles.actionButtons}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(transacao)}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.purple[500]}
                />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(transacao)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.red[500]}
                />
                <Text style={[styles.actionText, { color: colors.red[500] }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
