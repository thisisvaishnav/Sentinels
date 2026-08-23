import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { SurveyFormData } from '../../types';

interface Props {
  data: SurveyFormData;
  onEditSection: (sectionIndex: number) => void;
  onSubmit: () => void;
  readOnly?: boolean;
}

export function SurveyReviewSection({ data, onEditSection, onSubmit, readOnly = false }: Props) {
  const receivingSchemesCount = data.schemeStatus.filter((s) => s.choice === 'Receiving').length;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="clipboard-check-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Section H: Survey Review</Text>
      </View>

      {/* Summary Box */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Household ID</Text>
          <Text style={styles.valueHighlight}>{data.householdId}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Head of Household</Text>
          <Text style={styles.value}>{data.householdInformation.name || 'Rahul Kumar'}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Registered Members</Text>
          <Text style={styles.value}>{data.familyMembers.length + 1} Members</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Facilities Section</Text>
          <Text style={[styles.value, styles.textSuccess]}>✓ Completed</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Employment & Education</Text>
          <Text style={[styles.value, styles.textSuccess]}>✓ Completed</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Household Needs</Text>
          <Text style={styles.value}>
            {data.needs.length > 0 ? data.needs.slice(0, 2).join(', ') : 'None'}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Scheme Benefits</Text>
          <Text style={styles.value}>
            {receivingSchemesCount > 0 ? `${receivingSchemesCount} receiving` : 'None reported'}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.label}>Remarks</Text>
          <Text style={styles.value}>{data.remarks ? 'Added' : 'None'}</Text>
        </View>
      </View>

      {/* Checklist Preview */}
      <View style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color={ENUMERATOR_THEME.colors.success} />
          <Text style={styles.checkText}>Household Information verified</Text>
        </View>

        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color={ENUMERATOR_THEME.colors.success} />
          <Text style={styles.checkText}>Basic Facilities recorded</Text>
        </View>

        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={18} color={ENUMERATOR_THEME.colors.success} />
          <Text style={styles.checkText}>Employment & Education recorded</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {!readOnly && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEditSection(0)} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={18} color={ENUMERATOR_THEME.colors.textPrimary} />
            <Text style={styles.editBtnText}>Edit Survey</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} activeOpacity={0.8}>
            <MaterialCommunityIcons name="check-circle" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
            <Text style={styles.submitBtnText}>Submit Survey</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  summaryGrid: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '700',
  },
  valueHighlight: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '800',
  },
  textSuccess: {
    color: ENUMERATOR_THEME.colors.success,
  },
  checklistCard: {
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  editBtnText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  submitBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
