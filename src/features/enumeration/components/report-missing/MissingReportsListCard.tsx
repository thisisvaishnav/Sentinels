import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MissingHouseholdReport } from '../../types/missingReportTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface MissingReportsListCardProps {
  reports: MissingHouseholdReport[];
  onEditDraft: (report: MissingHouseholdReport) => void;
  onViewReport: (report: MissingHouseholdReport) => void;
}

export const MissingReportsListCard: React.FC<MissingReportsListCardProps> = ({
  reports,
  onEditDraft,
  onViewReport,
}) => {
  if (reports.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={32} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.emptyTitle}>No Missing Reports Filed Yet</Text>
        <Text style={styles.emptySub}>
          Reports filed for unlocated or unverified field households will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <MaterialCommunityIcons name="format-list-bulleted" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.listTitle}>Field Missing Household Reports ({reports.length})</Text>
      </View>

      <View style={styles.list}>
        {reports.map((item) => {
          const isDraft = item.status === 'Draft';
          const isHigh = item.priority === 'High' || item.priority === 'Urgent';

          return (
            <View key={item.reportId} style={styles.reportCard}>
              <View style={styles.cardTop}>
                <View style={styles.idGroup}>
                  <Text style={styles.reportId}>{item.reportId}</Text>
                  {item.householdId && <Text style={styles.householdId}>({item.householdId})</Text>}
                </View>

                <View style={styles.badgesRow}>
                  {isHigh && <Text style={styles.highBadge}>{item.priority}</Text>}
                  <Text style={[styles.statusBadge, isDraft ? styles.draftBadge : styles.submittedBadge]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.reasonText}>
                  Reason: {item.reason === 'Other' ? item.otherReason : item.reason}
                </Text>
                <Text style={styles.localityText}>Locality: {item.locality}</Text>
                {item.headName && <Text style={styles.headText}>Head: {item.headName}</Text>}
                <Text style={styles.dateText}>
                  Filed: {item.visitDate} · {item.syncStatus}
                </Text>
              </View>

              <View style={styles.cardActions}>
                {isDraft ? (
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => onEditDraft(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="pencil-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
                    <Text style={styles.editBtnText}>Edit Draft</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => onViewReport(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="eye-outline" size={14} color={ENUMERATOR_THEME.colors.textSecondary} />
                    <Text style={styles.viewBtnText}>View Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 8,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptyCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  reportCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportId: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  householdId: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  highBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  submittedBadge: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
  detailsRow: {
    gap: 2,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  localityText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  headText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  dateText: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
    paddingTop: 6,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
