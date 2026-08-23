import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import {
  getDerivedZoneMetrics,
  loadEnumeratorHouseholds,
} from '@/src/features/enumeration/data/households';
import {
  ZoneActivityItem,
  ZoneHouseholdItem,
} from '@/src/features/enumeration/types';

import { ZoneOverviewCard } from '@/src/features/enumeration/components/assigned-zone/ZoneOverviewCard';
import { CoverageSummaryCard } from '@/src/features/enumeration/components/assigned-zone/CoverageSummaryCard';
import { DailyTargetCard } from '@/src/features/enumeration/components/assigned-zone/DailyTargetCard';
import { PriorityMetricsSection } from '@/src/features/enumeration/components/assigned-zone/PriorityMetricsSection';
import { AreaCoverageList } from '@/src/features/enumeration/components/assigned-zone/AreaCoverageList';
import { PriorityAreaAlertCard } from '@/src/features/enumeration/components/assigned-zone/PriorityAreaAlertCard';
import { RecommendedActionCard } from '@/src/features/enumeration/components/assigned-zone/RecommendedActionCard';
import { ZoneFilterType, ZoneSearchFilterBar, ZoneSortType } from '@/src/features/enumeration/components/assigned-zone/ZoneSearchFilterBar';
import { ZoneHouseholdCard } from '@/src/features/enumeration/components/assigned-zone/ZoneHouseholdCard';
import { ZoneActivityFeed } from '@/src/features/enumeration/components/assigned-zone/ZoneActivityFeed';
import { ZoneSyncOfflineCard } from '@/src/features/enumeration/components/assigned-zone/ZoneSyncOfflineCard';

const MOCK_ACTIVITIES: ZoneActivityItem[] = [
  { id: 'act1', type: 'survey', message: 'Survey completed', timestamp: '10:42 AM', householdId: 'LV-UP-000124' },
  { id: 'act2', type: 'priority', message: 'Household marked high priority', timestamp: '10:15 AM', householdId: 'LV-UP-000129' },
  { id: 'act3', type: 'registration', message: 'New household added', timestamp: '09:48 AM', householdId: 'LV-UP-000137' },
  { id: 'act4', type: 'verification', message: 'Household verification completed', timestamp: '09:21 AM', householdId: 'LV-UP-000118' },
];

