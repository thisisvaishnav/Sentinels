import AsyncStorage from '@react-native-async-storage/async-storage';

export type SpeechRecognitionState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'ERROR'
  | 'UNAVAILABLE';

export type SpeechLanguage = 'en-IN' | 'hi-IN';

export interface SpeechListenOptions {
  language?: SpeechLanguage;
  onStateChange?: (state: SpeechRecognitionState) => void;
  onPartialResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

const VOICE_LANG_STORAGE_KEY = '@lokvision_voice_language';

/**
 * Normalizes speech transcription text
 * - Trims leading/trailing whitespace
 * - Collapses multiple spaces
 * - Removes stray leading/trailing punctuation where appropriate
 */
export function normalizeTranscript(text: string): string {
  if (!text) return '';
  let cleaned = text.trim().replace(/\s+/g, ' ');
  // Remove accidental leading punctuation like leading commas/periods
  cleaned = cleaned.replace(/^[.,;:!?]+\s*/, '');
  return cleaned;
}

class SpeechRecognitionService {
  private activeState: SpeechRecognitionState = 'IDLE';
  private currentLanguage: SpeechLanguage = 'en-IN';
  private webRecognition: any = null;

  constructor() {
    this.initLanguagePreference();
  }

  private async initLanguagePreference() {
    try {
      const saved = await AsyncStorage.getItem(VOICE_LANG_STORAGE_KEY);
      if (saved === 'hi-IN' || saved === 'en-IN') {
        this.currentLanguage = saved;
      }
    } catch {
      this.currentLanguage = 'en-IN';
    }
  }

  public async getLanguagePreference(): Promise<SpeechLanguage> {
    return this.currentLanguage;
  }

  public async setLanguagePreference(lang: SpeechLanguage): Promise<void> {
    this.currentLanguage = lang;
    try {
      await AsyncStorage.setItem(VOICE_LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist voice language preference:', e);
    }
  }

  public async isAvailable(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      return typeof SpeechRecognition !== 'undefined';
    }
    return false;
  }

  public async requestPermission(): Promise<boolean> {
    // Web Speech API requests permission automatically when start() is called.
    // In native Expo environment without custom native modules, availability check handles readiness.
    const available = await this.isAvailable();
    return available;
  }

  public async startListening(options: SpeechListenOptions): Promise<void> {
    const lang = options.language || this.currentLanguage;
    const updateState = (st: SpeechRecognitionState) => {
      this.activeState = st;
      options.onStateChange?.(st);
    };

    if (typeof window === 'undefined') {
      updateState('UNAVAILABLE');
      options.onError?.('Speech recognition is unavailable on this device environment.');
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      updateState('UNAVAILABLE');
      options.onError?.('Speech recognition is not supported on this device/browser.');
      return;
    }

    try {
      if (this.webRecognition) {
        try {
          this.webRecognition.abort();
        } catch {}
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onstart = () => {
        updateState('LISTENING');
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        if (interim) {
          options.onPartialResult?.(interim);
        }

        if (final) {
          const normalized = normalizeTranscript(final);
          updateState('PROCESSING');
          options.onFinalResult?.(normalized);
          updateState('IDLE');
        }
      };

      rec.onerror = (event: any) => {
        updateState('ERROR');
        let msg = 'Could not recognize speech. Please try again.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission is required for voice input.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please try speaking again.';
        } else if (event.error === 'network') {
          msg = 'Voice recognition requires an active network connection on this device.';
        }
        options.onError?.(msg);
      };

      rec.onend = () => {
        if (this.activeState === 'LISTENING') {
          updateState('IDLE');
        }
      };

      this.webRecognition = rec;
      rec.start();
    } catch (err: any) {
      updateState('ERROR');
      options.onError?.(err?.message || 'Failed to start voice recognition service.');
    }
  }

  public async stopListening(): Promise<void> {
    if (this.webRecognition) {
      try {
        this.webRecognition.stop();
      } catch {}
    }
    this.activeState = 'IDLE';
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
