import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { loadEnumeratorHouseholds } from '@/src/features/enumeration/data/households';
import { ZoneHouseholdItem } from '@/src/features/enumeration/types';
import {
  detectHouseholdAnomalies,
  filterAndSortAnomalies,
  getAnomalySummaryMetrics,
  loadReviewedAnomalyIds,
  saveReviewedAnomalyIds,
} from '@/src/features/enumeration/data/anomalyAdapter';
import {
  AnomalyFilterCategory,
  AnomalySortOption,
  HouseholdAnomaly,
} from '@/src/features/enumeration/types/anomalyTypes';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

// Component Imports
import { AnomalyHeader } from '@/src/features/enumeration/components/anomalies/AnomalyHeader';
import { AnomalySummaryCards } from '@/src/features/enumeration/components/anomalies/AnomalySummaryCards';
import { AnomalyFilterBar } from '@/src/features/enumeration/components/anomalies/AnomalyFilterBar';
import { AnomalySearchBar } from '@/src/features/enumeration/components/anomalies/AnomalySearchBar';
import { AnomalyCard } from '@/src/features/enumeration/components/anomalies/AnomalyCard';
import { AnomalyDetailModal } from '@/src/features/enumeration/components/anomalies/AnomalyDetailModal';
import {
  AnomalyEmptyState,
  AnomalyErrorState,
  AnomalyFilterEmptyState,
  AnomalyLoadingState,
} from '@/src/features/enumeration/components/anomalies/AnomalyEmptyStates';

export default function EnumeratorAnomaliesScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>();

  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [anomalies, setAnomalies] = useState<HouseholdAnomaly[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<AnomalyFilterCategory>(
    (params.category as AnomalyFilterCategory) || 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>(params.query || '');
  const [sortOption, setSortOption] = useState<AnomalySortOption>('Severity');

  const [selectedAnomaly, setSelectedAnomaly] = useState<HouseholdAnomaly | null>(null);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as AnomalyFilterCategory);
    }
  }, [params.category]);

  const loadData = useCallback(async () => {
    setIsError(false);
    try {
      const [list, reviewed] = await Promise.all([
        loadEnumeratorHouseholds(),
        loadReviewedAnomalyIds(),
      ]);
      setHouseholds(list);
      setReviewedIds(reviewed);

      const detected = detectHouseholdAnomalies(list, reviewed);
      setAnomalies(detected);
    } catch (err) {
      console.error('Failed to analyze anomalies:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleToggleReview = async (anomalyId: string) => {
    const nextReviewed = reviewedIds.includes(anomalyId)
      ? reviewedIds.filter((id) => id !== anomalyId)
      : [...reviewedIds, anomalyId];

    setReviewedIds(nextReviewed);
    await saveReviewedAnomalyIds(nextReviewed);

    // Update anomalies list reviewed status
    setAnomalies((prev) =>
      prev.map((item) => (item.id === anomalyId ? { ...item, reviewed: !item.reviewed } : item))
    );

    if (selectedAnomaly && selectedAnomaly.id === anomalyId) {
      setSelectedAnomaly((prev) => (prev ? { ...prev, reviewed: !prev.reviewed } : null));
    }
  };

  const metrics = getAnomalySummaryMetrics(anomalies);

  const filterCounts: Record<AnomalyFilterCategory, number> = {
    All: anomalies.length,
    Critical: metrics.criticalCount,
    High: metrics.highCount,
    Medium: metrics.mediumCount,
    Low: metrics.lowCount,
    Duplicate: anomalies.filter((a) => a.type === 'duplicate').length,
    Demographic: anomalies.filter((a) => a.type === 'invalid-demographic').length,
    GPS: anomalies.filter((a) => a.type === 'gps-mismatch').length,
    Incomplete: anomalies.filter((a) => a.type === 'incomplete-record').length,
    Verification: anomalies.filter((a) => a.type === 'verification-required').length,
  };

  const filteredAnomalies = filterAndSortAnomalies(
    anomalies,
    selectedCategory,
    searchQuery,
    sortOption
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Screen Header */}
      <AnomalyHeader
        totalCount={anomalies.length}
        totalRecordsAnalyzed={households.length}
        onRefresh={handleRefresh}
      />

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
            tintColor={ENUMERATOR_THEME.colors.accent}
          />
        }
      >
        {/* Dynamic Summary Cards */}
        <AnomalySummaryCards
          metrics={metrics}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search & Sort Bar */}
        <AnomalySearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          sortOption={sortOption}
          onSelectSort={setSortOption}
        />

        {/* Horizontal Category Filter Bar */}
        <AnomalyFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={filterCounts}
        />

        {/* List Content / States */}
        {isLoading ? (
          <AnomalyLoadingState />
        ) : isError ? (
          <AnomalyErrorState onRetry={loadData} />
        ) : anomalies.length === 0 ? (
          <AnomalyEmptyState totalRecordsAnalyzed={households.length} />
        ) : filteredAnomalies.length === 0 ? (
          <AnomalyFilterEmptyState
            onClearFilters={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <View style={styles.cardList}>
            {filteredAnomalies.map((item) => (
              <AnomalyCard
                key={item.id}
                anomaly={item}
                onSelect={setSelectedAnomaly}
                onToggleReview={handleToggleReview}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Detailed Modal Inspection */}
      <AnomalyDetailModal
        visible={!!selectedAnomaly}
        anomaly={selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        onToggleReview={handleToggleReview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  scrollBody: {
    paddingVertical: 12,
    gap: 14,
  },
  cardList: {
    gap: 12,
  },
  bottomSpacer: {
    height: 32,
  },
});
