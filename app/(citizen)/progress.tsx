import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CitizenProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Track your requests and status updates.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={18} color="#38BDF8" />
          <Text style={styles.cardTitle}>Pending Request</Text>
        </View>
        <Text style={styles.cardValue}>1 Active</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
          <Text style={styles.cardTitle}>Completed Services</Text>
        </View>
        <Text style={styles.cardValue}>2 Closed</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '700',
  },
});