export default function AssignedZoneScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [activities] = useState<ZoneActivityItem[]>(MOCK_ACTIVITIES);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ZoneFilterType>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [activeSort, setActiveSort] = useState<ZoneSortType>('Priority first');

  // Load households from local storage on mount & focus
  const fetchHouseholds = async () => {
    const list = await loadEnumeratorHouseholds();
    setHouseholds(list);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHouseholds();
  };

  // Single Source of Truth Metrics Calculation
  const metrics = getDerivedZoneMetrics(households);

  // Filtered & Sorted Household List
  const filteredHouseholds = households.filter((item) => {
    // 1. Search Query Filter
    const matchesSearch =
      item.householdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locality.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Area Filter
    if (selectedArea !== 'All Areas') {
      if (!item.locality.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }
    }

    // 3. Status / Category Filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return item.status === 'Pending';
    if (activeFilter === 'In Progress') return item.status === 'In Progress';
    if (activeFilter === 'Completed') return item.status === 'Completed';
    if (activeFilter === 'Priority') return item.priority === 'High';
    if (activeFilter === 'Needs Verification') {
      return item.status === 'Needs Verification' || item.verificationStatus === 'Needs Verification';
    }
    if (activeFilter === 'Urgent Needs') {
      return (
        item.needs &&
        item.needs.some(
          (n) => n.includes('Ration') || n.includes('Emergency') || n.includes('Health')
        )
      );
    }
    if (activeFilter === 'Missing') return item.status === 'Missing';

    return true;
  });

  const sortedHouseholds = [...filteredHouseholds].sort((a, b) => {
    if (activeSort === 'Priority first') {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return 0;
    }
    if (activeSort === 'Pending first') {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    }
    if (activeSort === 'Lowest coverage area first') {
      const lowestName = metrics.lowestArea?.name.toLowerCase() || 'canal';
      const aIsLowest = a.locality.toLowerCase().includes(lowestName);
      const bIsLowest = b.locality.toLowerCase().includes(lowestName);
      if (aIsLowest && !bIsLowest) return -1;
      if (!aIsLowest && bIsLowest) return 1;
      return 0;
    }
    if (activeSort === 'Household ID') {
      return a.householdId.localeCompare(b.householdId);
    }
    return 0;
  });

  // Recommended Next Action Handler: Scroll to list, filter by area & pending status
  const handleFilterToArea = (areaName: string) => {
    setSelectedArea(areaName);
    setActiveFilter('Pending');
    scrollViewRef.current?.scrollTo({ y: 720, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(enumerator)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBrand}>Lokvision</Text>
          <Text style={styles.headerTitle}>Assigned Zone</Text>
        </View>

        <View style={styles.syncStatusWrap}>
          <View style={[styles.statusDot, isOffline ? styles.dotOffline : styles.dotOnline]} />
          <Text style={styles.statusLabel}>{isOffline ? 'Offline' : 'Online'}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.loadingText}>Loading assigned zone coverage data...</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[ENUMERATOR_THEME.colors.accent]} />}
        >
          {/* Offline / Sync Card */}
          <ZoneSyncOfflineCard
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline(!isOffline)}
            lastSyncedText="2 min ago"
          />

          {/* Section 1: Active Zone Overview Card */}
          <ZoneOverviewCard
            zoneName="Zone A-12"
            ward="Ward 12"
            subArea="Shiv Nagar"
            district="Varanasi"
            pinCode="221005"
            enumeratorId="ENUM001"
          />

          {/* Section 2: Single Source of Truth Coverage Summary Card */}
          <CoverageSummaryCard
            totalHouseholds={metrics.totalHouseholds}
            completedHouseholds={metrics.completedCount}
            inProgressHouseholds={metrics.inProgressCount}
            pendingHouseholds={metrics.pendingCount}
          />

          {/* Section 3: Today's Target Card */}
          <DailyTargetCard target={25} completed={metrics.completedCount} />

          {/* Section 4: Single Source of Truth Priority Metrics */}
          <PriorityMetricsSection
            highPriorityCount={metrics.highPriorityCount}
            urgentNeedsCount={metrics.urgentNeedsCount}
            missingReportsCount={metrics.missingCount}
            pendingVerificationCount={metrics.needsVerificationCount}
            onTilePress={(filterId) => {
              if (
                filterId === 'Priority' ||
                filterId === 'Needs Verification' ||
                filterId === 'Urgent Needs' ||
                filterId === 'Missing'
              ) {
                setActiveFilter(filterId as ZoneFilterType);
                scrollViewRef.current?.scrollTo({ y: 720, animated: true });
              }
            }}
          />

          {/* Section 5: Dynamic Area Coverage List */}
          <AreaCoverageList areas={metrics.derivedAreas} onAreaSelect={handleFilterToArea} />

          {/* Section 6: Priority Area Alert Banner */}
          <PriorityAreaAlertCard areas={metrics.derivedAreas} />

          {/* Section 7: Recommended Next Action */}
          <RecommendedActionCard areas={metrics.derivedAreas} onViewPendingPress={handleFilterToArea} />

          {/* Section 8: Households List & Search/Filter/Sort */}
          <View style={styles.listSection}>
            <Text style={styles.listSectionTitle}>
              Households in this Zone ({sortedHouseholds.length})
            </Text>

            <ZoneSearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
              activeSort={activeSort}
              onSortChange={setActiveSort}
            />

            {sortedHouseholds.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="search" size={28} color={ENUMERATOR_THEME.colors.textMuted} />
                <Text style={styles.emptyTitle}>No Households Found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your area, status, or search query.</Text>
              </View>
            ) : (
              <View style={styles.householdsGrid}>
                {sortedHouseholds.map((item) => (
                  <ZoneHouseholdCard key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>

          {/* Section 9: Recent Zone Activity Feed */}
          <ZoneActivityFeed activities={activities} />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  syncStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotOffline: {
    backgroundColor: '#D97706',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  listSection: {
    gap: 12,
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptyCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  householdsGrid: {
    gap: 10,
  },
  bottomSpacer: {
    height: 32,
  },
});
