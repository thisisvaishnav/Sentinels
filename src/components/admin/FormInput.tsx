import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  required?: boolean;
  optional?: boolean;
  error?: string;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  required,
  optional,
  error,
}: FormInputProps) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
        {optional && <Text style={styles.optional}> (Optional)</Text>}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
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
  optional: {
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  input: {
    height: 38,
    backgroundColor: '#F7F8FC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 12.5,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    fontSize: 9.5,
    color: COLORS.danger,
    marginTop: 3,
  },
});
