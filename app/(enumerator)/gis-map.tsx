import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import {
  loadEnumeratorHouseholds,
  getDerivedZoneMetrics,
  mockSyncStatus,
  mockEnumeratorProfile,
} from '@/src/features/enumeration/data/households';
import { ZoneHouseholdItem } from '@/src/features/enumeration/types';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

import { GISMapHeader } from '@/src/features/enumeration/components/gis-map/GISMapHeader';
import { GISOfflineStatus } from '@/src/features/enumeration/components/gis-map/GISOfflineStatus';
import {
  GISSearchFilterBar,
  StatusFilterOption,
  AreaFilterOption,
} from '@/src/features/enumeration/components/gis-map/GISSearchFilterBar';
import { GISCoverageSummary } from '@/src/features/enumeration/components/gis-map/GISCoverageSummary';
import { GISMapView } from '@/src/features/enumeration/components/gis-map/GISMapView';
import { GISMapLegend } from '@/src/features/enumeration/components/gis-map/GISMapLegend';
import { GISMapControls } from '@/src/features/enumeration/components/gis-map/GISMapControls';
import { GISPrioritySummary } from '@/src/features/enumeration/components/gis-map/GISPrioritySummary';
import { GISAreaCoverage } from '@/src/features/enumeration/components/gis-map/GISAreaCoverage';
import { GISNextHouseholdCard } from '@/src/features/enumeration/components/gis-map/GISNextHouseholdCard';
import { GISSelectedHouseholdCard } from '@/src/features/enumeration/components/gis-map/GISSelectedHouseholdCard';

