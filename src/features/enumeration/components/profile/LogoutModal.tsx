import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirmLogout,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="logout" size={28} color={ENUMERATOR_THEME.colors.danger} />
          </View>

          <Text style={styles.title}>Confirm Log Out</Text>

          <Text style={styles.description}>
            Are you sure you want to log out of your field enumerator account? Your locally saved household records and survey drafts will remain safely stored on this device.
          </Text>

          <View style={styles.noticeBox}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color={ENUMERATOR_THEME.colors.success} />
            <Text style={styles.noticeText}>
              Local draft data is preserved.
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmLogout} activeOpacity={0.8}>
              <Text style={styles.confirmText}>Log Out</Text>
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
    maxWidth: 340,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.success,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.danger,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
