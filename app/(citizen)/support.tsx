import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CitizenSupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Support</Text>
          <Text style={styles.headerSub}>Get help for household and service issues.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color="#0C79B4" />
          <Text style={styles.itemTitle}>Helpline</Text>
        </View>
        <Text style={styles.itemText}>Call your local center for urgent assistance.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color="#D97706" />
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 14,
    marginTop: -30,
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
  itemTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  itemText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
});
