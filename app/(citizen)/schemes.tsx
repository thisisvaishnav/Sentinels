import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CitizenSchemesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Schemes</Text>
          <Text style={styles.headerSub}>View available schemes and benefits.</Text>
        </View>
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
          <Ionicons name="school-outline" size={18} color="#0C79B4" />
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
  schemeName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  schemeDesc: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
});
