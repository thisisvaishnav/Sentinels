import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loadEnumeratorHouseholds } from '@/src/features/enumeration/data/households';
import { ZoneHouseholdItem } from '@/src/features/enumeration/types';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

import {
  ActiveRoutePlan,
  RouteStop,
} from '@/src/features/enumeration/types/routeTypes';
import {
  DEFAULT_START_LOCATION,
  getRouteEligibleHouseholds,
  calculateLocalRouteRecommendation,
  recalculateRoutePlanStats,
  loadActiveRoute,
  saveActiveRoute,
  clearActiveRoute,
} from '@/src/features/enumeration/data/routeAdapter';

import { RoutePlanningHeader } from '@/src/features/enumeration/components/route-planning/RoutePlanningHeader';
import { RouteSummaryCard } from '@/src/features/enumeration/components/route-planning/RouteSummaryCard';
import { RouteStartLocationCard } from '@/src/features/enumeration/components/route-planning/RouteStartLocationCard';
import { RouteNextStopCard } from '@/src/features/enumeration/components/route-planning/RouteNextStopCard';
import { RouteStopCard } from '@/src/features/enumeration/components/route-planning/RouteStopCard';
import { AddRouteStopModal } from '@/src/features/enumeration/components/route-planning/AddRouteStopModal';
import { RouteControlsBar } from '@/src/features/enumeration/components/route-planning/RouteControlsBar';
import {
  RouteLoadingState,
  RouteEmptyState,
} from '@/src/features/enumeration/components/route-planning/RoutePlanningStates';
import { GISMapView } from '@/src/features/enumeration/components/gis-map/GISMapView';