export default function EnumeratorGisMapScreen() {
  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterOption>('All');
  const [selectedArea, setSelectedArea] = useState<AreaFilterOption>('All Areas');
  const [isPriorityFilterActive, setIsPriorityFilterActive] = useState(false);

  // Selection & Modal state
  const [selectedHousehold, setSelectedHousehold] = useState<ZoneHouseholdItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // GPS Location state
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'granted' | 'denied' | 'undetermined' | 'loading'
  >('loading');
  const [isLocating, setIsLocating] = useState(false);

  // Fetch Household Data
  const loadData = useCallback(async () => {
    const data = await loadEnumeratorHouseholds();
    setHouseholds(data);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Request & Fetch Location
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
      setUserLocation(loc);
    } catch {
      setLocationStatus('denied');
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    requestGpsLocation();
  }, [loadData, requestGpsLocation]);

  // Derived Zone Metrics
  const metrics = getDerivedZoneMetrics(households);

  // Area Names list
  const areaNames = metrics.derivedAreas.map((a) => a.name);

  // Filter Households
  const filteredHouseholds = households.filter((h) => {
    // Search query check
    const matchesSearch =
      h.householdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Priority filter button state
    if (isPriorityFilterActive && h.priority !== 'High') {
      return false;
    }

    // Area filter check
    if (selectedArea !== 'All Areas') {
      if (!h.locality.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }
    }

    // Status filter check
    if (selectedStatus === 'Pending') return h.status === 'Pending';
    if (selectedStatus === 'In Progress') return h.status === 'In Progress';
    if (selectedStatus === 'Completed') return h.status === 'Completed';
    if (selectedStatus === 'Priority') return h.priority === 'High';
    if (selectedStatus === 'Needs Verification') {
      return h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification';
    }
    if (selectedStatus === 'Missing') return h.status === 'Missing';

    return true;
  });

  // Calculate Next Recommended Household
  const getNextRecommendedHousehold = (): ZoneHouseholdItem | null => {
    // 1. High Priority + Pending
    const highPending = households.find((h) => h.priority === 'High' && h.status === 'Pending');
    if (highPending) return highPending;

    // 2. Urgent / Needs Verification
    const needsVer = households.find(
      (h) => h.status === 'Needs Verification' || h.status === 'Missing'
    );
    if (needsVer) return needsVer;

    // 3. Pending in lowest coverage area
    const lowestAreaName = metrics.lowestArea?.name.toLowerCase();
    if (lowestAreaName) {
      const lowestPending = households.find(
        (h) => h.status === 'Pending' && h.locality.toLowerCase().includes(lowestAreaName)
      );
      if (lowestPending) return lowestPending;
    }

    // 4. Other Pending
    const otherPending = households.find((h) => h.status === 'Pending');
    if (otherPending) return otherPending;

    return null;
  };

  const nextRecommended = getNextRecommendedHousehold();

  // Selection handler
  const handleSelectHousehold = (item: ZoneHouseholdItem) => {
    setSelectedHousehold(item);
    setIsDetailModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Page Header */}
      <GISMapHeader
        isOnline={mockEnumeratorProfile.isOnline}
        lastSynced={mockSyncStatus.lastSynced}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {/* Search & Filter Bar */}
      <GISSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
        areaNames={areaNames}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
          />
        }
      >
        {/* Offline Banner */}
        <GISOfflineStatus isOffline={!mockEnumeratorProfile.isOnline} />

        {/* Coverage Summary Overlay */}
        <GISCoverageSummary
          totalHouseholds={metrics.totalHouseholds}
          completedCount={metrics.completedCount}
          inProgressCount={metrics.inProgressCount}
          pendingCount={metrics.pendingCount}
          coveragePercent={metrics.overallCoveragePercent}
          zoneName="Zone A-12 · Ward 12"
        />

        {/* Map View & Floating Controls Stack */}
        <View style={styles.mapSection}>
          <GISMapView
            households={filteredHouseholds}
            selectedHousehold={selectedHousehold}
            onSelectHousehold={handleSelectHousehold}
            userLocation={userLocation}
            locationPermissionStatus={locationStatus}
            onRequestLocationPermission={requestGpsLocation}
          />

          {/* Floating Controls Overlay */}
          <View style={styles.floatingControlsWrap}>
            <GISMapControls
              onCenterMyLocation={requestGpsLocation}
              onRefreshData={handleRefresh}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              isLocating={isLocating}
            />
          </View>

          {/* Floating Legend Overlay */}
          <View style={styles.floatingLegendWrap}>
            <GISMapLegend />
          </View>
        </View>

        {/* Empty Filter State */}
        {filteredHouseholds.length === 0 && (
          <View style={styles.emptyStateCard}>
            <Ionicons
              name="map-outline"
              size={36}
              color={ENUMERATOR_THEME.colors.textMuted}
            />
            <Text style={styles.emptyTitle}>No households match your filter</Text>
            <Text style={styles.emptySub}>
              Try clearing search terms or resetting status and area filters.
            </Text>
          </View>
        )}

        {/* Next Recommended Household */}
        <GISNextHouseholdCard
          household={nextRecommended}
          onOpenHousehold={handleSelectHousehold}
        />

        {/* Priority Summary */}
        <GISPrioritySummary
          highPriorityCount={metrics.highPriorityCount}
          urgentNeedsCount={metrics.urgentNeedsCount}
          needsVerificationCount={metrics.needsVerificationCount}
          missingCount={metrics.missingCount}
          onFilterPriority={() => setIsPriorityFilterActive(!isPriorityFilterActive)}
          isPriorityActive={isPriorityFilterActive}
        />

        {/* Area Coverage Breakdown */}
        <GISAreaCoverage
          areas={metrics.derivedAreas}
          selectedAreaName={selectedArea === 'All Areas' ? '' : selectedArea}
          onSelectArea={(name) =>
            setSelectedArea((prev) => (prev === name ? 'All Areas' : (name as AreaFilterOption)))
          }
        />
      </ScrollView>

      {/* Selected Household Bottom Sheet */}
      <GISSelectedHouseholdCard
        household={selectedHousehold}
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
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
  mapSection: {
    position: 'relative',
  },
  floatingControlsWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  floatingLegendWrap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  emptyStateCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
});
