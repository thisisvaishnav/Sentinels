import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface PhotoUploadProps {
  imageUri: string | null;
  onPress: () => void;
}

export default function PhotoUpload({ imageUri, onPress }: PhotoUploadProps) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.content} onPress={onPress}>
        <View style={styles.placeholder}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Ionicons name="camera-outline" size={28} color={ENUMERATOR_THEME.colors.textMuted} />
          )}
        </View>
        <Text style={styles.uploadLabel}>Upload Photo</Text>
        <Text style={styles.hint}>JPG or PNG, max 2MB</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    padding: 14,
    marginBottom: 12,
  },
  content: {
    alignItems: 'center',
  },
  placeholder: {
    width: 84,
    height: 84,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.primarySoft,
    borderWidth: 1.5,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 8,
  },
  uploadLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.primary,
    marginBottom: 2,
  },
  hint: {
    fontSize: 9.5,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
