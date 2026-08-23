import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface NotificationErrorStateProps {
  onRetry: () => void;
}

export const NotificationErrorState: React.FC<NotificationErrorStateProps> = ({ onRetry }) => {
  return (
    <View style={styles.card}>
      <Ionicons name="alert-circle-outline" size={36} color={ENUMERATOR_THEME.colors.danger} />
      <Text style={styles.title}>Unable to load notifications</Text>
      <Text style={styles.subtitle}>An error occurred while loading local notification records.</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh" size={14} color="#FFFFFF" />
        <Text style={styles.retryBtnText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
    marginTop: 4,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
