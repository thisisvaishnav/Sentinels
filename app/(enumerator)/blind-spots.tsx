import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BlindSpotFilterCategory,
  BlindSpotItem,
  BlindSpotSortOption,
  filterAndSortBlindSpots,
  getDerivedBlindSpots,
} from '@/src/features/enumeration/data/blindSpotAdapter';
import { loadEnumeratorHouseholds } from '@/src/features/enumeration/data/households';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

import { BlindSpotsHeader } from '@/src/features/enumeration/components/blind-spots/BlindSpotsHeader';
import { BlindSpotSummarySection } from '@/src/features/enumeration/components/blind-spots/BlindSpotSummarySection';
import { BlindSpotStatusCard } from '@/src/features/enumeration/components/blind-spots/BlindSpotStatusCard';
import { BlindSpotSearchBar } from '@/src/features/enumeration/components/blind-spots/BlindSpotSearchBar';
import { BlindSpotFilterBar } from '@/src/features/enumeration/components/blind-spots/BlindSpotFilterBar';
import { BlindSpotSortBar } from '@/src/features/enumeration/components/blind-spots/BlindSpotSortBar';
import { BlindSpotCard } from '@/src/features/enumeration/components/blind-spots/BlindSpotCard';
import { BlindSpotDetailModal } from '@/src/features/enumeration/components/blind-spots/BlindSpotDetailModal';
import { BlindSpotEmptyState } from '@/src/features/enumeration/components/blind-spots/BlindSpotEmptyState';
import { BlindSpotLoadingState } from '@/src/features/enumeration/components/blind-spots/BlindSpotLoadingState';
import { BlindSpotErrorState } from '@/src/features/enumeration/components/blind-spots/BlindSpotErrorState';

export default function BlindSpotsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [rawItems, setRawItems] = useState<BlindSpotItem[]>([]);
  const [totalHouseholdsCount, setTotalHouseholdsCount] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<BlindSpotFilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<BlindSpotSortOption>('coverage');

  const [selectedDetailItem, setSelectedDetailItem] = useState<BlindSpotItem | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const spots = await getDerivedBlindSpots();
      setRawItems(spots);

      const households = await loadEnumeratorHouseholds();
      setTotalHouseholdsCount(households.length);
    } catch (err) {
      console.error('Failed to load blind spot coverage data:', err);
      setError('Could not analyze area coverage. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(enumerator)/dashboard');
    }
  };

  const handleViewArea = (areaId: string) => {
    router.push({
      pathname: '/(enumerator)/assigned-zone',
      params: { areaId },
    });
  };

  const handleViewMap = (areaId: string) => {
    router.push({
      pathname: '/(enumerator)/gis-map',
      params: { focus: 'blind-spot', areaId },
    });
  };

  const handleStartSurvey = (householdId?: string) => {
    if (householdId) {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId },
      });
    } else {
      router.push('/(enumerator)/start-survey');
    }
  };

  const displayedItems = filterAndSortBlindSpots(rawItems, selectedCategory, searchQuery, sortBy);

  const filterCounts: Record<BlindSpotFilterCategory, number> = {
    All: rawItems.length,
    Critical: rawItems.filter((i) => i.severity === 'critical').length,
    High: rawItems.filter((i) => i.severity === 'high').length,
    Medium: rawItems.filter((i) => i.severity === 'medium').length,
    Low: rawItems.filter((i) => i.severity === 'low').length,
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BlindSpotLoadingState />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BlindSpotErrorState error={error} onRetry={loadData} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* 1. Header */}
      <BlindSpotsHeader onBack={handleBack} onRefresh={handleRefresh} />

      {/* Main Page Scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
            tintColor={ENUMERATOR_THEME.colors.accent}
          />
        }
      >
        {/* 2. Metric Summary */}
        <BlindSpotSummarySection items={rawItems} />

        {/* 3. Local Status Info */}
        <BlindSpotStatusCard totalHouseholdsAnalyzed={totalHouseholdsCount} />

        {/* 4. Search Bar */}
        <BlindSpotSearchBar searchQuery={searchQuery} onChangeSearch={setSearchQuery} />

        {/* 5. Severity Filter Chips */}
        <BlindSpotFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={filterCounts}
        />

        {/* 6. Sorting Selector */}
        <BlindSpotSortBar sortBy={sortBy} onChangeSort={setSortBy} />

        {/* 7. Blind Spot Cards List */}
        {displayedItems.length === 0 ? (
          <BlindSpotEmptyState
            category={selectedCategory}
            hasSearchQuery={searchQuery.trim().length > 0}
            onClearFilters={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <View style={styles.cardsList}>
            {displayedItems.map((item) => (
              <BlindSpotCard
                key={item.id}
                item={item}
                onViewArea={handleViewArea}
                onViewMap={handleViewMap}
                onStartSurvey={handleStartSurvey}
                onOpenDetail={(i) => setSelectedDetailItem(i)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Area Detail Modal */}
      <BlindSpotDetailModal
        item={selectedDetailItem}
        visible={selectedDetailItem !== null}
        onClose={() => setSelectedDetailItem(null)}
        onViewArea={handleViewArea}
        onViewMap={handleViewMap}
        onStartSurvey={handleStartSurvey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  scrollContent: {
    paddingVertical: 14,
    gap: 14,
    paddingBottom: 40,
  },
  cardsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
