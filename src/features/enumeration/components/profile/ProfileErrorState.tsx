import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name="alert-circle-outline" size={32} color={ENUMERATOR_THEME.colors.danger} />
      <Text style={styles.title}>Unable to load profile data.</Text>
      <Text style={styles.message}>{error || 'An unexpected error occurred while loading profile metrics.'}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <MaterialCommunityIcons name="refresh" size={16} color="#FFFFFF" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    margin: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  message: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    marginTop: 6,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
