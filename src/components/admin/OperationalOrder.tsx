import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface OperationalOrderProps {
  title?: string;
  message: string;
}

export default function OperationalOrder({
  title = 'OPERATIONAL ORDER',
  message,
}: OperationalOrderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accentLine} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={12} color={COLORS.operationalAccent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.operationalBg,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  accentLine: {
    width: 3,
    backgroundColor: COLORS.operationalAccent,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.operationalAccent,
    letterSpacing: 0.4,
  },
  message: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textPrimary,
  },
});
