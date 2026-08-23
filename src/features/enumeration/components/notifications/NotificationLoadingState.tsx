import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ENUMERATOR_THEME } from '../../theme';

export const NotificationLoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.accent} />
      <Text style={styles.text}>Loading notifications...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
