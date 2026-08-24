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
import { CitizenReport, ReportStatus } from '@/src/types/admin';
import { statusLabels } from '@/src/data/citizenReportMockData';

interface UpdateStatusModalProps {
  visible: boolean;
  report: CitizenReport | null;
  onConfirm: (status: ReportStatus) => void;
  onCancel: () => void;
}

const AVAILABLE_STATUSES: ReportStatus[] = [
  'pending_verification',
  'assigned',
  'under_investigation',
  'verified',
  'rejected',
  'resolved',
  'closed',
];

export default function UpdateStatusModal({
  visible,
  report,
  onConfirm,
  onCancel,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | null>(
    report?.status || null,
  );

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      setSelectedStatus(null);
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Update Status</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ENUMERATOR_THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {report && (
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle} numberOfLines={2}>
                {report.title}
              </Text>
              <Text style={styles.currentStatus}>
                Current: {statusLabels[report.status]}
              </Text>
            </View>
          )}

          {/* Status list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {AVAILABLE_STATUSES.map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  activeOpacity={0.6}
                  onPress={() => setSelectedStatus(status)}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.statusText, isSelected && styles.statusTextSelected]}>
                    {statusLabels[status]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedStatus && styles.confirmBtnDisabled]}
              activeOpacity={0.6}
              onPress={handleConfirm}
              disabled={!selectedStatus}
            >
              <Text style={styles.confirmBtnText}>Update</Text>
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
    maxHeight: '70%',
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
  currentStatus: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
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
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  statusTextSelected: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '600',
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
