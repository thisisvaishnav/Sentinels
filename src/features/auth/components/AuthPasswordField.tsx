import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '../theme';

interface AuthPasswordFieldProps {
  theme: AuthTheme;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureField?: boolean;
  securityHint?: string;
}

export const AuthPasswordField: React.FC<AuthPasswordFieldProps> = ({
  theme,
  label,
  value,
  onChangeText,
  placeholder = 'Enter your password',
  secureField = false,
  securityHint,
}) => {
  const [visible, setVisible] = React.useState(false);

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
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} />
        </View>
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={styles.eyeBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {securityHint && (
        <Text style={[styles.hint, { color: theme.colors.textMuted }]}>{securityHint}</Text>
      )}
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
  eyeBtn: {
    padding: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
