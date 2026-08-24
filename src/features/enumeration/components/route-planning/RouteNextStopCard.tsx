import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';
import { RouteStop } from '../../types/routeTypes';
import { getHouseholdCoordinate } from '../../data/gisAdapter';

interface RouteNextStopCardProps {
  stop: RouteStop | null;
}

export const RouteNextStopCard: React.FC<RouteNextStopCardProps> = ({ stop }) => {
  const router = useRouter();

  if (!stop || !stop.household) {
    return (
      <View style={styles.completedCard}>
        <Ionicons name="checkmark-circle" size={42} color={ENUMERATOR_THEME.colors.success} />
        <Text style={styles.completedTitle}>Route Completed!</Text>
        <Text style={styles.completedSub}>
          All stops on this planned route have been marked visited.
        </Text>
      </View>
    );
  }

  const { household, sequence, distanceFromPreviousKm } = stop;

  const handleSurveyPress = () => {
    if (household.status === 'Pending') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: household.householdId },
      });
    } else if (household.status === 'In Progress') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: household.householdId },
      });
    } else {
      router.push({
        pathname: '/(enumerator)/register-household',
        params: { householdId: household.householdId },
      });
    }
  };

  const handleNavigatePress = async () => {
    const coord = getHouseholdCoordinate(household);
    if (!coord.latitude || !coord.longitude) {
      Alert.alert('Location Unavailable', 'Coordinates are unavailable for this household.');
      return;
    }

    const label = encodeURIComponent(`${household.headName} (${household.householdId})`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;

    try {
      const supported = await Linking.canOpenURL(mapsUrl);
      if (supported) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert('Navigation Error', 'Could not launch maps application.');
      }
    } catch {
      Alert.alert('Navigation Error', `Maps URL: ${coord.latitude}, ${coord.longitude}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.nextBadge}>
          <MaterialCommunityIcons name="navigation-variant" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.nextBadgeText}>NEXT STOP · #{String(sequence).padStart(2, '0')}</Text>
        </View>

        <View style={styles.distanceChip}>
          <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.distanceText}>{distanceFromPreviousKm} km away</Text>
        </View>
      </View>

      <View style={styles.contentWrap}>
        <Text style={styles.householdId}>{household.householdId}</Text>
        <Text style={styles.headName}>{household.headName}</Text>
        <Text style={styles.addressText}>
          {household.locality} · {household.address || 'Address not listed'}
        </Text>
      </View>

      <View style={styles.tagsRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{household.status}</Text>
        </View>

        {household.priority === 'High' && (
          <View style={styles.highPriorityBadge}>
            <Ionicons name="flash" size={12} color={ENUMERATOR_THEME.colors.danger} />
            <Text style={styles.highPriorityText}>High Priority</Text>
          </View>
        )}

        <Text style={styles.membersCount}>{household.members} members</Text>
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={handleSurveyPress}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.primaryActionText}>
            {household.status === 'Pending' ? 'Start Survey' : 'Continue Survey'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={handleNavigatePress}
          activeOpacity={0.8}
        >
          <Ionicons name="compass-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.secondaryActionText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 2,
    borderColor: ENUMERATOR_THEME.colors.accent,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  nextBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: ENUMERATOR_THEME.colors.textWhite,
    letterSpacing: 0.8,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  contentWrap: {
    gap: 4,
  },
  householdId: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 0.5,
  },
  headName: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  addressText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  highPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  highPriorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
  membersCount: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: ENUMERATOR_THEME.colors.accent,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  completedCard: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.success,
    gap: 8,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.successText,
  },
  completedSub: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
  },
});
