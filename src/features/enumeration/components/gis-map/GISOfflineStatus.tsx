import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface GISOfflineStatusProps {
  isOffline: boolean;
}

export const GISOfflineStatus: React.FC<GISOfflineStatusProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={16} color={ENUMERATOR_THEME.colors.warningText} />
      <Text style={styles.text}>
        Offline Mode · Showing latest saved zone data from local storage
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.warningText,
    flex: 1,
  },
});
