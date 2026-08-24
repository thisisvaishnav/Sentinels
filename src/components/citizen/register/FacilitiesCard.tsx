import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

interface FacilitiesData {
  has_electricity: boolean;
  has_running_water: boolean;
  has_indoor_toilet: boolean;
  has_lpg: boolean;
  has_internet: boolean;
}

interface Props {
  data: FacilitiesData;
  onChange: (updated: Partial<FacilitiesData>) => void;
}

const FACILITY_ITEMS: { key: keyof FacilitiesData; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'has_electricity', label: 'Electricity', icon: 'flash-outline' },
  { key: 'has_running_water', label: 'Running Water', icon: 'water-outline' },
  { key: 'has_indoor_toilet', label: 'Indoor Toilet', icon: 'body-outline' },
  { key: 'has_lpg', label: 'LPG / Gas', icon: 'flame-outline' },
  { key: 'has_internet', label: 'Internet Connection', icon: 'wifi-outline' },
];

export function FacilitiesCard({ data, onChange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="home-outline" size={20} color={T.colors.accent} />
        </View>
        <Text style={styles.cardTitle}>Available Facilities</Text>
      </View>

      {FACILITY_ITEMS.map((item) => {
        const isActive = data[item.key];
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.facilityRow}
            onPress={() => onChange({ [item.key]: !isActive })}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isActive && styles.checkboxActive]}>
              {isActive && <Ionicons name="checkmark" size={14} color={T.colors.textWhite} />}
            </View>
            <Ionicons
              name={item.icon}
              size={20}
              color={isActive ? T.colors.accent : T.colors.textMuted}
              style={styles.facilityIcon}
            />
            <Text style={[styles.facilityText, isActive && { color: T.colors.textPrimary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: T.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: T.colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: T.colors.accent,
    borderColor: T.colors.accent,
  },
  facilityIcon: {
    marginRight: 10,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textSecondary,
  },
});
