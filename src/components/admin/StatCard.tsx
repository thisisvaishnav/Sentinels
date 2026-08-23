import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  variant?: 'default' | 'danger';
  progress?: number; // 0‑100, only shown when variant="danger"
}

export default function StatCard({ icon, label, value, variant = 'default', progress }: StatCardProps) {
  const isDanger = variant === 'danger';

  return (
    <View style={[styles.card, isDanger && styles.cardDanger]}>
      <View style={[styles.iconWrap, isDanger ? styles.iconDanger : styles.iconDefault]}>
        <Ionicons name={icon} size={20} color={isDanger ? COLORS.danger : COLORS.accent} />
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>

      {isDanger && progress !== undefined && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '45%',
  },
  cardDanger: {
    borderColor: COLORS.dangerLight,
    backgroundColor: COLORS.dangerSoft,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconDefault: {
    backgroundColor: COLORS.accentSoft,
  },
  iconDanger: {
    backgroundColor: COLORS.dangerSoft,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
});
