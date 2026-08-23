import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

// Kept null inside Expo Go client to prevent native map looper freeze
try {
  // MapsModule can be enabled in standalone native production builds
} catch {
  // Safe fallback
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const DEMO_REGION = {
  latitude: 26.8467,
  longitude: 80.9462,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const MARKERS = [
  { id: '1', title: 'Zone 4 — Sector 12', coordinate: { latitude: 26.852, longitude: 80.942 } },
  { id: '2', title: 'Old Town Center', coordinate: { latitude: 26.843, longitude: 80.950 } },
  { id: '3', title: 'Railway Colony', coordinate: { latitude: 26.840, longitude: 80.938 } },
  { id: '4', title: 'Green Park Zone', coordinate: { latitude: 26.855, longitude: 80.955 } },
  { id: '5', title: 'Sector 7 Hub', coordinate: { latitude: 26.838, longitude: 80.948 } },
];

export default function LiveMapCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Live Map View</Text>
      <Text style={styles.subtitle}>Real-time enumerator positions across the city</Text>

      <View style={styles.mapContainer}>
        {MapView && Platform.OS !== 'web' ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={DEMO_REGION}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            {MARKERS.map((m) => (
              <Marker
                key={m.id}
                coordinate={m.coordinate}
                title={m.title}
              >
                <View style={styles.markerDot}>
                  <View style={styles.markerInner} />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={[styles.map, { backgroundColor: '#EBF4F6', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
              Live Field Map Canvas (Lucknow Zone 4)
            </Text>
            <Text style={{ color: '#64748B', fontSize: 11, marginTop: 4 }}>
              5 active enumerator markers tracked
            </Text>
          </View>
        )}

        {/* Overlay: "Live" badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
    </View>
  );
}

const MARKER_SIZE = 16;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    height: 160,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerDot: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: COLORS.mapMarker,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
});
