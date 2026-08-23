import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepPress: (index: number) => void;
}

export function SurveyStepBar({ currentStep, stepTitles, onStepPress }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {stepTitles.map((title, idx) => {
          const isCurrent = currentStep === idx;
          const isDone = idx < currentStep;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.stepChip,
                isCurrent && styles.stepChipCurrent,
                isDone && styles.stepChipDone,
              ]}
              onPress={() => onStepPress(idx)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.stepBadge,
                  isCurrent && styles.stepBadgeCurrent,
                  isDone && styles.stepBadgeDone,
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={12} color={ENUMERATOR_THEME.colors.textWhite} />
                ) : (
                  <Text
                    style={[
                      styles.stepBadgeText,
                      isCurrent && styles.stepBadgeTextCurrent,
                    ]}
                  >
                    {String.fromCharCode(65 + idx)}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepTitle,
                  isCurrent && styles.stepTitleCurrent,
                  isDone && styles.stepTitleDone,
                ]}
              >
                {title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    paddingVertical: 10,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  stepChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  stepChipCurrent: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  stepChipDone: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ENUMERATOR_THEME.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeCurrent: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  stepBadgeDone: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  stepBadgeTextCurrent: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  stepTitleCurrent: {
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  stepTitleDone: {
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.successText,
  },
});
