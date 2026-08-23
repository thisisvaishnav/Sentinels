import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface GISMapControlsProps {
  onCenterMyLocation: () => void;
  onRefreshData: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isLocating?: boolean;
}

export const GISMapControls: React.FC<GISMapControlsProps> = ({
  onCenterMyLocation,
  onRefreshData,
  onZoomIn,
  onZoomOut,
  isLocating = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onCenterMyLocation}
        activeOpacity={0.8}
        disabled={isLocating}
      >
        <Ionicons
          name={isLocating ? 'locate' : 'navigate-circle-outline'}
          size={22}
          color={ENUMERATOR_THEME.colors.accent}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onRefreshData} activeOpacity={0.8}>
        <MaterialCommunityIcons name="refresh" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.zoomGroup}>
        <TouchableOpacity style={styles.zoomBtn} onPress={onZoomIn} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.zoomBtn} onPress={onZoomOut} activeOpacity={0.8}>
          <Ionicons name="remove" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },
  btn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomGroup: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 42,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
});
