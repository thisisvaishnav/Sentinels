import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface Props {
  data: GpsLocation | null;
  onLocationCaptured: (location: GpsLocation) => void;
}

export function LocationCard({ data, onLocationCaptured }: Props) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCaptureLocation = async () => {
    setIsCapturing(true);
    setErrorMessage(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Location permission denied. Please enable location services in your device settings.');
        setIsCapturing(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      onLocationCaptured({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      });
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
        <View style={[styles.iconWrap, isCaptured && styles.iconWrapSuccess]}>
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={20}
            color={isCaptured ? T.colors.success : T.colors.accent}
          />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle}>Location & GPS</Text>
          <View style={[styles.statusPill, isCaptured ? styles.statusPillSuccess : styles.statusPillPending]}>
            <View style={[styles.dot, isCaptured ? styles.dotSuccess : styles.dotPending]} />
            <Text style={[styles.statusPillText, isCaptured ? styles.textSuccess : styles.textPending]}>
              {isCaptured ? 'Captured' : 'Not Captured'}
            </Text>
          </View>
        </View>
      </View>

      {isCaptured ? (
        <View style={styles.gpsBox}>
          <Ionicons name="location" size={22} color={T.colors.successText} />
          <View style={styles.gpsTextWrap}>
            <Text style={styles.gpsCoords}>
              {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
            </Text>
            {data.accuracy !== null && (
              <Text style={styles.gpsAccuracy}>Accuracy: ±{Math.round(data.accuracy)} m</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.unavailBox}>
          <Ionicons name="information-circle-outline" size={18} color={T.colors.textMuted} />
          <Text style={styles.unavailText}>
            {errorMessage || 'Capture your GPS coordinates for accurate household location.'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.btn, isCapturing && styles.btnDisabled]}
        onPress={handleCaptureLocation}
        disabled={isCapturing}
        activeOpacity={0.8}
      >
        {isCapturing ? (
          <ActivityIndicator size="small" color={T.colors.textWhite} />
        ) : (
          <MaterialCommunityIcons name="map-marker-radius" size={20} color={T.colors.textWhite} />
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
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSuccess: {
    backgroundColor: T.colors.successBg,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: T.borderRadius.full,
    gap: 5,
  },
  statusPillSuccess: {
    backgroundColor: T.colors.successBg,
  },
  statusPillPending: {
    backgroundColor: T.colors.subtleBackground,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSuccess: {
    backgroundColor: T.colors.success,
  },
  dotPending: {
    backgroundColor: T.colors.textMuted,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSuccess: {
    color: T.colors.successText,
  },
  textPending: {
    color: T.colors.textMuted,
  },
  gpsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.colors.successBg,
    borderRadius: T.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: T.colors.successBorder,
    gap: 10,
  },
  gpsTextWrap: {
    flex: 1,
  },
  gpsCoords: {
    fontSize: 14,
    fontWeight: '700',
    color: T.colors.successText,
  },
  gpsAccuracy: {
    fontSize: 11,
    color: T.colors.success,
    marginTop: 2,
  },
  unavailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.colors.subtleBackground,
    borderRadius: T.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: 8,
  },
  unavailText: {
    flex: 1,
    fontSize: 12,
    color: T.colors.textSecondary,
    lineHeight: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.colors.accent,
    height: 46,
    borderRadius: T.borderRadius.md,
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: T.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
