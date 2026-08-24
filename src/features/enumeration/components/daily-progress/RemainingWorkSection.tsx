import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface RemainingWorkSectionProps {
  pendingCount: number;
  needsVerificationCount: number;
  highPriorityCount: number;
  urgentNeedsCount: number;
}

export const RemainingWorkSection: React.FC<RemainingWorkSectionProps> = ({
  pendingCount,
  needsVerificationCount,
  highPriorityCount,
  urgentNeedsCount,
}) => {
  const router = useRouter();

  const items = [
    {
      id: 'pending',
      title: 'Pending Households',
      count: pendingCount,
      subtitle: 'Awaiting initial survey visit',
      icon: 'clock-outline' as const,
      color: '#3B82F6',
      route: '/(enumerator)/start-survey',
    },
    {
      id: 'verification',
      title: 'Pending Verification',
      subtitle: 'Requires GIS or field review',
      count: needsVerificationCount,
      icon: 'shield-alert-outline' as const,
      color: '#8B5CF6',
      route: '/(enumerator)/verification',
    },
    {
      id: 'priority',
      title: 'High Priority Households',
      subtitle: 'Urgent action flagged by system',
      count: highPriorityCount,
      icon: 'alert-circle-outline' as const,
      color: '#EF4444',
      route: '/(enumerator)/priority-tasks',
    },
    {
      id: 'urgent',
      title: 'Urgent Ration / Medical Needs',
      subtitle: 'Essential assistance required',
      count: urgentNeedsCount,
      icon: 'medical-bag' as const,
      color: '#F59E0B',
      route: '/(enumerator)/assigned-zone',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Remaining Work Today</Text>
        </View>
        <Text style={styles.subHint}>Action Required</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.75}
            accessibilityLabel={`${item.title}: ${item.count} items. Tap to open.`}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}15` }]}>
              <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
            </View>

            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>{item.subtitle}</Text>
            </View>

            <View style={styles.rightWrap}>
              <View style={[styles.countBadge, { backgroundColor: `${item.color}20` }]}>
                <Text style={[styles.countText, { color: item.color }]}>{item.count}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  subHint: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  list: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextWrap: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    minWidth: 26,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '900',
  },
});
