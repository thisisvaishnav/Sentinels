import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';
import { mapToHouseholdMarkers, HouseholdMarker } from '../../data/gisAdapter';

// Safely attempt react-native-maps import for native platform map rendering
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

try {
  const MapsModule = require('react-native-maps');
  MapView = MapsModule.default || MapsModule;
  Marker = MapsModule.Marker;
  PROVIDER_DEFAULT = MapsModule.PROVIDER_DEFAULT;
} catch {
  // Safe fallback for web / environments without native binary linking
}

interface GISMapViewProps {
  households: ZoneHouseholdItem[];
  selectedHousehold: ZoneHouseholdItem | null;
  onSelectHousehold: (item: ZoneHouseholdItem) => void;
  userLocation: Location.LocationObject | null;
  locationPermissionStatus: 'granted' | 'denied' | 'undetermined' | 'loading';
  onRequestLocationPermission: () => void;
  onFitAllHouseholds?: () => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({
  households,
  selectedHousehold,
  onSelectHousehold,
  userLocation,
  locationPermissionStatus,
  onRequestLocationPermission,
  onFitAllHouseholds,
}) => {
  const markers: HouseholdMarker[] = mapToHouseholdMarkers(households);

  const [mapRegion, setMapRegion] = useState({
    latitude: 26.8467,
    longitude: 80.9462,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });

  // Center map when selected household changes
  useEffect(() => {
    if (selectedHousehold) {
      const match = markers.find((m) => m.householdId === selectedHousehold.householdId);
      if (match) {
        setMapRegion((prev) => ({
          ...prev,
          latitude: match.latitude,
          longitude: match.longitude,
        }));
      }
    }
  }, [selectedHousehold, markers]);

  const getMarkerColor = (marker: HouseholdMarker) => {
    if (marker.priority === 'High') return '#EF4444';
    if (marker.status === 'Completed') return '#10B981';
    if (marker.status === 'In Progress') return '#F59E0B';
    if (marker.status === 'Needs Verification' || marker.status === 'Missing') return '#D97706';
    return '#0284C7';
  };

  const handleFitAll = () => {
    if (onFitAllHouseholds) {
      onFitAllHouseholds();
    } else {
      setMapRegion({
        latitude: 26.8467,
        longitude: 80.9462,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      });
    }
  };

  // Render native MapView when available (Android/iOS native build)
  if (MapView && Platform.OS !== 'web') {
    return (
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.nativeMap}
          provider={PROVIDER_DEFAULT}
          region={mapRegion}
          onRegionChangeComplete={(r: any) => setMapRegion(r)}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {markers.map((m) => {
            const isSelected = selectedHousehold?.householdId === m.householdId;
            const pinColor = getMarkerColor(m);
            const rawHousehold = households.find((h) => h.householdId === m.householdId) || households[0];

            return (
              <Marker
                key={m.id}
                coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                title={`${m.householdId} — ${m.headName}`}
                description={`${m.locality} · ${m.status}`}
                onPress={() => onSelectHousehold(rawHousehold)}
              >
                <View style={[styles.markerPin, { borderColor: pinColor }, isSelected && styles.markerPinSelected]}>
                  <View style={[styles.markerInner, { backgroundColor: pinColor }]} />
                  <Text style={styles.markerText}>{m.householdId.split('-').pop()}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Floating Fit All Action Bar */}
        <View style={styles.topControlBar}>
          <TouchableOpacity style={styles.fitAllBtn} onPress={handleFitAll} activeOpacity={0.8}>
            <MaterialCommunityIcons name="aspect-ratio" size={16} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.fitAllText}>Fit All Households</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Interactive Field Coverage Canvas for Web & Expo Go
  return (
    <View style={styles.mapWrapper}>
      {/* Top Map Header Controls */}
      <View style={styles.boardHeader}>
        <View style={styles.boardTitleGroup}>
          <MaterialCommunityIcons name="map-marker-path" size={20} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.boardTitle}>Zone A-12 Field Map (Shiv Nagar)</Text>
        </View>

        <TouchableOpacity style={styles.fitAllBtn} onPress={handleFitAll} activeOpacity={0.8}>
          <MaterialCommunityIcons name="aspect-ratio" size={14} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.fitAllText}>Fit All</Text>
        </TouchableOpacity>
      </View>

      {/* Non-blocking GPS Warning */}
      {locationPermissionStatus === 'denied' && (
        <View style={styles.permissionAlert}>
          <Ionicons name="warning-outline" size={16} color={ENUMERATOR_THEME.colors.warningText} />
          <Text style={styles.permissionAlertText}>
            GPS location disabled. Showing default field bounds.
          </Text>
          <TouchableOpacity style={styles.enableBtn} onPress={onRequestLocationPermission}>
            <Text style={styles.enableBtnText}>Enable GPS</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Interactive Grid Canvas */}
      <View style={styles.interactiveGrid}>
        <View style={styles.gridOverlayHeader}>
          <Text style={styles.gridSub}>
            Interactive Spatial Canvas · Zone A-12 (26.8467° N, 80.9462° E)
          </Text>
          {userLocation && (
            <View style={styles.userGpsBadge}>
              <View style={styles.userPulseDot} />
              <Text style={styles.userGpsText}>
                GPS Active
              </Text>
            </View>
          )}
        </View>

        <View style={styles.markerGrid}>
          {markers.map((m) => {
            const isSelected = selectedHousehold?.householdId === m.householdId;
            const color = getMarkerColor(m);
            const rawHousehold = households.find((h) => h.householdId === m.householdId) || households[0];

            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.markerCard,
                  { borderColor: color },
                  isSelected && styles.markerCardSelected,
                ]}
                onPress={() => onSelectHousehold(rawHousehold)}
                activeOpacity={0.75}
              >
                <View style={styles.markerCardHeader}>
                  <View style={[styles.statusDot, { backgroundColor: color }]} />
                  <Text style={styles.markerCardId}>{m.householdId}</Text>
                  {m.priority === 'High' && <Text style={styles.highBadge}>HIGH</Text>}
                </View>
                <Text style={styles.markerCardHead} numberOfLines={1}>
                  {m.headName}
                </Text>
                <Text style={styles.markerCardLocality} numberOfLines={1}>
                  {m.locality}
                </Text>
                <Text style={styles.markerCoordsText}>
                  {m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    height: 380,
    backgroundColor: '#EBF4F6',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  nativeMap: {
    ...StyleSheet.absoluteFillObject,
  },
  topControlBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
  },
  fitAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fitAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  markerPin: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  markerPinSelected: {
    transform: [{ scale: 1.18 }],
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markerText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  boardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  permissionAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  permissionAlertText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.warningText,
    flex: 1,
    fontWeight: '500',
  },
  enableBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  enableBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  interactiveGrid: {
    flex: 1,
    padding: 10,
    gap: 8,
    backgroundColor: '#EBF4F6',
  },
  gridOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  userGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  userGpsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  markerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  markerCard: {
    width: '32%',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 6,
    borderWidth: 1.5,
    gap: 2,
  },
  markerCardSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    transform: [{ scale: 1.04 }],
  },
  markerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  markerCardId: {
    fontSize: 9,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  highBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EF4444',
  },
  markerCardHead: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  markerCardLocality: {
    fontSize: 9,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  markerCoordsText: {
    fontSize: 8,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '600',
  },
});
