import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  message: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textPrimary,
  },
  attribution: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
