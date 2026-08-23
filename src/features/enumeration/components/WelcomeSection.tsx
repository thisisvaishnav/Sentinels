import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorProfile } from '../types';

interface WelcomeSectionProps {
  profile: EnumeratorProfile;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ profile }) => {
  return (
    <View style={styles.welcomeCard}>
      <View style={styles.topRow}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons name="account-hard-hat" size={28} color="#38BDF8" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
      </View>

      <View style={styles.zoneBanner}>
        <MaterialCommunityIcons name="map-marker-radius" size={16} color="#38BDF8" />
        <Text style={styles.zoneText}>{profile.assignedZone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  textWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  zoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  zoneText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
