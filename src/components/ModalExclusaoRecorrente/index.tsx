import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";
import { styles } from "./styles";

interface ModalExclusaoRecorrenteProps {
  visible: boolean;
  onClose: () => void;
  onExcluirApenasEsta: () => void;
  onExcluirDestaEmDiante: () => void; // ✨ NOVO
  onExcluirTodas: () => void;
  dataFormatada: string;
}

export default function ModalExclusaoRecorrente({
  visible,
  onClose,
  onExcluirApenasEsta,
  onExcluirDestaEmDiante, // ✨ NOVO
  onExcluirTodas,
  dataFormatada,
}: ModalExclusaoRecorrenteProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name="alert-circle"
              size={48}
              color={colors.yellow[500]}
            />
            <Text style={styles.titulo}>Excluir transação recorrente</Text>
            <Text style={styles.subtitulo}>
              Esta é uma transação recorrente. O que deseja fazer?
            </Text>
          </View>

          {/* Opção 1: Apenas esta */}
          <TouchableOpacity
            style={styles.opcaoButton}
            onPress={onExcluirApenasEsta}
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.purple[500]}
            />
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Apenas esta ocorrência</Text>
              <Text style={styles.opcaoDescricao}>
                Exclui apenas a transação do dia {dataFormatada}
              </Text>
            </View>
          </TouchableOpacity>

          {/* ✨ NOVA OPÇÃO 2: Desta em diante */}
          <TouchableOpacity
            style={[styles.opcaoButton, styles.opcaoButtonWarning]}
            onPress={onExcluirDestaEmDiante}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={colors.yellow[500]}
            />
            <View style={styles.opcaoTexto}>
              <Text style={[styles.opcaoTitulo, { color: colors.yellow[500] }]}>
                Desta data em diante
              </Text>
              <Text style={styles.opcaoDescricao}>
                Exclui a partir de {dataFormatada} (mantém as anteriores)
              </Text>
            </View>
          </TouchableOpacity>

          {/* Opção 3: Todas */}
          <TouchableOpacity
            style={[styles.opcaoButton, styles.opcaoButtonDanger]}
            onPress={onExcluirTodas}
          >
            <Ionicons name="repeat" size={24} color={colors.red[500]} />
            <View style={styles.opcaoTexto}>
              <Text style={[styles.opcaoTitulo, { color: colors.red[500] }]}>
                Todas as ocorrências
              </Text>
              <Text style={styles.opcaoDescricao}>
                Exclui todas (passadas e futuras)
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity style={styles.cancelarButton} onPress={onClose}>
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}