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
import {
  loadEnumeratorHouseholds,
  updateHouseholdVerificationStatusInStore,
} from '@/src/features/enumeration/data/households';
import { ZoneHouseholdItem } from '@/src/features/enumeration/types';
import {
  filterAndSortVerificationHouseholds,
  getVerificationSummaryMetrics,
} from '@/src/features/enumeration/data/verificationAdapter';
import {
  VerificationFilterCategory,
  VerificationOutcome,
  VerificationSortOption,
} from '@/src/features/enumeration/types/verificationTypes';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

// Component Imports
import { VerificationHeader } from '@/src/features/enumeration/components/verification/VerificationHeader';
import { VerificationSummary } from '@/src/features/enumeration/components/verification/VerificationSummary';
import { VerificationFilterBar } from '@/src/features/enumeration/components/verification/VerificationFilterBar';
import { VerificationSearchBar } from '@/src/features/enumeration/components/verification/VerificationSearchBar';
import { VerificationHouseholdCard } from '@/src/features/enumeration/components/verification/VerificationHouseholdCard';
import { VerificationOutcomeModal } from '@/src/features/enumeration/components/verification/VerificationOutcomeModal';
import {
  VerificationEmptyState,
  VerificationErrorState,
  VerificationFilterEmptyState,
  VerificationLoadingState,
} from '@/src/features/enumeration/components/verification/VerificationEmptyStates';

export default function EnumeratorVerificationScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>();

  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<VerificationFilterCategory>(
    (params.category as VerificationFilterCategory) || 'Pending'
  );
  const [searchQuery, setSearchQuery] = useState<string>(params.query || '');
  const [sortOption, setSortOption] = useState<VerificationSortOption>('Priority');

  const [selectedHouseholdForOutcome, setSelectedHouseholdForOutcome] =
    useState<ZoneHouseholdItem | null>(null);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as VerificationFilterCategory);
    }
  }, [params.category]);

  const loadData = useCallback(async () => {
    setIsError(false);
    try {
      const list = await loadEnumeratorHouseholds();
      setHouseholds(list);
    } catch (err) {
      console.error('Failed to load verification store:', err);
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

  const handleSubmitOutcome = async (
    householdId: string,
    outcome: VerificationOutcome,
    notes: string
  ) => {
    const statusMap: Record<VerificationOutcome, ZoneHouseholdItem['verificationStatus']> = {
      Verified: 'Verified',
      'Needs Recheck': 'Needs Verification',
      'Unable to Verify': 'Not Verified',
    };
    const updated = await updateHouseholdVerificationStatusInStore(
      householdId,
      statusMap[outcome],
      notes
    );
    setHouseholds(updated);
  };

  const metrics = getVerificationSummaryMetrics(households);

  const filterCounts: Record<VerificationFilterCategory, number> = {
    All: households.length,
    Pending: metrics.pendingCount,
    'High Priority': metrics.highPriorityCount,
    Identity: households.filter(
      (h) =>
        h.verificationStatus === 'Pending' ||
        h.verificationStatus === 'Not Verified' ||
        !h.verificationStatus
    ).length,
    Location: households.filter((h) => typeof h.latitude !== 'number').length,
    Anomaly: metrics.needsReviewCount,
    Verified: metrics.verifiedTodayCount,
  };

  const filteredHouseholds = filterAndSortVerificationHouseholds(
    households,
    selectedCategory,
    searchQuery,
    sortOption
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Screen Header */}
      <VerificationHeader
        pendingCount={metrics.pendingCount}
        totalRecordsCount={households.length}
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
        <VerificationSummary
          metrics={metrics}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search & Sort Bar */}
        <VerificationSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          sortOption={sortOption}
          onSelectSort={setSortOption}
        />

        {/* Horizontal Category Filter Bar */}
        <VerificationFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={filterCounts}
        />

        {/* List Content / States */}
        {isLoading ? (
          <VerificationLoadingState />
        ) : isError ? (
          <VerificationErrorState onRetry={loadData} />
        ) : households.length === 0 ? (
          <VerificationEmptyState totalRecordsCount={households.length} />
        ) : filteredHouseholds.length === 0 ? (
          <VerificationFilterEmptyState
            onClearFilters={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <View style={styles.cardList}>
            {filteredHouseholds.map((item) => (
              <VerificationHouseholdCard
                key={item.id}
                household={item}
                onOpenOutcomeModal={setSelectedHouseholdForOutcome}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Verification Outcome & Confirmation Modal */}
      <VerificationOutcomeModal
        visible={!!selectedHouseholdForOutcome}
        household={selectedHouseholdForOutcome}
        onClose={() => setSelectedHouseholdForOutcome(null)}
        onSubmitOutcome={handleSubmitOutcome}
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
