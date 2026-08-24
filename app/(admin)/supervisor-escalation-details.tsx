import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminLayout from '@/src/components/admin/AdminLayout';
import { COLORS } from '@/constants/adminTheme';
import {
  approveRecordCorrection,
  assignSeniorInspector,
  getSupervisorEscalationById,
  rejectSupervisorEscalation,
  requestFieldRevisit,
  resolveSupervisorEscalation,
  startSupervisorReview,
} from '@/src/features/admin/data/supervisorEscalations';
import {
  ResolutionOutcomeType,
  SupervisorEscalationItem,
} from '@/src/features/admin/types/supervisorEscalationTypes';
import { EscalationHistory } from '@/src/features/admin/components/supervisorEscalations/EscalationHistory';
import { AssignSeniorInspectorModal } from '@/src/features/admin/components/supervisorEscalations/AssignSeniorInspectorModal';
import { RequestFieldRevisitModal } from '@/src/features/admin/components/supervisorEscalations/RequestFieldRevisitModal';
import { ResolveEscalationModal } from '@/src/features/admin/components/supervisorEscalations/ResolveEscalationModal';
import { RejectEscalationModal } from '@/src/features/admin/components/supervisorEscalations/RejectEscalationModal';

export default function SupervisorEscalationDetailsScreen() {
  const router = useRouter();
  const { escalationId } = useLocalSearchParams<{ escalationId: string }>();

  const [item, setItem] = useState<SupervisorEscalationItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modal Visibility States
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [showRevisitModal, setShowRevisitModal] = useState<boolean>(false);
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const fetchDetail = useCallback(async () => {
    if (!escalationId) return;
    try {
      const data = await getSupervisorEscalationById(escalationId);
      setItem(data);
    } catch (err) {
      console.error('Failed to load escalation detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [escalationId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleStartReview = async () => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await startSupervisorReview(item.id);
      if (updated) {
        setItem(updated);
        Alert.alert('Review Initiated', `Escalation ${item.id} status set to In Review.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignInspector = async (inspectorId: string, inspectorName: string, notes?: string) => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await assignSeniorInspector(item.id, inspectorId, inspectorName, notes);
      if (updated) {
        setItem(updated);
        Alert.alert('Inspector Assigned', `${inspectorName} has been assigned to case ${item.id}.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldRevisit = async (
    enumeratorId: string,
    enumeratorName: string,
    preferredDate: string,
    reason: string,
    notes?: string
  ) => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await requestFieldRevisit(item.id, enumeratorId, enumeratorName, preferredDate, reason, notes);
      if (updated) {
        setItem(updated);
        Alert.alert('Revisit Scheduled', `Field revisit scheduled for ${preferredDate}.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveCorrection = async () => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await approveRecordCorrection(item.id, 'Record correction approved by supervisor.');
      if (updated) {
        setItem(updated);
        Alert.alert('Correction Approved', `Record correction request approved for ${item.householdId}.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async (outcome: ResolutionOutcomeType, outcomeText: string, notes: string) => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await resolveSupervisorEscalation(item.id, outcome, outcomeText, notes);
      if (updated) {
        setItem(updated);
        Alert.alert('Escalation Resolved', `Escalation ${item.id} marked as resolved.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string, notes: string) => {
    if (!item) return;
    setIsProcessing(true);
    try {
      const updated = await rejectSupervisorEscalation(item.id, reason, notes);
      if (updated) {
        setItem(updated);
        Alert.alert('Escalation Rejected', `Escalation ${item.id} rejected.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading escalation details...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (!item) {
    return (
      <AdminLayout>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={42} color={COLORS.danger} />
          <Text style={styles.emptyTitle}>Escalation Not Found</Text>
          <Text style={styles.emptySubtitle}>The requested escalation record ID could not be retrieved.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Control Center</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  const isClosed = item.status === 'resolved' || item.status === 'rejected';

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation */}
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.navBackBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            <Text style={styles.navBackText}>Supervisor Escalations</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Request Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleGroup}>
              <Text style={styles.titleId}>{item.id}</Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.priBadge,
                    item.priority === 'urgent'
                      ? styles.bgUrgent
                      : item.priority === 'high'
                      ? styles.bgHigh
                      : styles.bgNormal,
                  ]}
                >
                  <Text style={styles.priText}>{item.priority.toUpperCase()}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'pending'
                      ? styles.badgePending
                      : item.status === 'resolved'
                      ? styles.badgeResolved
                      : item.status === 'rejected'
                      ? styles.badgeRejected
                      : styles.badgeReview,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.submittedDate}>
              Submitted: {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          {item.assignedToName ? (
            <View style={styles.assignedBanner}>
              <MaterialCommunityIcons name="account-check-outline" size={16} color={COLORS.primary} />
              <Text style={styles.assignedText}>Assigned: {item.assignedToName} ({item.assignedRole})</Text>
            </View>
          ) : null}
        </View>

        {/* 2. Household Information */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="home-city-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Household Information</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Household ID</Text>
              <Text style={styles.cellValueHighlight}>{item.householdId}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Head of Household</Text>
              <Text style={styles.cellValue}>{item.householdHead}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Locality / Ward</Text>
              <Text style={styles.cellValue}>{item.locality} · {item.ward}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>District</Text>
              <Text style={styles.cellValue}>{item.district}</Text>
            </View>
            {item.address ? (
              <View style={[styles.gridCell, styles.gridFull]}>
                <Text style={styles.cellLabel}>Address</Text>
                <Text style={styles.cellValue}>{item.address}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* 3. Field Enumerator Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="badge-account-horizontal-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Submitting Field Enumerator</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Enumerator Name</Text>
              <Text style={styles.cellValue}>{item.enumeratorName}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Enumerator ID</Text>
              <Text style={styles.cellValue}>{item.enumeratorId}</Text>
            </View>
            {item.zoneName ? (
              <View style={[styles.gridCell, styles.gridFull]}>
                <Text style={styles.cellLabel}>Assigned Zone</Text>
                <Text style={styles.cellValue}>{item.zoneName}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* 4. Anomaly Information */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Flagged Anomaly Context</Text>
          </View>

          <View style={styles.anomalyBox}>
            <Text style={styles.anomalyTitle}>{item.anomalyTitle}</Text>
            <Text style={styles.anomalyDesc}>{item.anomalyDescription}</Text>
            <View style={styles.flaggedRow}>
              <Text style={styles.flaggedLabel}>Reason Flagged:</Text>
              <Text style={styles.flaggedValue}>{item.flaggedReason}</Text>
            </View>
          </View>
        </View>

        {/* 5. Escalation & Enumerator Notes */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="comment-text-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Field Escalation Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Escalation Reason:</Text>
            <Text style={styles.detailValue}>{item.reasonText}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Requested Action:</Text>
            <Text style={styles.actionTextHighlight}>{item.requestedAction.replace('-', ' ').toUpperCase()}</Text>
          </View>

          {item.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Enumerator Observations:</Text>
              <Text style={styles.notesText}>"{item.notes}"</Text>
            </View>
          ) : null}
        </View>

        {/* Revisit Details if scheduled */}
        {item.revisitDetails ? (
          <View style={[styles.card, styles.revisitCard]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="map-marker-path" size={18} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Scheduled Field Revisit</Text>
            </View>
            <Text style={styles.revisitText}>Date: {item.revisitDetails.preferredDate}</Text>
            <Text style={styles.revisitText}>Team: {item.revisitDetails.assignedEnumeratorName} ({item.revisitDetails.assignedEnumeratorId})</Text>
            <Text style={styles.revisitText}>Objective: {item.revisitDetails.reason}</Text>
          </View>
        ) : null}

        {/* Resolution Banner if resolved */}
        {item.resolutionOutcomeText ? (
          <View style={[styles.card, styles.resolvedCard]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="check-decagram" size={18} color={COLORS.success} />
              <Text style={[styles.sectionTitle, { color: COLORS.success }]}>Supervisor Resolution</Text>
            </View>
            <Text style={styles.resolvedOutcomeText}>{item.resolutionOutcomeText}</Text>
            {item.supervisorNotes ? <Text style={styles.resolvedNotesText}>"{item.supervisorNotes}"</Text> : null}
          </View>
        ) : null}

        {/* 6. Action Bar */}
        {!isClosed && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Supervisor Actions</Text>

            <View style={styles.actionsGrid}>
              {item.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnReview]}
                  onPress={handleStartReview}
                  disabled={isProcessing}
                >
                  <MaterialCommunityIcons name="eye-outline" size={16} color={COLORS.textOnPrimary} />
                  <Text style={styles.btnText}>Start Review</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnAssign]}
                onPress={() => setShowAssignModal(true)}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons name="account-arrow-right-outline" size={16} color={COLORS.textOnPrimary} />
                <Text style={styles.btnText}>Assign Inspector</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnRevisit]}
                onPress={() => setShowRevisitModal(true)}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons name="map-marker-path" size={16} color={COLORS.textOnPrimary} />
                <Text style={styles.btnText}>Schedule Revisit</Text>
              </TouchableOpacity>

              {item.requestedAction === 'record-correction' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnCorrection]}
                  onPress={handleApproveCorrection}
                  disabled={isProcessing}
                >
                  <MaterialCommunityIcons name="file-document-edit-outline" size={16} color={COLORS.textOnPrimary} />
                  <Text style={styles.btnText}>Approve Correction</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnResolve]}
                onPress={() => setShowResolveModal(true)}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons name="check-circle-outline" size={16} color={COLORS.textOnPrimary} />
                <Text style={styles.btnText}>Resolve Request</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.btnReject]}
                onPress={() => setShowRejectModal(true)}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons name="close-circle-outline" size={16} color={COLORS.textOnPrimary} />
                <Text style={styles.btnText}>Reject Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 7. Status History Timeline */}
        <EscalationHistory history={item.history} />
      </ScrollView>

      {/* Modals */}
      <AssignSeniorInspectorModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onConfirm={handleAssignInspector}
      />

      <RequestFieldRevisitModal
        visible={showRevisitModal}
        enumeratorId={item.enumeratorId}
        enumeratorName={item.enumeratorName}
        onClose={() => setShowRevisitModal(false)}
        onConfirm={handleFieldRevisit}
      />

      <ResolveEscalationModal
        visible={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={handleResolve}
      />

      <RejectEscalationModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />
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
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    gap: 6,
  },
  titleId: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bgUrgent: { backgroundColor: COLORS.dangerSoft },
  bgHigh: { backgroundColor: COLORS.warningSoft },
  bgNormal: { backgroundColor: COLORS.accentSoft },
  priText: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePending: { backgroundColor: COLORS.warningSoft },
  badgeReview: { backgroundColor: COLORS.infoSoft },
  badgeResolved: { backgroundColor: COLORS.successSoft },
  badgeRejected: { backgroundColor: COLORS.dangerSoft },
  statusText: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  submittedDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  assignedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCell: {
    width: '47%',
    gap: 2,
  },
  gridFull: {
    width: '100%',
  },
  cellLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cellValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
  },
  anomalyBox: {
    backgroundColor: COLORS.warningSoft,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.warningLight,
    gap: 6,
  },
  anomalyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.warning,
  },
  anomalyDesc: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  flaggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  flaggedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  flaggedValue: {
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionTextHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accent,
  },
  notesBox: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
    marginTop: 4,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
  },
  revisitCard: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  revisitText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resolvedCard: {
    backgroundColor: COLORS.successSoft,
    borderColor: COLORS.success,
  },
  resolvedOutcomeText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success,
  },
  resolvedNotesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
  },
  actionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    minWidth: 140,
    justifyContent: 'center',
  },
  btnReview: { backgroundColor: COLORS.info },
  btnAssign: { backgroundColor: COLORS.primary },
  btnRevisit: { backgroundColor: COLORS.accent },
  btnCorrection: { backgroundColor: COLORS.reportOrange },
  btnResolve: { backgroundColor: COLORS.success },
  btnReject: { backgroundColor: COLORS.danger },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
