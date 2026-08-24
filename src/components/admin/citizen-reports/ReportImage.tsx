import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ReportImageProps {
  imageUri?: string;
  onPress?: () => void;
}

export default function ReportImage({ imageUri, onPress }: ReportImageProps) {
  if (!imageUri) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={20} color={ENUMERATOR_THEME.colors.textMuted} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.thumbnail}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.thumbnailPlaceholder}>
        <Ionicons name="camera" size={16} color={ENUMERATOR_THEME.colors.accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
  },
  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
