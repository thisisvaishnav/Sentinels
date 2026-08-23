import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneActivityItem } from '../../types';

interface Props {
  activities: ZoneActivityItem[];
}

export function ZoneActivityFeed({ activities }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="history" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Recent Zone Activity</Text>
      </View>

      <View style={styles.feedList}>
        {activities.map((item) => (
          <View key={item.id} style={styles.feedItem}>
            <View style={styles.bulletWrap}>
              <View style={styles.bullet} />
              <View style={styles.line} />
            </View>

            <View style={styles.feedMain}>
              <View style={styles.feedTop}>
                <Text style={styles.feedMessage}>{item.message}</Text>
                <Text style={styles.timeText}>{item.timestamp}</Text>
              </View>
              <Text style={styles.householdIdText}>Ref ID: {item.householdId}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  feedList: {
    gap: 8,
  },
  feedItem: {
    flexDirection: 'row',
    gap: 10,
  },
  bulletWrap: {
    alignItems: 'center',
    width: 14,
    paddingTop: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  line: {
    flex: 1,
    width: 1.5,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    marginTop: 4,
  },
  feedMain: {
    flex: 1,
    gap: 2,
  },
  feedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedMessage: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  householdIdText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '600',
  },
});
