import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { EscalationHistoryEvent } from '../../types/supervisorEscalationTypes';

interface EscalationHistoryProps {
  history: EscalationHistoryEvent[];
}

export const EscalationHistory: React.FC<EscalationHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit History & Actions</Text>
      <View style={styles.timeline}>
        {history.map((event, index) => {
          const isFirst = index === 0;
          const formattedTime = new Date(event.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <View key={event.id || index} style={styles.eventRow}>
              {/* Timeline Indicator */}
              <View style={styles.indicatorColumn}>
                <View style={[styles.dot, isFirst && styles.dotActive]} />
                {index < history.length - 1 && <View style={styles.line} />}
              </View>

              {/* Event Content */}
              <View style={styles.contentColumn}>
                <View style={styles.eventHeader}>
                  <Text style={styles.actionText}>{event.action}</Text>
                  <Text style={styles.timeText}>{formattedTime}</Text>
                </View>

                <View style={styles.actorRow}>
                  <MaterialCommunityIcons name="account-circle-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.actorText}>{event.actor} ({event.role})</Text>
                </View>

                {event.notes ? (
                  <Text style={styles.notesText}>"{event.notes}"</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  timeline: {
    gap: 16,
  },
  eventRow: {
    flexDirection: 'row',
    gap: 12,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textMuted,
    marginTop: 4,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.accentSoft,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: 4,
  },
  contentColumn: {
    flex: 1,
    gap: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  actorText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
