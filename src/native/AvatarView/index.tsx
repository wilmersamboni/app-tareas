import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform, requireNativeComponent } from 'react-native';

interface AvatarViewProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

const generateColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 60%, 45%)`;
};

const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

// Componente JS fallback
const JSAvatarView: React.FC<AvatarViewProps> = ({ name, size = 48, style }) => (
  <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: generateColor(name) }, style]}>
    <Text style={[styles.text, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
  </View>
);

// Intenta cargar el componente nativo
let NativeAvatar: React.ComponentType<any> | null = null;
try {
  NativeAvatar = requireNativeComponent('AvatarView');
} catch {
  NativeAvatar = null;
}

export const AvatarView: React.FC<AvatarViewProps> = ({ name, size = 48, style }) => {
  if (NativeAvatar && Platform.OS === 'android') {
    return (
      <NativeAvatar
        name={name}
        style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }, style]}
      />
    );
  }
  return <JSAvatarView name={name} size={size} style={style} />;
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontWeight: '700' },
});