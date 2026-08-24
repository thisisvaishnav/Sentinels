import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface RequestFieldRevisitModalProps {
  visible: boolean;
  enumeratorId: string;
  enumeratorName: string;
  onClose: () => void;
  onConfirm: (
    enumeratorId: string,
    enumeratorName: string,
    preferredDate: string,
    reason: string,
    notes?: string
  ) => Promise<void>;
}

export const RequestFieldRevisitModal: React.FC<RequestFieldRevisitModalProps> = ({
  visible,
  enumeratorId,
  enumeratorName,
  onClose,
  onConfirm,
}) => {
  const [preferredDate, setPreferredDate] = useState<string>('26 Aug 2026');
  const [reason, setReason] = useState<string>('Joint field revisit required for physical structure verification');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(enumeratorId, enumeratorName, preferredDate, reason, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="map-marker-path" size={22} color={COLORS.accent} />
            <Text style={styles.title}>Schedule Field Revisit</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.infoBanner}>
              <Text style={styles.infoLabel}>Assigned Field Team:</Text>
              <Text style={styles.infoValue}>{enumeratorName} ({enumeratorId})</Text>
            </View>

            <Text style={styles.label}>Preferred Revisit Date *</Text>
            <TextInput
              style={styles.input}
              value={preferredDate}
              onChangeText={setPreferredDate}
              placeholder="e.g. 26 Aug 2026"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Revisit Objective / Reason *</Text>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              placeholder="Reason for revisit..."
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Instructions & Notes</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Detailed guidelines for field revisit team..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>Schedule Revisit</Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  infoBanner: {
    backgroundColor: COLORS.accentSoft,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  multilineInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 72,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
