import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { CitizenReport } from '@/src/types/admin';

interface VerificationModalProps {
  visible: boolean;
  report: CitizenReport | null;
  onVerify: (notes: string) => void;
  onReject: (reason: string) => void;
  onCancel: () => void;
}

export default function VerificationModal({
  visible,
  report,
  onVerify,
  onReject,
  onCancel,
}: VerificationModalProps) {
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [mode, setMode] = useState<'review' | 'reject'>('review');

  const handleVerify = () => {
    onVerify(notes);
    setNotes('');
    setMode('review');
  };

  const handleReject = () => {
    if (mode === 'reject') {
      onReject(rejectionReason);
      setRejectionReason('');
      setMode('review');
    } else {
      setMode('reject');
    }
  };

  const handleClose = () => {
    setNotes('');
    setRejectionReason('');
    setMode('review');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Review Verification</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {report && (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Report info */}
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle} numberOfLines={2}>
                  {report.title}
                </Text>
                <Text style={styles.reportMeta}>
                  {report.id} • {report.area}
                </Text>
              </View>

              {/* Field notes */}
              {report.verificationNotes && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Field Notes</Text>
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>{report.verificationNotes}</Text>
                  </View>
                </View>
              )}

              {/* Verification image */}
              {report.verificationImageUri && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Verification Photo</Text>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={24} color={COLORS.accent} />
                    <Text style={styles.imagePlaceholderText}>Photo attached</Text>
                  </View>
                </View>
              )}

              {/* Admin notes */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Admin Notes</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Add verification notes..."
                  placeholderTextColor={COLORS.textMuted}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Rejection reason */}
              {mode === 'reject' && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Rejection Reason</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Provide reason for rejection..."
                    placeholderTextColor={COLORS.textMuted}
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              activeOpacity={0.6}
              onPress={handleReject}
            >
              <Text style={styles.rejectBtnText}>
                {mode === 'reject' ? 'Confirm Reject' : 'Reject'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.verifyBtn} activeOpacity={0.6} onPress={handleVerify}>
              <Text style={styles.verifyBtnText}>Verify</Text>
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
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reportInfo: {
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  notesBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    padding: 12,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.accentSoft,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  rejectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  verifyBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});
