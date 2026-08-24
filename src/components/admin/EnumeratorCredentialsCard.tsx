import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface EnumeratorCredentialsCardProps {
  visible: boolean;
  employeeId: string;
  password: string;
  enumeratorName: string;
  onDone: () => void;
  onAddAnother: () => void;
}

export default function EnumeratorCredentialsCard({
  visible,
  employeeId,
  password,
  enumeratorName,
  onDone,
  onAddAnother,
}: EnumeratorCredentialsCardProps) {
  const handleCopy = (value: string, label: string) => {
    Alert.alert('Copied', `${label} copied to clipboard (mock).`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Success icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color={ENUMERATOR_THEME.colors.textWhite} />
          </View>

          <Text style={styles.heading}>Enumerator Created Successfully</Text>
          <Text style={styles.subheading}>
            Credentials for {enumeratorName}
          </Text>

          {/* Employee ID */}
          <View style={styles.credentialBox}>
            <Text style={styles.credentialLabel}>Employee ID</Text>
            <Pressable onPress={() => handleCopy(employeeId, 'Employee ID')}>
              <Text style={styles.credentialValue}>{employeeId}</Text>
            </Pressable>
          </View>

          {/* Password */}
          <View style={styles.credentialBox}>
            <Text style={styles.credentialLabel}>Password</Text>
            <Pressable onPress={() => handleCopy(password, 'Password')}>
              <Text style={styles.credentialValue}>{password}</Text>
            </Pressable>
          </View>

          {/* Warning */}
          <View style={styles.warningRow}>
            <Ionicons name="warning-outline" size={14} color={ENUMERATOR_THEME.colors.warning} />
            <Text style={styles.warningText}>
              Share these credentials securely with the enumerator.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.doneBtn} onPress={onDone}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
            <Pressable style={styles.addAnotherBtn} onPress={onAddAnother}>
              <Text style={styles.addAnotherBtnText}>Add Another Enumerator</Text>
            </Pressable>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ENUMERATOR_THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginBottom: 20,
  },
  credentialBox: {
    width: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  credentialLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  credentialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.primary,
    letterSpacing: 1,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  warningText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  doneBtn: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  addAnotherBtn: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAnotherBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
