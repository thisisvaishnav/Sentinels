import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface VisitDetailsCardProps {
  visitDate: string;
  visitTime: string;
  attemptNumber: number;
  previousAttemptDate?: string;
  onChangeVisitDate: (text: string) => void;
  onChangeVisitTime: (text: string) => void;
  onChangeAttemptNumber: (val: number) => void;
}

export const VisitDetailsCard: React.FC<VisitDetailsCardProps> = ({
  visitDate,
  visitTime,
  attemptNumber,
  previousAttemptDate,
  onChangeVisitDate,
  onChangeVisitTime,
  onChangeAttemptNumber,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="calendar-clock" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>5. Visit Information</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visit Date</Text>
          <TextInput
            style={styles.input}
            value={visitDate}
            onChangeText={onChangeVisitDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visit Time</Text>
          <TextInput
            style={styles.input}
            value={visitTime}
            onChangeText={onChangeVisitTime}
            placeholder="e.g. 10:30 AM"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>
      </View>

      {/* Attempt Counter */}
      <View style={styles.attemptRow}>
        <View>
          <Text style={styles.attemptTitle}>Field Visit Attempt Number</Text>
          {previousAttemptDate && (
            <Text style={styles.previousText}>Prev visit: {previousAttemptDate}</Text>
          )}
        </View>

        <View style={styles.counterWrap}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onChangeAttemptNumber(Math.max(1, attemptNumber - 1))}
            activeOpacity={0.8}
          >
            <Text style={styles.counterBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterVal}>{attemptNumber}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onChangeAttemptNumber(attemptNumber + 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  attemptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  attemptTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  previousText: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  counterVal: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    minWidth: 18,
    textAlign: 'center',
  },
});
