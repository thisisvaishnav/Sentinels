import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailedEnumeratorProfile } from '../../types/profileTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface ZoneInfoCardProps {
  profile: DetailedEnumeratorProfile;
  onViewZone: () => void;
}

export const ZoneInfoCard: React.FC<ZoneInfoCardProps> = ({ profile, onViewZone }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Active Zone Assignment</Text>
        <View style={styles.activeTag}>
          <Text style={styles.activeTagText}>Assigned</Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Zone Name</Text>
          <Text style={styles.detailValue}>{profile.zoneName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ward & Sector</Text>
          <Text style={styles.detailValue}>{profile.ward} · Shiv Nagar</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>District & PIN</Text>
          <Text style={styles.detailValue}>
            {profile.district} {profile.pinCode}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Supervisor</Text>
          <Text style={styles.detailValue}>{profile.supervisor}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={onViewZone} activeOpacity={0.8}>
        <MaterialCommunityIcons name="map-marker-path" size={18} color="#FFFFFF" />
        <Text style={styles.actionBtnText}>View Assigned Zone</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  activeTag: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  detailsBox: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
});
