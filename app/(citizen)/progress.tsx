import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CitizenProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Track your requests and status updates here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
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
});
