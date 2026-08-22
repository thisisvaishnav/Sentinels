import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CitizenSchemesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Schemes</Text>
        <Text style={styles.subtitle}>View available schemes and benefits.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="leaf-outline" size={18} color="#10B981" />
          <Text style={styles.schemeName}>Household Assistance</Text>
        </View>
        <Text style={styles.schemeDesc}>Support for basic household development and utilities.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="school-outline" size={18} color="#38BDF8" />
          <Text style={styles.schemeName}>Education Benefit</Text>
        </View>
        <Text style={styles.schemeDesc}>Scholarship and supplies support for eligible families.</Text>
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
  schemeName: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  schemeDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  },
});
