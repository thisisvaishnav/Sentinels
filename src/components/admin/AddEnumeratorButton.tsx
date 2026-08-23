import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface AddEnumeratorButtonProps {
  onPress?: () => void;
}

export default function AddEnumeratorButton({ onPress }: AddEnumeratorButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
      onPress={onPress}
    >
      <Ionicons name="person-add-outline" size={15} color={COLORS.textOnPrimary} />
      <Text style={styles.label}>Add Enumerator</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 14,
    height: 36,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});
