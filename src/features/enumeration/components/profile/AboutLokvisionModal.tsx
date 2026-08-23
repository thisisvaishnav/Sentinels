import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface AboutLokvisionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutLokvisionModal: React.FC<AboutLokvisionModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons name="satellite-variant" size={24} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.brandTitle}>LOKVISION</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.appSubtitle}>Enumerator Field Application</Text>

            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Development Build v1.0.0</Text>
            </View>

            <Text style={styles.description}>
              Lokvision is an offline-capable field enumeration platform designed for municipal survey management, real-time coverage tracking, household registration, and blind-spot detection.
            </Text>

            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Environment</Text>
                <Text style={styles.metaVal}>Development / Expo Go</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Offline Storage</Text>
                <Text style={styles.metaVal}>AsyncStorage (`@lokvision_`)</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>GIS Engine</Text>
                <Text style={styles.metaVal}>Vector Map Adapter v1</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.closeActionBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeActionText}>Done</Text>
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 2,
  },
  content: {
    gap: 12,
    alignItems: 'center',
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  versionBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  description: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  metaBox: {
    width: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaKey: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  closeActionBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
