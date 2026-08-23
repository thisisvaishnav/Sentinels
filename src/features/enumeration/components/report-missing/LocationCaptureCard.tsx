import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface LocationCaptureCardProps {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  locality: string;
  ward: string;
  pinCode: string;
  isCapturing: boolean;
  onCaptureLocation: () => void;
  onChangeLocality: (text: string) => void;
  onChangeWard: (text: string) => void;
  onChangePinCode: (text: string) => void;
}

export const LocationCaptureCard: React.FC<LocationCaptureCardProps> = ({
  latitude,
  longitude,
  accuracy,
  locality,
  ward,
  pinCode,
  isCapturing,
  onCaptureLocation,
  onChangeLocality,
  onChangeWard,
  onChangePinCode,
}) => {
  const hasGps = latitude !== undefined && longitude !== undefined;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>1. Location Information</Text>
      </View>

      {/* GPS Capture Status */}
      <View style={[styles.gpsBox, hasGps ? styles.gpsBoxActive : styles.gpsBoxInactive]}>
        <View style={styles.gpsInfoLeft}>
          <Ionicons
            name={hasGps ? 'location' : 'location-outline'}
            size={20}
            color={hasGps ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.textMuted}
          />
          <View>
            <Text style={styles.gpsStatusLabel}>
              {hasGps ? 'GPS Location Captured' : 'GPS Coordinates Pending'}
            </Text>
            {hasGps ? (
              <Text style={styles.gpsCoordsText}>
                {latitude?.toFixed(5)}° N, {longitude?.toFixed(5)}° E (±{accuracy?.toFixed(1) || '10'}m)
              </Text>
            ) : (
              <Text style={styles.gpsSubText}>Tap button to capture field coordinates</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.captureBtn}
          onPress={onCaptureLocation}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.accent} />
          ) : (
            <Text style={styles.captureBtnText}>{hasGps ? 'Retry GPS' : 'Capture GPS'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Metadata Inputs */}
      <View style={styles.inputsRow}>
        <View style={styles.inputGroupFlex}>
          <Text style={styles.label}>Locality / Area *</Text>
          <TextInput
            style={styles.input}
            value={locality}
            onChangeText={onChangeLocality}
            placeholder="e.g. Shiv Nagar West"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>

        <View style={styles.inputGroupSmall}>
          <Text style={styles.label}>Ward</Text>
          <TextInput
            style={styles.input}
            value={ward}
            onChangeText={onChangeWard}
            placeholder="Ward 12"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>

        <View style={styles.inputGroupSmall}>
          <Text style={styles.label}>PIN Code</Text>
          <TextInput
            style={styles.input}
            value={pinCode}
            onChangeText={onChangePinCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="221005"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  gpsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
  },
  gpsBoxActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  gpsBoxInactive: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  gpsInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gpsStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  gpsCoordsText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.success,
  },
  gpsSubText: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  captureBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  captureBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputGroupFlex: {
    flex: 2,
    gap: 4,
  },
  inputGroupSmall: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
