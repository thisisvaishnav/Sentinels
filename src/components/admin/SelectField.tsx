import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onPress: () => void;
  required?: boolean;
  error?: string;
}

export default function SelectField({
  label,
  placeholder,
  value,
  onPress,
  required,
  error,
}: SelectFieldProps) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <Pressable
        style={[styles.container, error ? styles.containerError : null]}
        onPress={onPress}
      >
        <Text
          style={[styles.text, !value ? styles.placeholder : null]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  required: {
    color: COLORS.danger,
  },
  container: {
    height: 38,
    backgroundColor: '#F7F8FC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerError: {
    borderColor: COLORS.danger,
  },
  text: {
    fontSize: 12.5,
    color: COLORS.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  error: {
    fontSize: 9.5,
    color: COLORS.danger,
    marginTop: 3,
  },
});
