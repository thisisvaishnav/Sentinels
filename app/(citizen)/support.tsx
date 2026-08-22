import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CitizenSupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Get help for household and service issues.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color="#38BDF8" />
          <Text style={styles.itemTitle}>Helpline</Text>
        </View>
        <Text style={styles.itemText}>Call your local center for urgent assistance.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color="#F59E0B" />
          <Text style={styles.itemTitle}>Raise a Ticket</Text>
        </View>
        <Text style={styles.itemText}>Submit details and track support resolution from Progress.</Text>
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
  itemTitle: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  itemText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  },
});