export default function RoutePlanningScreen() {
  const router = useRouter();

  // Data & Data loading state
  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Route Plan state
  const [routePlan, setRoutePlan] = useState<ActiveRoutePlan | null>(null);

  // GPS Location state
  const [startLocationName, setStartLocationName] = useState<string>(DEFAULT_START_LOCATION.name);
  const [startLat, setStartLat] = useState<number>(DEFAULT_START_LOCATION.latitude);
  const [startLon, setStartLon] = useState<number>(DEFAULT_START_LOCATION.longitude);
  const [locationStatus, setLocationStatus] = useState<
    'granted' | 'denied' | 'undetermined' | 'loading'
  >('loading');
  const [isLocating, setIsLocating] = useState(false);

  // Add Stop Modal State
  const [isAddStopModalVisible, setIsAddStopModalVisible] = useState(false);

  // Household Map lookup helper
  const householdsMap = useMemo(() => {
    const map = new Map<string, ZoneHouseholdItem>();
    households.forEach((h) => map.set(h.householdId, h));
    return map;
  }, [households]);

  // GPS Location request handler
  const requestGpsLocation = useCallback(async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('denied');
        setIsLocating(false);
        return;
      }

      setLocationStatus('granted');
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (loc && loc.coords) {
        setStartLat(loc.coords.latitude);
        setStartLon(loc.coords.longitude);
        setStartLocationName('My Current Location');
      }
    } catch {
      setLocationStatus('denied');
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Initialize Route Data & Shared Store
  const initializeRoute = useCallback(async () => {
    setIsLoading(true);
    const data = await loadEnumeratorHouseholds();
    setHouseholds(data);

    const hhMap = new Map<string, ZoneHouseholdItem>();
    data.forEach((h) => hhMap.set(h.householdId, h));

    // Try loading saved active route from AsyncStorage
    const savedRoute = await loadActiveRoute();

    if (savedRoute && savedRoute.stops.length > 0) {
      // Re-hydrate saved route stats with latest household records
      const hydratedRoute = recalculateRoutePlanStats(savedRoute, hhMap);
      setRoutePlan(hydratedRoute);
      setStartLat(hydratedRoute.startLatitude);
      setStartLon(hydratedRoute.startLongitude);
      setStartLocationName(hydratedRoute.startLocationName);
    } else {
      // Generate new local route recommendation
      const eligible = getRouteEligibleHouseholds(data);
      if (eligible.length > 0) {
        const newRoute = calculateLocalRouteRecommendation(
          startLat,
          startLon,
          eligible,
          startLocationName
        );
        setRoutePlan(newRoute);
        await saveActiveRoute(newRoute);
      } else {
        setRoutePlan(null);
      }
    }

    setIsLoading(false);
  }, [startLat, startLon, startLocationName]);

  useEffect(() => {
    requestGpsLocation();
    initializeRoute();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await initializeRoute();
    setIsRefreshing(false);
  };

  // Helper to persist updated route plan
  const updateAndSaveRoutePlan = async (newPlan: ActiveRoutePlan) => {
    const updated = recalculateRoutePlanStats(newPlan, householdsMap);
    setRoutePlan(updated);
    await saveActiveRoute(updated);
  };

  // Regenerate route from scratch
  const handleRegenerateRoute = async () => {
    const eligible = getRouteEligibleHouseholds(households);
    if (eligible.length === 0) {
      setRoutePlan(null);
      await clearActiveRoute();
      return;
    }

    const newRoute = calculateLocalRouteRecommendation(
      startLat,
      startLon,
      eligible,
      startLocationName
    );
    setRoutePlan(newRoute);
    await saveActiveRoute(newRoute);
  };

  // Clear route plan
  const handleClearRoute = async () => {
    setRoutePlan(null);
    await clearActiveRoute();
  };

  // Move Stop Up
  const handleMoveStopUp = async (stopId: string) => {
    if (!routePlan) return;
    const index = routePlan.stops.findIndex((s) => s.id === stopId);
    if (index <= 0) return;

    const newStops = [...routePlan.stops];
    const temp = newStops[index - 1];
    newStops[index - 1] = newStops[index];
    newStops[index] = temp;

    await updateAndSaveRoutePlan({
      ...routePlan,
      stops: newStops,
    });
  };

  // Move Stop Down
  const handleMoveStopDown = async (stopId: string) => {
    if (!routePlan) return;
    const index = routePlan.stops.findIndex((s) => s.id === stopId);
    if (index < 0 || index >= routePlan.stops.length - 1) return;

    const newStops = [...routePlan.stops];
    const temp = newStops[index + 1];
    newStops[index + 1] = newStops[index];
    newStops[index] = temp;

    await updateAndSaveRoutePlan({
      ...routePlan,
      stops: newStops,
    });
  };

  // Remove Stop
  const handleRemoveStop = async (stopId: string) => {
    if (!routePlan) return;
    const newStops = routePlan.stops.filter((s) => s.id !== stopId);
    if (newStops.length === 0) {
      await handleClearRoute();
    } else {
      await updateAndSaveRoutePlan({
        ...routePlan,
        stops: newStops,
      });
    }
  };

  // Toggle Visited status
  const handleToggleVisited = async (stopId: string) => {
    if (!routePlan) return;
    const newStops = routePlan.stops.map((s) => {
      if (s.id === stopId) {
        return {
          ...s,
          isVisited: !s.isVisited,
          visitedAt: !s.isVisited ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });

    await updateAndSaveRoutePlan({
      ...routePlan,
      stops: newStops,
    });
  };

  // Add Household Stop
  const handleAddHouseholdStop = async (household: ZoneHouseholdItem) => {
    if (!routePlan) {
      const newRoute = calculateLocalRouteRecommendation(
        startLat,
        startLon,
        [household],
        startLocationName
      );
      setRoutePlan(newRoute);
      await saveActiveRoute(newRoute);
      return;
    }

    const nextSeq = routePlan.stops.length + 1;
    const newStop: RouteStop = {
      id: `stop-${nextSeq}-${household.householdId}`,
      householdId: household.householdId,
      sequence: nextSeq,
      distanceFromPreviousKm: 0,
      isVisited: false,
      household,
    };

    await updateAndSaveRoutePlan({
      ...routePlan,
      stops: [...routePlan.stops, newStop],
    });
  };

  // Calculate Next Stop
  const nextStop = useMemo(() => {
    if (!routePlan) return null;
    return routePlan.stops.find((s) => !s.isVisited) || null;
  }, [routePlan]);

  // Existing Stop IDs Set for Modal lookup
  const existingStopIds = useMemo(() => {
    const set = new Set<string>();
    if (routePlan) {
      routePlan.stops.forEach((s) => set.add(s.householdId));
    }
    return set;
  }, [routePlan]);

  // Eligible households for modal selection
  const eligibleHouseholds = useMemo(() => {
    return getRouteEligibleHouseholds(households);
  }, [households]);

  // Route Households list for Map Preview
  const routeHouseholds = useMemo(() => {
    if (!routePlan) return [];
    return routePlan.stops
      .map((s) => householdsMap.get(s.householdId) || s.household)
      .filter((h): h is ZoneHouseholdItem => Boolean(h));
  }, [routePlan, householdsMap]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Screen Header */}
      <RoutePlanningHeader
        zoneName="Zone A-12"
        onRefresh={handleRefresh}
        isOffline={false}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
          />
        }
      >
        {isLoading ? (
          <RouteLoadingState />
        ) : !routePlan || routePlan.stops.length === 0 ? (
          <RouteEmptyState onRegenerate={handleRegenerateRoute} />
        ) : (
          <>
            {/* Route Summary Overview Card */}
            <RouteSummaryCard routePlan={routePlan} />

            {/* Starting Origin Location Card */}
            <RouteStartLocationCard
              locationName={startLocationName}
              startLat={startLat}
              startLon={startLon}
              locationStatus={locationStatus}
              isLocating={isLocating}
              onRequestLocation={requestGpsLocation}
            />

            {/* Featured Next Stop Card */}
            <RouteNextStopCard stop={nextStop} />

            {/* Route Control Actions */}
            <RouteControlsBar
              onAddStop={() => setIsAddStopModalVisible(true)}
              onRegenerateRoute={handleRegenerateRoute}
              onClearRoute={handleClearRoute}
            />

            {/* Map Preview Component */}
            <View style={styles.mapPreviewSection}>
              <View style={styles.mapHeaderRow}>
                <View style={styles.mapTitleWrap}>
                  <Ionicons name="map-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
                  <Text style={styles.mapTitleText}>Route Map Preview</Text>
                </View>
                <TouchableOpacity
                  style={styles.fullMapBtn}
                  onPress={() => router.push('/(enumerator)/gis-map')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fullMapBtnText}>Open Full GIS Map</Text>
                  <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.accent} />
                </TouchableOpacity>
              </View>

              <View style={styles.mapFrame}>
                <GISMapView
                  households={routeHouseholds}
                  selectedHousehold={null}
                  onSelectHousehold={() => {}}
                  userLocation={
                    startLat && startLon
                      ? ({
                          coords: {
                            latitude: startLat,
                            longitude: startLon,
                            altitude: 0,
                            accuracy: 10,
                            altitudeAccuracy: 10,
                            heading: 0,
                            speed: 0,
                          },
                          timestamp: Date.now(),
                        } as Location.LocationObject)
                      : null
                  }
                  locationPermissionStatus={locationStatus}
                  onRequestLocationPermission={requestGpsLocation}
                />
              </View>
              <Text style={styles.mapLegendNote}>
                * Straight-line route preview. Follow road safety and local navigation guidelines.
              </Text>
            </View>

            {/* Stops List */}
            <View style={styles.stopsSection}>
              <View style={styles.stopsHeaderRow}>
                <Text style={styles.stopsSectionTitle}>Recommended Stops Order</Text>
                <Text style={styles.stopsCountBadge}>{routePlan.stops.length} stops</Text>
              </View>

              <View style={styles.stopsList}>
                {routePlan.stops.map((stop, index) => (
                  <RouteStopCard
                    key={stop.id}
                    stop={stop}
                    isFirst={index === 0}
                    isLast={index === routePlan.stops.length - 1}
                    onMoveUp={handleMoveStopUp}
                    onMoveDown={handleMoveStopDown}
                    onRemove={handleRemoveStop}
                    onToggleVisited={handleToggleVisited}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Route Stop Search Modal */}
      <AddRouteStopModal
        visible={isAddStopModalVisible}
        onClose={() => setIsAddStopModalVisible(false)}
        eligibleHouseholds={eligibleHouseholds}
        existingStopIds={existingStopIds}
        onAddHousehold={handleAddHouseholdStop}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  mapPreviewSection: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  fullMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullMapBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  mapFrame: {
    height: 200,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  mapLegendNote: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  stopsSection: {
    gap: 12,
  },
  stopsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopsSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  stopsCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  stopsList: {
    gap: 10,
  },
});
