import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Task } from '../database';
import { useTaskStore } from '../store/taskStore';
import { useCamera } from '../hooks/useCamera';

export const TaskItem = ({ task, onUpdate }: { task: Task; onUpdate: () => void }) => {
  const { toggleTask, attachPhoto } = useTaskStore();
  const { takePhoto, isLoading: camLoading } = useCamera();
  const [toggling, setToggling] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(task.attachmentUri);

  const handleToggle = async () => {
  if (toggling) return;
  setToggling(true);
  await toggleTask(task.id, task.completed);
  setToggling(false);
};

  const handlePhoto = async () => {
    const result = await takePhoto(task.id);
    if (result) {
      setPhotoUri(result.uri);
      await attachPhoto(task.id, result.uri);
      onUpdate();
    }
  };

  const handlePhotoPress = () => Alert.alert('Foto adjunta', 'Que deseas hacer?', [
    { text: 'Reemplazar', onPress: handlePhoto },
    { text: 'Cancelar', style: 'cancel' },
  ]);

  return (
    <View style={[styles.card, task.completed && styles.cardDone]}>
      <TouchableOpacity style={styles.row} onPress={handleToggle} activeOpacity={0.7} disabled={toggling}>
        <View style={styles.textBox}>
          <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>{task.title}</Text>
          <Text style={styles.sub}>Usuario #{task.userId}</Text>
        </View>
        {toggling
          ? <ActivityIndicator size="small" color="#6C63FF" />
          : <Switch value={task.completed} onValueChange={handleToggle}
              trackColor={{ false: '#E2E8F0', true: '#6C63FF' }}
              thumbColor="#fff" disabled={toggling} />}
      </TouchableOpacity>
      <View style={styles.photoRow}>
        {photoUri ? (
          <TouchableOpacity onPress={handlePhotoPress} style={styles.thumb}>
            <Image
              source={{ uri: photoUri }}
              style={styles.thumbImg}
              resizeMode="cover"
              onError={() => setPhotoUri(null)}
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Reemplazar</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.attachBtn} onPress={handlePhoto} disabled={camLoading}>
            {camLoading
              ? <ActivityIndicator size="small" color="#6C63FF" />
              : <Text style={styles.attachText}>Adjuntar foto</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginVertical: 6, elevation: 2 },
  cardDone: { backgroundColor: '#F7F5FF', borderLeftWidth: 3, borderLeftColor: '#6C63FF' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 8 },
  textBox: { flex: 1, marginRight: 12 },
  title: { fontSize: 15, fontWeight: '500', color: '#1A202C', lineHeight: 21 },
  titleDone: { color: '#A0AEC0' },
  sub: { fontSize: 12, color: '#718096', marginTop: 4 },
  photoRow: { paddingHorizontal: 16, paddingBottom: 12 },
  attachBtn: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#C7D2FE', borderStyle: 'dashed' },
  attachText: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  thumb: { width: 90, height: 70, borderRadius: 8, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 3, alignItems: 'center' },
  overlayText: { color: '#fff', fontSize: 9, fontWeight: '600' },
});