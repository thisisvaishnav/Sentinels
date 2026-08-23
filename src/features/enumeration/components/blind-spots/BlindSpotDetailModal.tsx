import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlindSpotItem } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotDetailModalProps {
  item: BlindSpotItem | null;
  visible: boolean;
  onClose: () => void;
  onViewArea: (areaId: string) => void;
  onViewMap: (areaId: string) => void;
  onStartSurvey: (householdId?: string) => void;
}

export const BlindSpotDetailModal: React.FC<BlindSpotDetailModalProps> = ({
  item,
  visible,
  onClose,
  onViewArea,
  onViewMap,
  onStartSurvey,
}) => {
  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="radar" size={22} color={ENUMERATOR_THEME.colors.accent} />
              <View>
                <Text style={styles.title}>{item.areaName}</Text>
                <Text style={styles.subtitle}>
                  Area {item.areaId} · {item.ward}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Risk & Coverage Card */}
            <View style={styles.riskCard}>
              <View style={styles.riskHeader}>
                <Text style={styles.riskTitle}>Risk Assessment</Text>
                <View style={styles.severityBadge}>
                  <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Coverage Level</Text>
                  <Text style={styles.progressPercent}>{item.coveragePercent}%</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${item.coveragePercent}%` }]} />
                </View>
              </View>
            </View>

            {/* Detailed Numbers Grid */}
            <View style={styles.gridCard}>
              <Text style={styles.cardSectionTitle}>Coverage Breakdown</Text>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Assigned</Text>
                  <Text style={styles.gridValue}>{item.totalHouseholds}</Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Completed</Text>
                  <Text style={[styles.gridValue, { color: ENUMERATOR_THEME.colors.success }]}>
                    {item.completedHouseholds}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Remaining</Text>
                  <Text style={[styles.gridValue, { color: ENUMERATOR_THEME.colors.danger }]}>
                    {item.remainingHouseholds}
                  </Text>
                </View>
              </View>

              <View style={styles.signalsList}>
                <View style={styles.signalRow}>
                  <MaterialCommunityIcons name="flag-outline" size={16} color={ENUMERATOR_THEME.colors.danger} />
                  <Text style={styles.signalLabel}>High Priority Backlog:</Text>
                  <Text style={styles.signalValue}>{item.priorityHouseholdsCount} Households</Text>
                </View>

                <View style={styles.signalRow}>
                  <MaterialCommunityIcons name="file-document-edit-outline" size={16} color="#2563EB" />
                  <Text style={styles.signalLabel}>Pending GIS Verification:</Text>
                  <Text style={styles.signalValue}>{item.needsVerificationCount} Households</Text>
                </View>

                <View style={styles.signalRow}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={16} color={ENUMERATOR_THEME.colors.warning} />
                  <Text style={styles.signalLabel}>Missing / Locked Reports:</Text>
                  <Text style={styles.signalValue}>{item.missingReportsCount} Reports</Text>
                </View>
              </View>
            </View>

            {/* Reason & Action Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Analysis Diagnosis</Text>
              <Text style={styles.infoText}>{item.reason}</Text>
            </View>

            <View style={styles.actionBox}>
              <Text style={styles.actionTitle}>Recommended Action</Text>
              <Text style={styles.actionText}>{item.recommendedAction}</Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.footerBtnSecondary}
              onPress={() => {
                onClose();
                onViewArea(item.areaId);
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="map-marker-path" size={16} color={ENUMERATOR_THEME.colors.textPrimary} />
              <Text style={styles.footerBtnSecondaryText}>View Area</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerBtnSecondary}
              onPress={() => {
                onClose();
                onViewMap(item.areaId);
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="map-search-outline" size={16} color={ENUMERATOR_THEME.colors.textPrimary} />
              <Text style={styles.footerBtnSecondaryText}>View Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerBtnPrimary}
              onPress={() => {
                onClose();
                onStartSurvey(item.recommendedNextHouseholdId);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="clipboard-text-play-outline" size={16} color="#FFFFFF" />
              <Text style={styles.footerBtnPrimaryText}>Start Survey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    gap: 12,
  },
  riskCard: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  severityBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.danger,
  },
  progressContainer: {
    gap: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  gridCard: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gridItem: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  gridLabel: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  signalsList: {
    gap: 6,
    paddingTop: 4,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    flex: 1,
  },
  signalValue: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  infoBox: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 17,
  },
  actionBox: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    gap: 4,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    lineHeight: 17,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  footerBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingVertical: 10,
    gap: 4,
  },
  footerBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  footerBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingVertical: 10,
    gap: 4,
  },
  footerBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
