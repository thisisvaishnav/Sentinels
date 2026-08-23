import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotStatusCardProps {
  totalHouseholdsAnalyzed: number;
}

export const BlindSpotStatusCard: React.FC<BlindSpotStatusCardProps> = ({
  totalHouseholdsAnalyzed,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="radar" size={20} color={ENUMERATOR_THEME.colors.accent} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Coverage Analysis Active</Text>
          <Text style={styles.subtitle}>{totalHouseholdsAnalyzed} local household records analyzed</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Local Protocol</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  badge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
