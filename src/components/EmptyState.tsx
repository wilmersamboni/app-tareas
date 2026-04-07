import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStatus } from '../types';

const MSG: Record<TaskStatus, { emoji: string; text: string }> = {
  all: { emoji: '📋', text: 'Sin tareas.\nHaz pull-to-refresh para cargar.' },
  pending: { emoji: '✅', text: '¡Todo al día!\nNo tienes tareas pendientes.' },
  completed: { emoji: '🎯', text: 'Aún no completaste ninguna tarea.' },
};

export const EmptyState = ({ filter }: { filter: TaskStatus }) => {
  const { emoji, text } = MSG[filter];
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 48, marginBottom: 12 },
  text: { fontSize: 15, color: '#718096', textAlign: 'center', lineHeight: 22 },
});