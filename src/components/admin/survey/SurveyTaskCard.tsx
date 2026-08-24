import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { SurveyTask } from '@/src/types/admin';
import SurveyStatusBadge from './SurveyStatusBadge';
import ProgressBar from './ProgressBar';

interface SurveyTaskCardProps {
  survey: SurveyTask;
  onTrackProgress: (survey: SurveyTask) => void;
  onAssign: (survey: SurveyTask) => void;
  onReassign: (survey: SurveyTask) => void;
}

export default function SurveyTaskCard({
  survey,
  onTrackProgress,
  onAssign,
  onReassign,
}: SurveyTaskCardProps) {
  const initials = survey.enumeratorName
    ? survey.enumeratorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <SurveyStatusBadge status={survey.status} />
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.6}>
          <Ionicons name="ellipsis-vertical" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{survey.zone}</Text>
      <Text style={styles.subtitle}>{survey.surveyType}</Text>

      {/* Enumerator */}
      <View style={styles.enumeratorRow}>
        {initials ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <Ionicons name="person-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          </View>
        )}
        <Text style={[styles.enumeratorName, !survey.enumeratorName && styles.unassigned]}>
          {survey.enumeratorName || 'Unassigned'}
        </Text>
      </View>

      {/* Progress */}
      <ProgressBar progress={survey.progress} status={survey.status} />
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {survey.completedHouseholds}/{survey.totalHouseholds} households
        </Text>
        <Text style={styles.progressText}>{survey.progress}%</Text>
      </View>

      {/* Due date */}
      <Text style={styles.dueDate}>Due: {survey.dueDate}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.trackBtn}
          activeOpacity={0.6}
          onPress={() => onTrackProgress(survey)}
        >
          <Text style={styles.trackBtnText}>Track Progress</Text>
        </TouchableOpacity>
        {survey.enumeratorId ? (
          <TouchableOpacity
            style={styles.reassignBtn}
            activeOpacity={0.6}
            onPress={() => onReassign(survey)}
          >
            <Text style={styles.reassignBtnText}>Reassign</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.assignBtn}
            activeOpacity={0.6}
            onPress={() => onAssign(survey)}
          >
            <Text style={styles.assignBtnText}>Assign Enumerator</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuBtn: {
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  enumeratorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ENUMERATOR_THEME.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmpty: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.primary,
  },
  enumeratorName: {
    fontSize: 12,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  unassigned: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  dueDate: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  trackBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
  reassignBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassignBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  assignBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
