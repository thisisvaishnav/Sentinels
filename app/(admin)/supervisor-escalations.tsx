import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminLayout from '@/src/components/admin/AdminLayout';
import { COLORS } from '@/constants/adminTheme';
import {
  filterAndSortSupervisorEscalations,
  getSupervisorEscalationMetrics,
  loadSupervisorEscalations,
} from '@/src/features/admin/data/supervisorEscalations';
import {
  EscalationFilterCategory,
  EscalationSortOption,
  SupervisorEscalationItem,
} from '@/src/features/admin/types/supervisorEscalationTypes';
import { SupervisorEscalationCard } from '@/src/features/admin/components/supervisorEscalations/SupervisorEscalationCard';

export default function SupervisorEscalationsScreen() {
  const router = useRouter();

  const [escalations, setEscalations] = useState<SupervisorEscalationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<EscalationFilterCategory>('All');
  const [sortOption, setSortOption] = useState<EscalationSortOption>('Urgent First');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      const list = await loadSupervisorEscalations();
      setEscalations(list);
    } catch (err) {
      console.error('Failed to load supervisor escalations:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleReviewItem = (id: string) => {
    router.push({
      pathname: '/(admin)/supervisor-escalation-details',
      params: { escalationId: id },
    });
  };

  const metrics = getSupervisorEscalationMetrics(escalations);
  const displayedItems = filterAndSortSupervisorEscalations(
    escalations,
    selectedCategory,
    searchQuery,
    sortOption
  );

  const currentDateText = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const categories: EscalationFilterCategory[] = [
    'All',
    'Pending',
    'Urgent',
    'High',
    'In Review',
    'Resolved',
    'Rejected',
    'Senior Reassignment',
    'Field Revisit',
    'Record Correction',
  ];

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ── Control Center Header ───────────────────────────────── */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.titleWrap}>
              <View style={styles.headerIconWrap}>
                <MaterialCommunityIcons name="shield-alert-outline" size={22} color={COLORS.textOnPrimary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Supervisor Escalation Center</Text>
                <Text style={styles.headerSubTitle}>
                  Review field escalation requests and assign follow-up actions.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerMetaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="person-circle-outline" size={14} color={COLORS.primaryLight} />
              <Text style={styles.metaBadgeText}>Supervisor: Dr. R. K. Sharma</Text>
            </View>

            <View style={styles.metaBadge}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.primaryLight} />
              <Text style={styles.metaBadgeText}>{currentDateText}</Text>
            </View>
          </View>
        </View>

        {/* ── Dynamic Summary Cards (Horizontally Scrollable) ───── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsScrollContent}
        >
          <View style={[styles.metricCard, styles.metricPending]}>
            <Text style={styles.metricLabel}>Pending Review</Text>
            <Text style={[styles.metricValue, { color: COLORS.warning }]}>{metrics.pendingCount}</Text>
          </View>

          <View style={[styles.metricCard, styles.metricUrgent]}>
            <Text style={styles.metricLabel}>Urgent</Text>
            <Text style={[styles.metricValue, { color: COLORS.danger }]}>{metrics.urgentCount}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Senior Reassign</Text>
            <Text style={styles.metricValue}>{metrics.seniorReassignmentCount}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Field Revisit</Text>
            <Text style={styles.metricValue}>{metrics.fieldRevisitCount}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>In Review</Text>
            <Text style={[styles.metricValue, { color: COLORS.accent }]}>{metrics.inReviewCount}</Text>
          </View>

          <View style={[styles.metricCard, styles.metricResolved]}>
            <Text style={styles.metricLabel}>Resolved</Text>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>{metrics.resolvedCount}</Text>
          </View>
        </ScrollView>

        {/* ── Search Bar ─────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search request ID, household, enumerator name..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Filter Chips (Horizontally Scrollable) ─────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Sort Option Bar ────────────────────────────────────── */}
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Sort By:</Text>
          <View style={styles.sortOptionsRow}>
            {(['Urgent First', 'Newest', 'Oldest'] as EscalationSortOption[]).map((opt) => {
              const isSelected = sortOption === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.sortChip, isSelected && styles.sortChipSelected]}
                  onPress={() => setSortOption(opt)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sortChipText, isSelected && styles.sortChipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Escalation Items List ──────────────────────────────── */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading supervisor escalations...</Text>
          </View>
        ) : displayedItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="shield-check" size={40} color={COLORS.accent} />
            <Text style={styles.emptyTitle}>
              {escalations.length === 0
                ? 'No supervisor escalation requests.'
                : 'No requests match your filters.'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {escalations.length === 0
                ? 'Field enumerators have not submitted any active escalation requests.'
                : 'Try adjusting your search query or filter category.'}
            </Text>
            {selectedCategory !== 'All' || searchQuery !== '' ? (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.resetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {displayedItems.map((item) => (
              <SupervisorEscalationCard key={item.id} item={item} onReview={handleReviewItem} />
            ))}
          </View>
        )}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 14,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
  },
  headerSubTitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    maxWidth: 240,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 11,
    color: COLORS.textOnPrimary,
    fontWeight: '600',
  },
  metricsScrollContent: {
    gap: 10,
    paddingRight: 4,
  },
  metricCard: {
    minWidth: 105,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  metricPending: {
    backgroundColor: COLORS.warningSoft,
  },
  metricUrgent: {
    backgroundColor: COLORS.dangerSoft,
  },
  metricResolved: {
    backgroundColor: COLORS.successSoft,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  filtersScrollContent: {
    gap: 6,
    paddingRight: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextSelected: {
    color: COLORS.textOnPrimary,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  sortOptionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceAlt,
  },
  sortChipSelected: {
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  sortChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sortChipTextSelected: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  loadingWrap: {
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  listContainer: {
    gap: 12,
  },
});
