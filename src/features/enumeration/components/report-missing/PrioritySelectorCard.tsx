import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MissingPriority } from '../../types/missingReportTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface PrioritySelectorCardProps {
  priority: MissingPriority;
  remarks: string;
  onSelectPriority: (priority: MissingPriority) => void;
  onChangeRemarks: (text: string) => void;
}

export const PRIORITY_CONFIG: Record<
  MissingPriority,
  { label: string; bg: string; border: string; text: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  Normal: {
    label: 'Normal Priority',
    bg: '#F1F5F9',
    border: '#CBD5E1',
    text: '#475569',
    icon: 'flag-outline',
  },
  High: {
    label: 'High Priority',
    bg: '#FEF3C7',
    border: '#FDE047',
    text: '#B45309',
    icon: 'flag-variant',
  },
  Urgent: {
    label: 'Urgent Attention',
    bg: '#FEE2E2',
    border: '#FCA5A5',
    text: '#B91C1C',
    icon: 'flag-remove',
  },
};

export const PrioritySelectorCard: React.FC<PrioritySelectorCardProps> = ({
  priority,
  remarks,
  onSelectPriority,
  onChangeRemarks,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="flag-checkered" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>4. Priority & Enumerator Remarks</Text>
      </View>

      {/* Priority Selector Pills */}
      <View style={styles.priorityRow}>
        {(['Normal', 'High', 'Urgent'] as MissingPriority[]).map((p) => {
          const isSelected = priority === p;
          const config = PRIORITY_CONFIG[p];

          return (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityPill,
                { backgroundColor: config.bg, borderColor: config.border },
                isSelected && styles.priorityPillSelected,
              ]}
              onPress={() => onSelectPriority(p)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name={config.icon} size={16} color={config.text} />
              <Text style={[styles.priorityText, { color: config.text }]}>{config.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Enumerator Remarks */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Field Remarks & Field Observations *</Text>
        <TextInput
          style={styles.textArea}
          value={remarks}
          onChangeText={onChangeRemarks}
          multiline
          numberOfLines={3}
          placeholder='e.g. "Address exists but household was locked during two visits. Neighbor verified family visits monthly."'
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
        />
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
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1.5,
    gap: 4,
  },
  priorityPillSelected: {
    transform: [{ scale: 1.03 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  textArea: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
    height: 64,
    textAlignVertical: 'top',
  },
});
