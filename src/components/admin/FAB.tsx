import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface FABProps {
  onPress?: () => void;
}

export default function FAB({ onPress }: FABProps) {
  return (
    <Pressable style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]} onPress={onPress}>
      <Ionicons name="add" size={28} color={ENUMERATOR_THEME.colors.textWhite} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ENUMERATOR_THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
