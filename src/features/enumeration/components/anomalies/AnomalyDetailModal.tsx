import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';
import { HouseholdAnomaly } from '../../types/anomalyTypes';

import { AnomalyEscalationModal } from './AnomalyEscalationModal';
import { getRequestedActionLabel } from '../../data/anomalyEscalations';

interface AnomalyDetailModalProps {
  visible: boolean;
  anomaly: HouseholdAnomaly | null;
  onClose: () => void;
  onToggleReview: (id: string) => void;
  onEscalateSuccess?: () => void;
}

export const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({
  visible,
  anomaly,
  onClose,
  onToggleReview,
  onEscalateSuccess,
}) => {
  const router = useRouter();
  const [showEscalationModal, setShowEscalationModal] = React.useState<boolean>(false);

  if (!anomaly) return null;

  const handleReviewHousehold = () => {
    onClose();
    router.push({
      pathname: '/(enumerator)/start-survey',
      params: { householdId: anomaly.householdId },
    });
  };

  const handleViewMap = () => {
    onClose();
    router.push('/(enumerator)/gis-map');
  };

  const handleEscalatePress = () => {
    setShowEscalationModal(true);
  };

  const hasCoords = typeof anomaly.latitude === 'number' && typeof anomaly.longitude === 'number';

  return (
    <>
      <Modal visible={visible && !showEscalationModal} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleWrap}>
                <View style={styles.sevBadge}>
                  <Text style={styles.sevBadgeText}>{anomaly.severity.toUpperCase()}</Text>
                </View>
                <Text style={styles.modalTitle} numberOfLines={1}>{anomaly.title}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* Active Escalation Status Banner if Escalated */}
              {anomaly.escalation && (
                <View style={styles.escalationCard}>
                  <View style={styles.escalationCardHeader}>
                    <MaterialCommunityIcons name="shield-alert" size={18} color={ENUMERATOR_THEME.colors.warningText} />
                    <Text style={styles.escalationCardTitle}>Escalation {anomaly.escalation.id}</Text>
                    <View style={styles.escalationStatusBadge}>
                      <Text style={styles.escalationStatusText}>{anomaly.escalation.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.escalationCardAction}>
                    Action: {getRequestedActionLabel(anomaly.escalation.requestedAction)} ({anomaly.escalation.priority.toUpperCase()})
                  </Text>
                  <Text style={styles.escalationCardReason}>Reason: {anomaly.escalation.reasonText}</Text>
                  {anomaly.escalation.notes ? (
                    <Text style={styles.escalationCardNotes}>Notes: "{anomaly.escalation.notes}"</Text>
                  ) : null}
                </View>
              )}

              {/* Household Info Banner */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Household ID:</Text>
                  <Text style={styles.infoValueHighlight}>{anomaly.householdId}</Text>
                </View>
                {anomaly.headName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Head of Household:</Text>
                    <Text style={styles.infoValue}>{anomaly.headName}</Text>
                  </View>
                )}
                {anomaly.areaName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Locality / Area:</Text>
                    <Text style={styles.infoValue}>{anomaly.areaName}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Detection Method:</Text>
                  <Text style={styles.infoValue}>Local Deterministic Rule Engine</Text>
                </View>
              </View>

              {/* What Was Detected */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>What Was Detected</Text>
                <Text style={styles.bodyText}>{anomaly.description}</Text>
              </View>

              {/* Why It Was Detected */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Why It Was Flagged</Text>
                <View style={styles.reasonBox}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={16} color={ENUMERATOR_THEME.colors.warning} />
                  <Text style={styles.reasonText}>{anomaly.reason}</Text>
                </View>
              </View>

              {/* Missing Fields Breakdown if Incomplete Record */}
              {anomaly.missingFields && anomaly.missingFields.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Missing Mandatory Fields</Text>
                  <View style={styles.chipRow}>
                    {anomaly.missingFields.map((field) => (
                      <View key={field} style={styles.missingChip}>
                        <Ionicons name="alert-circle" size={12} color={ENUMERATOR_THEME.colors.dangerText} />
                        <Text style={styles.missingChipText}>{field}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Related Household Records if Duplicate Anomaly */}
              {anomaly.relatedHouseholdIds && anomaly.relatedHouseholdIds.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Related Duplicate Records</Text>
                  <View style={styles.chipRow}>
                    {anomaly.relatedHouseholdIds.map((relId) => (
                      <TouchableOpacity
                        key={relId}
                        style={styles.relatedChip}
                        onPress={() => {
                          onClose();
                          router.push({
                            pathname: '/(enumerator)/start-survey',
                            params: { householdId: relId },
                          });
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="link-outline" size={12} color={ENUMERATOR_THEME.colors.accent} />
                        <Text style={styles.relatedChipText}>{relId}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Coordinates info if GPS anomaly */}
              {hasCoords && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Spatial GPS Coordinates</Text>
                  <View style={styles.coordsBox}>
                    <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                    <Text style={styles.coordsText}>
                      Lat: {anomaly.latitude?.toFixed(4)}, Lon: {anomaly.longitude?.toFixed(4)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Recommended Action */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Recommended Action</Text>
                <View style={styles.actionBox}>
                  <Ionicons name="bulb-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                  <Text style={styles.actionBoxText}>{anomaly.recommendedAction}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerReviewToggle, anomaly.reviewed && styles.footerReviewToggleActive]}
                onPress={() => onToggleReview(anomaly.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={anomaly.reviewed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={anomaly.reviewed ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.textMuted}
                />
                <Text style={[styles.footerToggleText, anomaly.reviewed && styles.footerToggleTextActive]}>
                  {anomaly.reviewed ? 'Reviewed' : 'Mark Reviewed'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerPrimaryBtn} onPress={handleReviewHousehold} activeOpacity={0.8}>
                <Ionicons name="clipboard-outline" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
                <Text style={styles.footerPrimaryText}>Re-survey</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerEscalateBtn} onPress={handleEscalatePress} activeOpacity={0.8}>
                <MaterialCommunityIcons name="shield-alert-outline" size={16} color={ENUMERATOR_THEME.colors.warningText} />
                <Text style={styles.footerEscalateText}>Escalate</Text>
              </TouchableOpacity>

              {hasCoords && (
                <TouchableOpacity style={styles.footerMapBtn} onPress={handleViewMap} activeOpacity={0.8}>
                  <Ionicons name="map-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Escalation Form Modal */}
      <AnomalyEscalationModal
        visible={showEscalationModal}
        anomaly={anomaly}
        onClose={() => setShowEscalationModal(false)}
        onSubmitted={() => {
          setShowEscalationModal(false);
          if (onEscalateSuccess) onEscalateSuccess();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    maxHeight: '85%',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sevBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  sevBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 2,
  },
  scrollBody: {
    padding: 16,
    gap: 14,
  },
  infoCard: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '700',
  },
  infoValueHighlight: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '800',
  },
  section: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  bodyText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
  },
  reasonText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.warningText,
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  missingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  missingChipText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.dangerText,
    fontWeight: '700',
  },
  relatedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  relatedChipText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  coordsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  coordsText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  actionBoxText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.accentDark,
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  footerReviewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  footerReviewToggleActive: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  footerToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  footerToggleTextActive: {
    color: ENUMERATOR_THEME.colors.successText,
    fontWeight: '700',
  },
  footerPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  footerPrimaryText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  footerEscalateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  footerEscalateText: {
    color: ENUMERATOR_THEME.colors.warningText,
    fontSize: 12,
    fontWeight: '700',
  },
  footerMapBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escalationCard: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  escalationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escalationCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  escalationStatusBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  escalationStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  escalationCardAction: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.warningText,
  },
  escalationCardReason: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  escalationCardNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
