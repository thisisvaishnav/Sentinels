import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  zoneName: string;
  ward: string;
  subArea: string;
  district: string;
  pinCode: string;
  enumeratorId: string;
}

export function ZoneOverviewCard({
  zoneName,
  ward,
  subArea,
  district,
  pinCode,
  enumeratorId,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons name="map-marker-path" size={22} color={ENUMERATOR_THEME.colors.accent} />
          <View>
            <Text style={styles.zoneName}>{zoneName}</Text>
            <Text style={styles.subAreaText}>{subArea} · {ward}</Text>
          </View>
        </View>

        <View style={styles.activeTag}>
          <View style={styles.activeDot} />
          <Text style={styles.activeTagText}>Active Assignment</Text>
        </View>
      </View>

      {/* Detail Grid */}
      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>District & PIN</Text>
          <Text style={styles.detailVal}>{district} ({pinCode})</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Assigned Enumerator</Text>
          <Text style={styles.detailValHighlight}>{enumeratorId}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => router.push('/(enumerator)/gis-map')}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.mapBtnText}>Open Field Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.routeBtn}
          onPress={() => router.push('/(enumerator)/route-planning')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="routes" size={18} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.routeBtnText}>Plan Route</Text>
        </TouchableOpacity>
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
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subAreaText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  detailGrid: {
    flexDirection: 'row',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  detailValHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mapBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  mapBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  routeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  routeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
