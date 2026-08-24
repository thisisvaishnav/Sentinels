import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface WelcomeCardProps {
  userName: string;
  zone: string;
  ward: string;
  area?: string;
  onPress?: () => void;
}

export default function WelcomeCard({ userName, zone, ward, area, onPress }: WelcomeCardProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={28} color={COLORS.accent} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.locationBar} activeOpacity={0.7} onPress={onPress}>
        <Ionicons name="location" size={16} color={COLORS.accent} />
        <Text style={styles.locationText}>
          {zone} · {ward} {area ? `(${area})` : ''}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});
