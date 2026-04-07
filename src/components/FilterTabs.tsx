import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskStatus } from '../types';

const FILTERS: { label: string; value: TaskStatus }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' },
];

export const FilterTabs = ({ active, onSelect }: { active: TaskStatus; onSelect: (f: TaskStatus) => void }) => (
  <View style={styles.container}>
    {FILTERS.map(({ label, value }) => (
      <TouchableOpacity key={value} style={[styles.tab, active === value && styles.activeTab]} onPress={() => onSelect(value)}>
        <Text style={[styles.label, active === value && styles.activeLabel]}>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#EDF2F7', borderRadius: 10, margin: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  label: { fontSize: 13, fontWeight: '500', color: '#718096' },
  activeLabel: { color: '#6C63FF', fontWeight: '700' },
});