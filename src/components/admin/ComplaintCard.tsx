import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

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
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.dangerLight,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentLine: {
    width: 4,
    backgroundColor: COLORS.danger,
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
    color: COLORS.danger,
  },
  badge: {
    backgroundColor: COLORS.dangerSoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.danger,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  location: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
});
