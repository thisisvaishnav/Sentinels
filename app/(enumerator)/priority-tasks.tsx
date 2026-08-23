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
  filterPriorityHouseholds,
  getDerivedZoneMetrics,
  loadEnumeratorHouseholds,
  PriorityFilterCategory,
} from '@/src/features/enumeration/data/households';
import { loadMissingReports } from '@/src/features/enumeration/data/missingReports';
import { ZoneHouseholdItem } from '@/src/features/enumeration/types';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

// Modular Components
import { PriorityTasksHeader } from '@/src/features/enumeration/components/priority-tasks/PriorityTasksHeader';
import { PrioritySummarySection } from '@/src/features/enumeration/components/priority-tasks/PrioritySummarySection';
import { PriorityFilterBar } from '@/src/features/enumeration/components/priority-tasks/PriorityFilterBar';
import { PrioritySearchBar } from '@/src/features/enumeration/components/priority-tasks/PrioritySearchBar';
import { PriorityTaskList } from '@/src/features/enumeration/components/priority-tasks/PriorityTaskList';

export default function PriorityTasksScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [missingReportsCount, setMissingReportsCount] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<PriorityFilterCategory>(
    (params.category as PriorityFilterCategory) || 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as PriorityFilterCategory);
    }
  }, [params.category]);

  const loadData = useCallback(async () => {
    const list = await loadEnumeratorHouseholds();
    setHouseholds(list);

    const missingList = await loadMissingReports();
    setMissingReportsCount(missingList.length);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const metrics = getDerivedZoneMetrics(households);

  const filterCounts: Record<PriorityFilterCategory, number> = {
    All: households.length,
    'High Priority': metrics.highPriorityCount,
    Urgent: metrics.urgentNeedsCount,
    'Needs Verification': metrics.needsVerificationCount,
    Missing: Math.max(metrics.missingCount, missingReportsCount),
    Pending: metrics.pendingCount + metrics.inProgressCount,
  };

  const filteredHouseholds = filterPriorityHouseholds(
    households,
    selectedCategory,
    searchQuery
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* 1. Page Header */}
      <PriorityTasksHeader onRefresh={handleRefresh} />

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
        {/* 2. Priority Summary Cards */}
        <PrioritySummarySection
          highPriorityCount={metrics.highPriorityCount}
          urgentNeedsCount={metrics.urgentNeedsCount}
          pendingVerificationCount={metrics.needsVerificationCount}
          missingCount={Math.max(metrics.missingCount, missingReportsCount)}
          overduePendingCount={metrics.pendingCount + metrics.inProgressCount}
        />

        {/* 3. Search Bar */}
        <PrioritySearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* 4. Filter Bar */}
        <PriorityFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={filterCounts}
        />

        {/* 5. Priority Task Cards / List */}
        <PriorityTaskList
          households={filteredHouseholds}
          category={selectedCategory}
          searchQuery={searchQuery}
          onClearFilters={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  bottomSpacer: {
    height: 32,
  },
});
