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
import { SurveyEnumerator } from '@/src/types/admin';

interface ReassignModalProps {
  visible: boolean;
  enumerators: SurveyEnumerator[];
  currentEnumeratorId?: string;
  onConfirm: (enumerator: SurveyEnumerator) => void;
  onCancel: () => void;
}

export default function ReassignModal({
  visible,
  enumerators,
  currentEnumeratorId,
  onConfirm,
  onCancel,
}: ReassignModalProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(currentEnumeratorId);

  const handleConfirm = () => {
    const selected = enumerators.find((e) => e.id === selectedId);
    if (selected) {
      onConfirm(selected);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Reassign Enumerator</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ENUMERATOR_THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

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
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedId && styles.confirmBtnDisabled]}
              activeOpacity={0.6}
              onPress={handleConfirm}
              disabled={!selectedId}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
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
