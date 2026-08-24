import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface RouteControlsBarProps {
  onAddStop: () => void;
  onRegenerateRoute: () => void;
  onClearRoute: () => void;
}

export const RouteControlsBar: React.FC<RouteControlsBarProps> = ({
  onAddStop,
  onRegenerateRoute,
  onClearRoute,
}) => {
  const router = useRouter();

  const handleClearConfirm = () => {
    Alert.alert(
      'Clear Route Plan',
      'Are you sure you want to clear your current active route? This will reset your field visit order.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Route', style: 'destructive', onPress: onClearRoute },
      ]
    );
  };

  const handleRegenerateConfirm = () => {
    Alert.alert(
      'Regenerate Route',
      'This will recalculate the recommended route from all currently eligible households in your zone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: onRegenerateRoute },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Route Actions & Controls</Text>

      <View style={styles.buttonsGrid}>
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={onAddStop}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.primaryText}>Add Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={() => router.push('/(enumerator)/gis-map')}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.secondaryText}>View on Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnOutline}
          onPress={handleRegenerateConfirm}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="reload" size={16} color={ENUMERATOR_THEME.colors.textPrimary} />
          <Text style={styles.outlineText}>Regenerate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnDanger}
          onPress={handleClearConfirm}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={16} color={ENUMERATOR_THEME.colors.danger} />
          <Text style={styles.dangerText}>Clear Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtnPrimary: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  primaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  actionBtnSecondary: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    gap: 6,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  actionBtnOutline: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  outlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionBtnDanger: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  dangerText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
});
