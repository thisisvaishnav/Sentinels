import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { ENUMERATOR_THEME } from '../../theme';
import { GpsLocationData } from '../../types';

interface Props {
  data: GpsLocationData | null;
  onLocationCaptured: (location: GpsLocationData) => void;
  errors?: Record<string, string>;
}

export function LocationGpsCard({ data, onLocationCaptured, errors }: Props) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCaptureLocation = async () => {
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Location permission denied. Move outdoors or enable location services and try again.');
        setIsCapturing(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const captured: GpsLocationData = {
        latitude: `${currentLocation.coords.latitude.toFixed(6)}° N`,
        longitude: `${currentLocation.coords.longitude.toFixed(6)}° E`,
        accuracy: `±${Math.round(currentLocation.coords.accuracy || 10)} m`,
        capturedAt: new Date().toLocaleTimeString(),
      };

      onLocationCaptured(captured);
    } catch {
      setErrorMessage('GPS signal unavailable. Move outdoors or enable location services and try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const isCaptured = !!data;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={22}
          color={isCaptured ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.accent}
        />
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle}>Location & GPS Verification</Text>
          <View style={[styles.statusPill, isCaptured ? styles.statusPillSuccess : styles.statusPillPending]}>
            <View style={[styles.dot, isCaptured ? styles.dotSuccess : styles.dotPending]} />
            <Text style={[styles.statusPillText, isCaptured ? styles.textSuccess : styles.textPending]}>
              {isCaptured ? 'Location Captured' : 'Location Not Captured'}
            </Text>
          </View>
        </View>
      </View>

      {isCaptured ? (
        <View style={styles.gpsBox}>
          <Ionicons name="location" size={24} color={ENUMERATOR_THEME.colors.successText} />
          <View style={styles.gpsTextWrap}>
            <Text style={styles.gpsCoords}>{data.latitude}, {data.longitude}</Text>
            <Text style={styles.gpsAccuracy}>
              Accuracy: {data.accuracy} {data.capturedAt ? `· Recorded at ${data.capturedAt}` : ''}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.unavailBox}>
          <Ionicons name="warning-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.unavailText}>
            {errorMessage || 'Move outdoors or enable location services and try again.'}
          </Text>
        </View>
      )}

      {errors?.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}

      <TouchableOpacity
        style={[styles.btn, isCapturing && styles.btnDisabled]}
        onPress={handleCaptureLocation}
        disabled={isCapturing}
        activeOpacity={0.8}
      >
        {isCapturing ? (
          <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.textWhite} />
        ) : (
          <MaterialCommunityIcons name="map-marker-radius" size={20} color={ENUMERATOR_THEME.colors.textWhite} />
        )}
        <Text style={styles.btnText}>
          {isCapturing ? 'Acquiring GPS Signal...' : isCaptured ? 'Recapture Location' : 'Capture Location'}
        </Text>
      </TouchableOpacity>
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  statusPillSuccess: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  statusPillPending: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSuccess: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotPending: {
    backgroundColor: ENUMERATOR_THEME.colors.textMuted,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSuccess: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  textPending: {
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  gpsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
    gap: 10,
  },
  gpsTextWrap: {
    flex: 1,
  },
  gpsCoords: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.successText,
  },
  gpsAccuracy: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.success,
  },
  unavailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  unavailText: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.danger,
    fontWeight: '500',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
