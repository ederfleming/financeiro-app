import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";
import { styles } from "./styles";

interface ModalEdicaoRecorrenteProps {
  visible: boolean;
  onClose: () => void;
  onEditarApenasEsta: () => void;
  onEditarTodas: () => void;
  dataFormatada: string;
}

export default function ModalEdicaoRecorrente({
  visible,
  onClose,
  onEditarApenasEsta,
  onEditarTodas,
  dataFormatada,
}: ModalEdicaoRecorrenteProps) {
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
            <Ionicons name="create" size={48} color={colors.purple[500]} />
            <Text style={styles.titulo}>Editar transação recorrente</Text>
            <Text style={styles.subtitulo}>
              Esta é uma transação recorrente. O que deseja editar?
            </Text>
          </View>

          {/* Opção 1: Apenas esta */}
          <TouchableOpacity
            style={styles.opcaoButton}
            onPress={onEditarApenasEsta}
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.purple[500]}
            />
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Apenas esta ocorrência</Text>
              <Text style={styles.opcaoDescricao}>
                Edita apenas a transação do dia {dataFormatada}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Opção 2: Todas */}
          <TouchableOpacity style={styles.opcaoButton} onPress={onEditarTodas}>
            <Ionicons name="repeat" size={24} color={colors.purple[500]} />
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Todas as ocorrências</Text>
              <Text style={styles.opcaoDescricao}>
                Edita esta e todas as futuras ocorrências
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
