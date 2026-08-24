import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { SurveyStatus } from '@/src/types/admin';

interface ProgressBarProps {
  progress: number;
  status: SurveyStatus;
  height?: number;
}

const STATUS_COLORS: Record<SurveyStatus, string> = {
  completed: ENUMERATOR_THEME.colors.success,
  in_progress: ENUMERATOR_THEME.colors.accent,
  pending: ENUMERATOR_THEME.colors.warning,
};

export default function ProgressBar({ progress, status, height = 6 }: ProgressBarProps) {
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: STATUS_COLORS[status],
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
  },
});
