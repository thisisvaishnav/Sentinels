import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import AdminLayout from '@/src/components/admin/AdminLayout';
import IntroductionCard from '@/src/components/admin/IntroductionCard';
import MetricCard from '@/src/components/admin/MetricCard';
import LiveMapCard from '@/src/components/admin/LiveMapCard';
import SearchFilter from '@/src/components/admin/SearchFilter';
import EnumeratorCard, { Enumerator } from '@/src/components/admin/EnumeratorCard';
import ComplaintCard from '@/src/components/admin/ComplaintCard';
import FAB from '@/src/components/admin/FAB';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

/* ------------------------------------------------------------------ */
/* Mock data — swap for API calls later                                */
/* ------------------------------------------------------------------ */

const INITIAL_ENUMERATORS: Enumerator[] = [
  { id: '1', name: 'Rajesh Kumar', employeeId: 'EN-1042', area: 'Zone 4 — Sector 12', surveysCompleted: 187, status: 'active' },
  { id: '2', name: 'Priya Sharma', employeeId: 'EN-1058', area: 'Old Town Center', surveysCompleted: 214, status: 'active' },
  { id: '3', name: 'Amit Verma', employeeId: 'EN-1071', area: 'Railway Colony', surveysCompleted: 92, status: 'on-break' },
  { id: '4', name: 'Sneha Patel', employeeId: 'EN-1085', area: 'Green Park Zone', surveysCompleted: 156, status: 'active' },
  { id: '5', name: 'Vikram Singh', employeeId: 'EN-1093', area: 'Sector 7 Hub', surveysCompleted: 48, status: 'inactive' },
  { id: '6', name: 'Anita Desai', employeeId: 'EN-1102', area: 'Zone 2 — Block A', surveysCompleted: 201, status: 'active' },
  { id: '7', name: 'Manoj Gupta', employeeId: 'EN-1115', area: 'Civil Lines', surveysCompleted: 134, status: 'active' },
];

const EXTRA_ENUMERATORS: Enumerator[] = [
  { id: '8', name: 'Deepika Nair', employeeId: 'EN-1128', area: 'University Area', surveysCompleted: 89, status: 'active' },
  { id: '9', name: 'Suresh Yadav', employeeId: 'EN-1134', area: 'Market Road', surveysCompleted: 67, status: 'on-break' },
  { id: '10', name: 'Kavita Joshi', employeeId: 'EN-1141', area: 'Station Extension', surveysCompleted: 112, status: 'active' },
];

const COMPLAINTS = [
  { type: 'GPS Signal Lost', description: 'Enumerator EN-1071 reported persistent GPS signal loss in Railway Colony — data sync may be incomplete for today.', location: 'Railway Colony, Zone 3' },
  { type: 'Survey Equipment', description: 'Multiple enumerators in Sector 7 report tablet freeze on the household form screen during photo capture.', location: 'Sector 7 Hub, Green Park' },
];

const PAGE_SIZE = 3;

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function FieldEnumeratorsScreen() {
  const router = useRouter();
  const { newEnumeratorName, newEnumeratorId } = useLocalSearchParams<{
    newEnumeratorName?: string;
    newEnumeratorId?: string;
  }>();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showExtra, setShowExtra] = useState(false);

  /* Merge initial + extra when "load more" is tapped */
  const allEnumerators = useMemo(
    () => (showExtra ? [...INITIAL_ENUMERATORS, ...EXTRA_ENUMERATORS] : INITIAL_ENUMERATORS),
    [showExtra],
  );

  /* Prepend newly added enumerator (returned from add-new-enumerator) */
  const enumeratorsWithNew = useMemo(() => {
    if (!newEnumeratorName || !newEnumeratorId) return allEnumerators;
    const exists = allEnumerators.some((e) => e.employeeId === newEnumeratorId);
    if (exists) return allEnumerators;
    return [
      {
        id: newEnumeratorId,
        name: newEnumeratorName,
        employeeId: newEnumeratorId,
        area: 'Unassigned',
        surveysCompleted: 0,
        status: 'inactive' as const,
      },
      ...allEnumerators,
    ];
  }, [allEnumerators, newEnumeratorName, newEnumeratorId]);

  /* Search filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return enumeratorsWithNew;
    const q = search.toLowerCase();
    return enumeratorsWithNew.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q),
    );
  }, [search, enumeratorsWithNew]);

  const visibleEnumerators = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const canLoadMore = visibleCount < filtered.length;
  const totalEnumerators = enumeratorsWithNew.length;
  const activeNow = enumeratorsWithNew.filter((e) => e.status === 'active').length;

  const handleLoadMore = useCallback(() => {
    if (!showExtra) {
      setShowExtra(true);
    }
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, [showExtra]);

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <IntroductionCard />

        {/* ── Metric cards ─────────────────────────────────────── */}
        <View style={styles.metricsRow}>
          <MetricCard label="Total Enumerators" value={String(totalEnumerators)} />
          <MetricCard label="Active Now" value={String(activeNow)} accentColor={ENUMERATOR_THEME.colors.success} />
        </View>

        {/* ── Live map ─────────────────────────────────────────── */}
        <LiveMapCard />

        {/* ── Search + filter ──────────────────────────────────── */}
        <SearchFilter value={search} onChangeText={setSearch} onFilterPress={() => Alert.alert('Filter', 'Advanced filters coming soon.')} />

        {/* ── Enumerator list ─────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Field Enumerators ({filtered.length})</Text>
        <View style={styles.stack}>
          {visibleEnumerators.map((enumerator) => (
            <EnumeratorCard
              key={enumerator.id}
              enumerator={enumerator}
              onViewPress={(e) => Alert.alert('Enumerator Details', `${e.name} — ${e.employeeId}`)}
              onMapPress={(e) => Alert.alert('Map View', `Showing location for ${e.name}`)}
            />
          ))}
        </View>

        {/* ── Load More ────────────────────────────────────────── */}
        {canLoadMore && (
          <TouchableOpacity style={styles.loadMoreBtn} activeOpacity={0.7} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}

        {/* ── Urgent complaints ────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Urgent Field Complaints</Text>
        <View style={styles.stack}>
          {COMPLAINTS.map((c, i) => (
            <ComplaintCard key={i} type={c.type} description={c.description} location={c.location} />
          ))}
        </View>

        {/* bottom spacing for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── FAB ───────────────────────────────────────────────── */}
      <FAB onPress={() => router.push('/(admin)/enumerator-command-center')} />
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 10,
  },
  stack: {
    gap: 10,
  },
  loadMoreBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
