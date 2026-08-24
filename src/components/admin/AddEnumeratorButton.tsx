import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AddEnumeratorButtonProps {
  onPress?: () => void;
}

export default function AddEnumeratorButton({ onPress }: AddEnumeratorButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
      onPress={onPress}
    >
      <Ionicons name="person-add-outline" size={15} color={ENUMERATOR_THEME.colors.textWhite} />
      <Text style={styles.label}>Add Enumerator</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderRadius: 4,
    paddingHorizontal: 14,
    height: 36,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
