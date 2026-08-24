import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import {
  SpeechLanguage,
  SpeechRecognitionState,
  normalizeTranscript,
  speechRecognitionService,
} from '../../services/speechRecognition';

export interface VoiceInputButtonProps {
  currentValue: string;
  onResult: (updatedText: string) => void;
  fieldLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function VoiceInputButton({
  currentValue,
  onResult,
  fieldLabel = 'field',
  disabled = false,
  size = 'md',
}: VoiceInputButtonProps) {
  const [state, setState] = useState<SpeechRecognitionState>('IDLE');
  const [language, setLanguage] = useState<SpeechLanguage>('en-IN');
  const [partialText, setPartialText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    async function checkEngine() {
      const avail = await speechRecognitionService.isAvailable();
      setIsAvailable(avail);
      const lang = await speechRecognitionService.getLanguagePreference();
      setLanguage(lang);
    }
    checkEngine();
  }, []);

  const handleToggleListening = async () => {
    if (disabled) return;

    if (state === 'LISTENING') {
      await speechRecognitionService.stopListening();
      setState('IDLE');
      setPartialText('');
      return;
    }

    setErrorMessage(null);
    setPartialText('');

    const available = await speechRecognitionService.isAvailable();
    if (!available) {
      setState('UNAVAILABLE');
      Alert.alert(
        'Voice Input Unavailable',
        'Speech recognition is unavailable on this device environment. Please use manual keyboard input.',
        [{ text: 'OK' }]
      );
      return;
    }

    await speechRecognitionService.startListening({
      language,
      onStateChange: (st) => setState(st),
      onPartialResult: (interim) => setPartialText(interim),
      onFinalResult: (transcript) => {
        const cleaned = normalizeTranscript(transcript);
        if (!cleaned) return;

        let newText = cleaned;
        if (currentValue && currentValue.trim().length > 0) {
          newText = `${currentValue.trim()} ${cleaned}`;
        }
        onResult(newText);
        setPartialText('');
      },
      onError: (msg) => {
        setErrorMessage(msg);
        setState('ERROR');
        Alert.alert('Voice Input Error', msg, [
          { text: 'Try Again', onPress: handleToggleListening },
          { text: 'Use Keyboard', style: 'cancel' },
        ]);
      },
    });
  };

  const handleToggleLanguage = async () => {
    const nextLang: SpeechLanguage = language === 'en-IN' ? 'hi-IN' : 'en-IN';
    setLanguage(nextLang);
    await speechRecognitionService.setLanguagePreference(nextLang);
  };

  const getIconColor = () => {
    switch (state) {
      case 'LISTENING':
        return ENUMERATOR_THEME.colors.danger;
      case 'PROCESSING':
        return ENUMERATOR_THEME.colors.accent;
      case 'ERROR':
        return ENUMERATOR_THEME.colors.warning;
      case 'UNAVAILABLE':
        return ENUMERATOR_THEME.colors.textMuted;
      default:
        return ENUMERATOR_THEME.colors.accent;
    }
  };

  const getContainerBg = () => {
    switch (state) {
      case 'LISTENING':
        return ENUMERATOR_THEME.colors.dangerBg;
      case 'PROCESSING':
        return ENUMERATOR_THEME.colors.accentSubtle;
      case 'ERROR':
        return ENUMERATOR_THEME.colors.warningBg;
      case 'UNAVAILABLE':
        return ENUMERATOR_THEME.colors.subtleBackground;
      default:
        return ENUMERATOR_THEME.colors.accentSubtle;
    }
  };

  const isSmall = size === 'sm';

  return (
    <View style={styles.outerContainer}>
      <View style={styles.row}>
        {/* Language Chip Toggle */}
        <TouchableOpacity
          style={[styles.langChip, disabled && styles.disabled]}
          onPress={handleToggleLanguage}
          disabled={disabled || state === 'LISTENING'}
          activeOpacity={0.7}
          accessibilityLabel={`Voice language ${language === 'en-IN' ? 'English' : 'Hindi'}`}
          accessibilityHint="Tap to switch voice input language"
        >
          <Text style={styles.langText}>{language === 'en-IN' ? 'EN' : 'HI'}</Text>
        </TouchableOpacity>

        {/* Microphone Action Button */}
        <TouchableOpacity
          style={[
            styles.micButton,
            isSmall && styles.micButtonSm,
            { backgroundColor: getContainerBg() },
            disabled && styles.disabled,
          ]}
          onPress={handleToggleListening}
          disabled={disabled}
          activeOpacity={0.7}
          accessibilityLabel={
            state === 'LISTENING'
              ? `Stop voice input for ${fieldLabel}`
              : `Start voice input for ${fieldLabel}`
          }
          accessibilityHint="Tap to speak text into form field"
        >
          {state === 'PROCESSING' ? (
            <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.accent} />
          ) : (
            <MaterialCommunityIcons
              name={state === 'LISTENING' ? 'microphone-off' : 'microphone'}
              size={isSmall ? 18 : 20}
              color={getIconColor()}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Listening Partial Transcript Banner */}
      {state === 'LISTENING' ? (
        <View style={styles.listeningBanner}>
          <View style={styles.pulseDot} />
          <Text style={styles.listeningText} numberOfLines={1}>
            {partialText ? `"${partialText}"` : 'Listening... Speak now'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langChip: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  micButtonSm: {
    width: 38,
    height: 38,
  },
  disabled: {
    opacity: 0.5,
  },
  listeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
    gap: 6,
    maxWidth: 220,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.danger,
  },
  listeningText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.dangerText,
  },
});
