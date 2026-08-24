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
import { CitizenReport, CitizenReportEnumerator } from '@/src/types/admin';

interface ReassignReportModalProps {
  visible: boolean;
  report: CitizenReport | null;
  enumerators: CitizenReportEnumerator[];
  onConfirm: (enumeratorId: string, enumeratorName: string) => void;
  onCancel: () => void;
}

export default function ReassignReportModal({
  visible,
  report,
  enumerators,
  onConfirm,
  onCancel,
}: ReassignReportModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    report?.enumeratorId || null,
  );

  const handleConfirm = () => {
    const enumerator = enumerators.find((e) => e.id === selectedId);
    if (enumerator) {
      onConfirm(enumerator.id, enumerator.name);
      setSelectedId(null);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Reassign Report</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ENUMERATOR_THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {report && (
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle} numberOfLines={2}>
                {report.title}
              </Text>
              {report.enumeratorName && (
                <Text style={styles.currentEnumerator}>
                  Current: {report.enumeratorName}
                </Text>
              )}
            </View>
          )}

          {/* Enumerator list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {enumerators.map((enumerator) => {
              const isSelected = selectedId === enumerator.id;
              return (
                <TouchableOpacity
                  key={enumerator.id}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  activeOpacity={0.6}
                  onPress={() => setSelectedId(enumerator.id)}
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

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedId && styles.confirmBtnDisabled]}
              activeOpacity={0.6}
              onPress={handleConfirm}
              disabled={!selectedId}
            >
              <Text style={styles.confirmBtnText}>Reassign</Text>
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
  currentEnumerator: {
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
