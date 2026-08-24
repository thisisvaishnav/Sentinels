import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { CitizenReport, CitizenReportEnumerator, ReportPriority } from '@/src/types/admin';
import { priorityLabels } from '@/src/data/citizenReportMockData';

interface AssignReportModalProps {
  visible: boolean;
  report: CitizenReport | null;
  enumerators: CitizenReportEnumerator[];
  onAssign: (enumeratorId: string, enumeratorName: string, priority: ReportPriority) => void;
  onCancel: () => void;
}

export default function AssignReportModal({
  visible,
  report,
  enumerators,
  onAssign,
  onCancel,
}: AssignReportModalProps) {
  const [selectedEnumeratorId, setSelectedEnumeratorId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<ReportPriority>(
    report?.priority || 'medium',
  );

  const handleAssign = () => {
    const enumerator = enumerators.find((e) => e.id === selectedEnumeratorId);
    if (enumerator) {
      onAssign(enumerator.id, enumerator.name, selectedPriority);
      setSelectedEnumeratorId(null);
    }
  };

  const handleClose = () => {
    setSelectedEnumeratorId(null);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Assign Report</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ENUMERATOR_THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {report && (
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle} numberOfLines={2}>
                {report.title}
              </Text>
              <Text style={styles.reportMeta}>
                {report.id} • {report.area}
              </Text>
            </View>
          )}

          {/* Enumerator list */}
          <Text style={styles.sectionLabel}>Select Enumerator</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {enumerators.map((enumerator) => {
              const isSelected = selectedEnumeratorId === enumerator.id;
              return (
                <TouchableOpacity
                  key={enumerator.id}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  activeOpacity={0.6}
                  onPress={() => setSelectedEnumeratorId(enumerator.id)}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.name, isSelected && styles.nameSelected]}>
                      {enumerator.name}
                    </Text>
                    <Text style={styles.zone}>{enumerator.zone}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Priority selector */}
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {(Object.entries(priorityLabels) as [ReportPriority, string][]).map(
              ([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.priorityBtn,
                    selectedPriority === key && styles.priorityBtnActive,
                  ]}
                  activeOpacity={0.6}
                  onPress={() => setSelectedPriority(key)}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      selectedPriority === key && styles.priorityBtnTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedEnumeratorId && styles.confirmBtnDisabled]}
              activeOpacity={0.6}
              onPress={handleAssign}
              disabled={!selectedEnumeratorId}
            >
              <Text style={styles.confirmBtnText}>Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 14,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  reportInfo: {
    padding: 16,
    paddingBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    maxHeight: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  rowSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  nameSelected: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  zone: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 1,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  priorityBtn: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBtnActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  priorityBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  priorityBtnTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
