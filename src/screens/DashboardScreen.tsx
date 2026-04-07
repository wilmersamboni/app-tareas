import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/taskStore';
import { useTasks } from '../hooks/useTasks';
import { TaskItem } from '../components/TaskItem';
import { FilterTabs } from '../components/FilterTabs';
import { EmptyState } from '../components/EmptyState';
import { AvatarView } from '../native/AvatarView';
import { Task } from '../database';

export const DashboardScreen = () => {
  const { filter, isSyncing, syncError, setFilter, sync, setOptimisticToggle } = useTaskStore();
  const { tasks, isLoading, setOptimistic } = useTasks(filter);
 const [updateKey, setUpdateKey] = useState(0)
 
  useEffect(() => { sync(); }, []);

  // Registra la función optimista en el store
  useEffect(() => {
    setOptimisticToggle(setOptimistic);
  }, [setOptimistic]);
 ;



  const handleUpdate = useCallback(() => {
    setUpdateKey(k => k + 1);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        key={`${item.id}-${updateKey}`}
        task={item}
        onUpdate={handleUpdate}
      />
    ),
    [handleUpdate, updateKey]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Tareas</Text>
          <Text style={styles.sub}>{tasks.length} {filter === 'all' ? 'tareas' : filter === 'completed' ? 'completadas' : 'pendientes'}</Text>
        </View>
        <AvatarView name="Wilmer Samboni" size={44} />
      </View>
      {syncError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {syncError}</Text>
        </View>
      )}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${updateKey}`}
        ListHeaderComponent={<FilterTabs active={filter} onSelect={setFilter} />}
        ListEmptyComponent={isLoading
          ? <ActivityIndicator style={{ marginTop: 60 }} color="#6C63FF" size="large" />
          : <EmptyState filter={filter} />}
        contentContainerStyle={tasks.length === 0 ? { flexGrow: 1 } : { paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={sync} colors={['#6C63FF']} tintColor="#6C63FF" />}
        removeClippedSubviews
        maxToRenderPerBatch={15}
        extraData={updateKey}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A202C' },
  sub: { fontSize: 13, color: '#718096', marginTop: 2 },
  errorBanner: { backgroundColor: '#FFF5F5', borderLeftWidth: 3, borderLeftColor: '#FC8181', marginHorizontal: 16, marginBottom: 8, padding: 10, borderRadius: 6 },
  errorText: { color: '#C53030', fontSize: 13 },
});