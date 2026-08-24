import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { EnumeratorResponseItem } from '@/src/types/admin';

interface EnumeratorResponseProps {
  response: EnumeratorResponseItem;
}

export default function EnumeratorResponse({ response }: EnumeratorResponseProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        <Text style={styles.message}>{response.message}</Text>
      </View>
      <Text style={styles.attribution}>
        {response.enumeratorName} ({response.enumeratorId}) • {response.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    maxWidth: '80%',
  },
  bubble: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  message: {
    fontSize: 12,
    lineHeight: 17,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  attribution: {
    fontSize: 9,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 4,
  },
});
