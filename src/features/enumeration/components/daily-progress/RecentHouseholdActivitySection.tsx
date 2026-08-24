import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface RecentHouseholdActivitySectionProps {
  households: ZoneHouseholdItem[];
}

export const RecentHouseholdActivitySection: React.FC<RecentHouseholdActivitySectionProps> = ({
  households,
}) => {
  const router = useRouter();

  // Take households that have lastVisit or recent status
  const recentHouseholds = households
    .filter((h) => h.lastVisit || h.status === 'Completed' || h.status === 'In Progress' || h.status === 'Needs Verification')
    .slice(0, 4);

  const getStatusBadge = (status: ZoneHouseholdItem['status']) => {
    switch (status) {
      case 'Completed':
        return { text: 'Survey Completed', color: '#059669', bg: '#D1FAE5' };
      case 'In Progress':
        return { text: 'In Progress', color: '#D97706', bg: '#FEF3C7' };
      case 'Needs Verification':
        return { text: 'Needs Verification', color: '#4F46E5', bg: '#EEF2FF' };
      case 'Missing':
        return { text: 'Missing Reported', color: '#DC2626', bg: '#FEE2E2' };
      default:
        return { text: 'Pending Visit', color: '#64748B', bg: '#F1F5F9' };
    }
  };

  const handleHouseholdAction = (item: ZoneHouseholdItem) => {
    if (item.status === 'Completed') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: item.householdId, readOnly: 'true' },
      });
    } else if (item.status === 'In Progress') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: item.householdId },
      });
    } else if (item.status === 'Needs Verification' || item.verificationStatus === 'Needs Verification') {
      router.push({
        pathname: '/(enumerator)/verification',
      });
    } else if (item.status === 'Missing') {
      router.push('/(enumerator)/report-missing');
    } else {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: item.householdId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="home-clock-outline"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Recent Household Actions</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(enumerator)/assigned-zone')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>View Zone</Text>
        </TouchableOpacity>
      </View>

      {recentHouseholds.length === 0 ? (
        <Text style={styles.emptyText}>No recent household activity recorded today.</Text>
      ) : (
        <View style={styles.list}>
          {recentHouseholds.map((item) => {
            const badge = getStatusBadge(item.status);
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <View style={styles.topInfo}>
                    <Text style={styles.hhId}>{item.householdId}</Text>
                    <Text style={styles.headName}>{item.headName}</Text>
                  </View>

                  <Text style={styles.localityText}>
                    {item.locality} · {item.members} members
                  </Text>

                  <View style={styles.bottomInfo}>
                    <View style={[styles.statusTag, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusTagText, { color: badge.color }]}>
                        {badge.text}
                      </Text>
                    </View>
                    <Text style={styles.visitTime}>{item.lastVisit || 'Today'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleHouseholdAction(item)}
                  activeOpacity={0.75}
                  accessibilityLabel={`Open ${item.headName} details`}
                >
                  <Text style={styles.actionBtnText}>
                    {item.status === 'Completed'
                      ? 'View'
                      : item.status === 'In Progress'
                      ? 'Resume'
                      : item.status === 'Needs Verification'
                      ? 'Verify'
                      : 'Open'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.accent} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  emptyText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hhId: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  headName: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  localityText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  visitTime: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    marginLeft: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
