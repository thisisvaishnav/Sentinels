import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

interface AddressData {
  house_no: string;
  locality: string;
  ward: string;
  district: string;
  pincode: string;
}

interface Props {
  data: AddressData;
  onChange: (updated: Partial<AddressData>) => void;
  errors?: Record<string, string | undefined>;
}

export function AddressCard({ data, onChange, errors }: Props) {
  const handlePinChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
    onChange({ pincode: cleaned });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={T.colors.accent} />
        </View>
        <Text style={styles.cardTitle}>Address</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>House / Flat No. *</Text>
        <TextInput
          style={[styles.input, errors?.house_no && styles.inputError]}
          placeholder="e.g. 42B"
          placeholderTextColor={T.colors.textMuted}
          value={data.house_no}
          onChangeText={(val) => onChange({ house_no: val })}
        />
        {errors?.house_no ? <Text style={styles.errorText}>{errors.house_no}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Locality / Street *</Text>
        <TextInput
          style={[styles.input, errors?.locality && styles.inputError]}
          placeholder="e.g. Shastri Nagar"
          placeholderTextColor={T.colors.textMuted}
          value={data.locality}
          onChangeText={(val) => onChange({ locality: val })}
        />
        {errors?.locality ? <Text style={styles.errorText}>{errors.locality}</Text> : null}
      </View>

      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Ward *</Text>
          <TextInput
            style={[styles.input, errors?.ward && styles.inputError]}
            placeholder="e.g. 12"
            placeholderTextColor={T.colors.textMuted}
            value={data.ward}
            onChangeText={(val) => onChange({ ward: val })}
          />
          {errors?.ward ? <Text style={styles.errorText}>{errors.ward}</Text> : null}
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>District *</Text>
          <TextInput
            style={[styles.input, errors?.district && styles.inputError]}
            placeholder="e.g. Ghaziabad"
            placeholderTextColor={T.colors.textMuted}
            value={data.district}
            onChangeText={(val) => onChange({ district: val })}
          />
          {errors?.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>PIN Code (6 Digits) *</Text>
        <TextInput
          style={[styles.input, errors?.pincode && styles.inputError]}
          placeholder="e.g. 201002"
          placeholderTextColor={T.colors.textMuted}
          keyboardType="numeric"
          maxLength={6}
          value={data.pincode}
          onChangeText={handlePinChange}
        />
        {errors?.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
      </View>
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
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: T.colors.textSecondary,
  },
  input: {
    backgroundColor: T.colors.inputBackground,
    borderRadius: T.borderRadius.md,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
    color: T.colors.textPrimary,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
  },
  inputError: {
    borderColor: T.colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 11,
    color: T.colors.danger,
    fontWeight: '500',
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 10,
  },
});
