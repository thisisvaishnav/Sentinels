import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
  supervisorName: string;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  visible,
  onClose,
  supervisorName,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="help-circle" size={22} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.title}>Help & Field Support</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <View style={styles.noticeBox}>
              <MaterialCommunityIcons name="information" size={18} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.noticeText}>
                For field assignment issues or boundary disputes, contact your assigned supervising authority immediately.
              </Text>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactTitle}>Assigned Supervisor</Text>
              <Text style={styles.supervisorName}>{supervisorName}</Text>
              <Text style={styles.contactSub}>District Field Control Room · Varanasi</Text>
            </View>

            <View style={styles.supportItem}>
              <MaterialCommunityIcons name="phone" size={18} color={ENUMERATOR_THEME.colors.success} />
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemTitle}>Helpline Control Room</Text>
                <Text style={styles.itemSub}>+91 1800 123 4567 (Toll Free)</Text>
              </View>
            </View>

            <View style={styles.supportItem}>
              <MaterialCommunityIcons name="email-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemTitle}>Field Support Email</Text>
                <Text style={styles.itemSub}>support@lokvision.gov.in</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.okBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.okBtnText}>Close</Text>
          </TouchableOpacity>
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
    maxWidth: 360,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    maxHeight: '80%',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 2,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    gap: 12,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.accent,
    lineHeight: 17,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 2,
  },
  contactTitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '600',
  },
  supervisorName: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  contactSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemSub: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  okBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  okBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
