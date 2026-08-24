import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ComplaintCardProps {
  type: string;
  description: string;
  location?: string;
}

export default function ComplaintCard({ type, description, location }: ComplaintCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accentLine} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.type}>{type}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Action Required</Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

        {location ? <Text style={styles.location}>{location}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentLine: {
    width: 4,
    backgroundColor: ENUMERATOR_THEME.colors.danger,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  type: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
  badge: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.danger,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  location: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 6,
  },
});
