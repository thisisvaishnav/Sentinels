import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '../../theme';

export const ProfileLoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
      <Text style={styles.text}>Loading Field Profile...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
