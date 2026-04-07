import { useState } from 'react';
import { Alert, PermissionsAndroid, Platform, Linking, NativeModules } from 'react-native';

export interface PhotoResult {
  uri: string;
  fileName: string;
  width?: number;
  height?: number;
  size?: number;
}


const { CameraModule } = NativeModules;

const androidVersion = typeof Platform.Version === 'string' 
  ? parseInt(Platform.Version, 10) 
  : Platform.Version;

const requestStoragePermission = async (): Promise<boolean> => {
  const androidVersion = typeof Platform.Version === 'string'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;

  if (androidVersion >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      {
        title: 'Permiso de almacenamiento',
        message: 'DoIt necesita acceso a tus archivos para guardar las fotos.',
        buttonPositive: 'Permitir',
        buttonNegative: 'Cancelar',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (androidVersion >= 29) {
    return true;
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permiso de almacenamiento',
        message: 'DoIt necesita acceso al almacenamiento para guardar las fotos.',
        buttonPositive: 'Permitir',
        buttonNegative: 'Cancelar',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};

export const useCamera = () => {
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async (taskId: string): Promise<PhotoResult | null> => {
    setIsLoading(true);
    try {
      // 1. Permiso de cámara
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso de camara',
          message: 'DoIt necesita acceso a tu camara para adjuntar fotos.',
          buttonPositive: 'Permitir',
          buttonNegative: 'Cancelar',
        }
      );

      if (cameraGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permiso requerido',
          'El permiso de camara fue denegado permanentemente. Habilitalo en Ajustes.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
          ]
        );
        return null;
      }

      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permiso denegado', 'Necesitas dar permiso de camara para adjuntar fotos.');
        return null;
      }

      // 2. Permiso de almacenamiento según versión Android
      const storageGranted = await requestStoragePermission();
      if (!storageGranted) {
        Alert.alert(
          'Permiso denegado',
          'Necesitas dar permiso de almacenamiento para guardar las fotos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
          ]
        );
        return null;
      }

      // 3. Tomar foto
      const result = await CameraModule.takePhoto(taskId);
      if (!result) return null;

      return {
        uri: result.uri,
        fileName: result.fileName,
        width: result.width,
        height: result.height,
        size: result.size,
      };
    } catch (e) {
      console.error('Camera error:', e);
      Alert.alert('Error', 'No se pudo tomar la foto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { takePhoto, isLoading };
};