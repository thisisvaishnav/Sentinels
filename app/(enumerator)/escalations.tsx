import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import {
  cancelAnomalyEscalation,
  getEscalationReasonLabel,
  getRequestedActionLabel,
  loadAnomalyEscalations,
} from '@/src/features/enumeration/data/anomalyEscalations';
import { AnomalyEscalation } from '@/src/features/enumeration/types/anomalyTypes';

type EscalationFilterTab = 'All' | 'pending' | 'in-review' | 'resolved' | 'high' | 'urgent';

export default function EnumeratorEscalationsScreen() {
  const router = useRouter();
  const [escalations, setEscalations] = useState<AnomalyEscalation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<EscalationFilterTab>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const list = await loadAnomalyEscalations();
      setEscalations(list);
    } catch (err) {
      console.error('Failed to load escalations history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancelRequest = async (id: string) => {
    Alert.alert(
      'Cancel Escalation',
      'Are you sure you want to cancel this pending supervisor request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelAnomalyEscalation(id);
            if (success) {
              Alert.alert('Request Cancelled', `Escalation ${id} has been cancelled.`);
              await loadData();
            }
          },
        },
      ]
    );
  };

  const pendingCount = escalations.filter((e) => e.status === 'pending').length;
  const inReviewCount = escalations.filter((e) => e.status === 'in-review' || e.status === 'assigned').length;
  const resolvedCount = escalations.filter((e) => e.status === 'resolved').length;

  const filteredEscalations = escalations.filter((e) => {
    // 1. Filter
    let matchesTab = true;
    if (activeFilter === 'pending') matchesTab = e.status === 'pending';
    else if (activeFilter === 'in-review') matchesTab = e.status === 'in-review' || e.status === 'assigned';
    else if (activeFilter === 'resolved') matchesTab = e.status === 'resolved';
    else if (activeFilter === 'high') matchesTab = e.priority === 'high';
    else if (activeFilter === 'urgent') matchesTab = e.priority === 'urgent';

    if (!matchesTab) return false;

    // 2. Search
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const matchId = e.id.toLowerCase().includes(query);
    const matchHh = e.householdId.toLowerCase().includes(query);
    const matchReason = e.reasonText.toLowerCase().includes(query);
    const matchNotes = e.notes ? e.notes.toLowerCase().includes(query) : false;

    return matchId || matchHh || matchReason || matchNotes;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Supervisor Requests</Text>
          <Text style={styles.headerSubTitle}>Anomaly Escalations & Re-assignments</Text>
        </View>

        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/(enumerator)/anomalies')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.newBtnText}>Escalate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Metric Summary Cards Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsScrollContent}
        >
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Requests</Text>
            <Text style={styles.metricValue}>{escalations.length}</Text>
          </View>

          <View style={[styles.metricCard, styles.cardPending]}>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.warningText }]}>
              {pendingCount}
            </Text>
          </View>

          <View style={[styles.metricCard, styles.cardReview]}>
            <Text style={styles.metricLabel}>In Review</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.accent }]}>
              {inReviewCount}
            </Text>
          </View>

          <View style={[styles.metricCard, styles.cardResolved]}>
            <Text style={styles.metricLabel}>Resolved</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.successText }]}>
              {resolvedCount}
            </Text>
          </View>
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search request ID, household ID, or reason..."
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {(['All', 'pending', 'in-review', 'resolved', 'high', 'urgent'] as EscalationFilterTab[]).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Escalation List */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.loadingText}>Loading escalations history...</Text>
          </View>
        ) : filteredEscalations.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="shield-check" size={38} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.emptyTitle}>No Escalation Requests</Text>
            <Text style={styles.emptySubtitle}>
              {escalations.length === 0
                ? 'You have not submitted any supervisor escalation requests yet.'
                : `No requests found matching filter "${activeFilter}".`}
            </Text>
          </View>
        ) : (
          <View style={styles.escalationList}>
            {filteredEscalations.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <View key={item.id} style={styles.itemCard}>
                  {/* Card Header */}
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTitleWrap}>
                      <Text style={styles.itemId}>{item.id}</Text>
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityBadgeText}>{item.priority.toUpperCase()}</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        item.status === 'pending'
                          ? styles.badgePending
                          : item.status === 'resolved'
                          ? styles.badgeResolved
                          : styles.badgeReview,
                      ]}
                    >
                      <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  {/* Body Info */}
                  <View style={styles.itemBody}>
                    <Text style={styles.householdIdText}>Household: {item.householdId}</Text>
                    <Text style={styles.actionText}>Action: {getRequestedActionLabel(item.requestedAction)}</Text>
                    <Text style={styles.reasonText}>Reason: {item.reasonText}</Text>
                    {item.notes ? <Text style={styles.notesText}>Notes: "{item.notes}"</Text> : null}
                  </View>

                  {/* Footer metadata & actions */}
                  <View style={styles.itemFooter}>
                    <Text style={styles.dateText}>Submitted: {formattedDate}</Text>
                    {item.status === 'pending' && (
                      <TouchableOpacity
                        style={styles.cancelLinkBtn}
                        onPress={() => handleCancelRequest(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.cancelLinkText}>Cancel Request</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  headerSubTitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  newBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  scrollBody: {
    paddingVertical: 12,
    gap: 14,
  },
  metricsScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  metricCard: {
    minWidth: 100,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  cardPending: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  cardReview: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  cardResolved: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  metricLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontWeight: '700',
  },
  loadingWrap: {
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  emptyCard: {
    marginHorizontal: 16,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 28,
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
  emptySubtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  escalationList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemId: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  priorityBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  badgePending: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  badgeReview: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  badgeResolved: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemBody: {
    gap: 4,
  },
  householdIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
  reasonText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  notesText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.borderSubtle,
    paddingTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  cancelLinkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  cancelLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.dangerText,
  },
});
