import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

export const RouteLoadingState: React.FC = () => {
  return (
    <View style={styles.stateCard}>
      <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
      <Text style={styles.stateTitle}>Calculating Optimal Field Route...</Text>
      <Text style={styles.stateSub}>
        Evaluating household priorities, statuses, and geographic locations in Zone A-12.
      </Text>
    </View>
  );
};

export const RouteEmptyState: React.FC<{ onRegenerate?: () => void }> = ({ onRegenerate }) => {
  const router = useRouter();

  return (
    <View style={styles.stateCard}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-done-circle" size={40} color={ENUMERATOR_THEME.colors.successText} />
      </View>
      <Text style={styles.stateTitle}>No households require a route right now</Text>
      <Text style={styles.stateSub}>
        All households in your assigned zone have been completed or no pending visits remain eligible for
        field navigation.
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(enumerator)/assigned-zone')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.primaryBtnText}>Back to Assigned Zone</Text>
        </TouchableOpacity>

        {onRegenerate && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={onRegenerate} activeOpacity={0.8}>
            <MaterialCommunityIcons name="reload" size={16} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.secondaryBtnText}>Check Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const RouteLocationErrorState: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.stateCard}>
      <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
        <Ionicons name="location-outline" size={40} color={ENUMERATOR_THEME.colors.danger} />
      </View>
      <Text style={styles.stateTitle}>Route Planning Requires Household Locations</Text>
      <Text style={styles.stateSub}>
        No valid geographic coordinates were found for households in this zone. Field route generation requires spatial location data.
      </Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push('/(enumerator)/assigned-zone')}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
        <Text style={styles.primaryBtnText}>Back to Assigned Zone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stateCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
    marginVertical: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    textAlign: 'center',
  },
  stateSub: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
