import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CitizenProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Progress</Text>
          <Text style={styles.headerSub}>Track your requests and status updates.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={18} color="#0C79B4" />
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 14,
  },
  header: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    gap: 2,
  },
  brand: {
    color: '#1E293B',
    fontSize: 40,
    fontWeight: '700',
  },
  headerSub: {
    color: '#4B5563',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
});
