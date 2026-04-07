import React, { useRef, useState } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet,
  Modal, ActivityIndicator
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

interface Props {
  visible: boolean;
  taskId: string;
  onPhoto: (uri: string, fileName: string) => void;
  onClose: () => void;
}

export const CameraModal: React.FC<Props> = ({ visible, taskId, onPhoto, onClose }) => {
  const cameraRef = useRef<CameraView>(null);
  const [taking, setTaking] = useState(false);

  const handleTakePhoto = async () => {
    if (!cameraRef.current || taking) return;
    setTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
        exif: false,
      });

      if (!photo?.uri) {
        setTaking(false);
        return;
      }

      const docDir = (FileSystem as any).documentDirectory as string ?? '';
      const dir = docDir + 'task_photos/';

      try {
        const info = await FileSystem.getInfoAsync(dir);
        if (!info.exists) {
          await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }
        const fileName = 'task_' + taskId + '_' + Date.now() + '.jpg';
        const destUri = dir + fileName;
        await FileSystem.copyAsync({ from: photo.uri, to: destUri });
        onPhoto(destUri, fileName);
      } catch {
        onPhoto(photo.uri, 'task_' + taskId + '.jpg');
      }

      onClose();
    } catch (e) {
      console.error('Photo error:', e);
      setTaking(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          animateShutter={false}
        >
          <View style={styles.controls}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shutterBtn}
              onPress={handleTakePhoto}
              disabled={taking}
            >
              {taking
                ? <ActivityIndicator color="#fff" size="large" />
                : <View style={styles.shutterInner} />}
            </TouchableOpacity>
            <View style={{ width: 80 }} />
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  cancelBtn: { width: 80, padding: 10 },
  cancelText: { color: '#fff', fontSize: 16 },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});