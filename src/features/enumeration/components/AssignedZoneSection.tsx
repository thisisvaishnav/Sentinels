import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AssignedZoneInfo } from '../types';

interface AssignedZoneSectionProps {
  zone: AssignedZoneInfo;
}

export const AssignedZoneSection: React.FC<AssignedZoneSectionProps> = ({ zone }) => {
  const handleViewRoute = () => {
    Alert.alert('GIS Route Navigation', `Opening optimized survey route map for ${zone.zoneName}.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="map-marker-path" size={24} color="#38BDF8" />
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>Assigned Zone</Text>
          <Text style={styles.zoneName}>{zone.zoneName}</Text>
        </View>
      </View>

      <Text style={styles.subAreaText}>{zone.subArea}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Households</Text>
          <Text style={styles.statValue}>{zone.totalHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{zone.completedHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Coverage</Text>
          <Text style={[styles.statValue, { color: '#38BDF8' }]}>{zone.coveragePercentage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.routeBtn} onPress={handleViewRoute} activeOpacity={0.8}>
        <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
        <Text style={styles.routeBtnText}>View Route</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  zoneName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subAreaText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  routeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
