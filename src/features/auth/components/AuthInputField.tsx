import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { AuthTheme } from '../theme';

interface AuthInputFieldProps extends TextInputProps {
  theme: AuthTheme;
  label: string;
  icon: React.ReactNode;
}

export const AuthInputField: React.FC<AuthInputFieldProps> = ({
  theme,
  label,
  icon,
  style,
  ...textInputProps
}) => {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.borderInput,
            borderRadius: theme.borderRadius.md,
          },
        ]}
      >
        <View style={styles.iconWrap}>{icon}</View>
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          {...textInputProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  iconWrap: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});
