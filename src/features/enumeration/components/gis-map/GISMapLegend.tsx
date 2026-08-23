import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export const GISMapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.8}
      >
        <Ionicons name="map-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.headerTitle}>Map Legend</Text>
        <Ionicons
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={16}
          color={ENUMERATOR_THEME.colors.textMuted}
        />
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.content}>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.legendLabel}>Pending Survey</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendLabel}>In Progress</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendLabel}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendLabel}>High Priority</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.legendLabel}>Needs Verification / Missing</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#8B5CF6', borderRadius: 4 }]} />
            <Text style={styles.legendLabel}>Enumerator Location</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  content: {
    marginTop: 8,
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
