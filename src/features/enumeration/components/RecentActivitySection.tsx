import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorActivity } from '../types';

interface RecentActivitySectionProps {
  activities: EnumeratorActivity[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities }) => {
  const getIconConfig = (type: EnumeratorActivity['type']) => {
    switch (type) {
      case 'registered':
        return { name: 'home-plus-outline' as const, color: '#10B981', bg: '#064E3B' };
      case 'verified':
        return { name: 'checkbox-marked-circle-outline' as const, color: '#38BDF8', bg: '#0C4A6E' };
      case 'missing':
        return { name: 'alert-decagram-outline' as const, color: '#F59E0B', bg: '#451A03' };
      case 'sync':
        return { name: 'cloud-check-outline' as const, color: '#EC4899', bg: '#4C0519' };
      default:
        return { name: 'text-box-outline' as const, color: '#94A3B8', bg: '#1E293B' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.list}>
        {activities.map((item) => {
          const config = getIconConfig(item.type);
          return (
            <View key={item.id} style={styles.item}>
              <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                <MaterialCommunityIcons name={config.name} size={20} color={config.color} />
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  list: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  itemDetail: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
