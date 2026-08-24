import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface RouteStartLocationCardProps {
  locationName: string;
  startLat?: number;
  startLon?: number;
  locationStatus: 'granted' | 'denied' | 'undetermined' | 'loading';
  isLocating: boolean;
  onRequestLocation: () => void;
}

export const RouteStartLocationCard: React.FC<RouteStartLocationCardProps> = ({
  locationName,
  startLat,
  startLon,
  locationStatus,
  isLocating,
  onRequestLocation,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="navigate-circle" size={22} color={ENUMERATOR_THEME.colors.accent} />
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.sectionLabel}>ROUTE ORIGIN</Text>
          <Text style={styles.locationTitle}>{locationName}</Text>
        </View>

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={onRequestLocation}
          disabled={isLocating}
          activeOpacity={0.8}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.accent} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={18}
                color={ENUMERATOR_THEME.colors.accent}
              />
              <Text style={styles.gpsBtnText}>Use GPS Location</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {startLat && startLon ? (
        <View style={styles.coordBox}>
          <Text style={styles.coordText}>
            GPS Coordinates: {startLat.toFixed(4)}°N, {startLon.toFixed(4)}°E
          </Text>
        </View>
      ) : null}

      {locationStatus === 'denied' && (
        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={16} color={ENUMERATOR_THEME.colors.warningText} />
          <Text style={styles.warningText}>
            Location permission is required to calculate your route from your current position. Using
            fallback zone center.
          </Text>
        </View>
      )}
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
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  gpsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  coordBox: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  coordText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.warningText,
  },
});
