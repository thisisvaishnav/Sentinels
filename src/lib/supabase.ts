import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// SecureStore has a 2048-byte key length limit. Supabase session values can
// exceed that, so we chunk them at 1800 bytes.
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}_chunk_${index}`;
}

const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      const countStr = await SecureStore.getItemAsync(`${key}_chunkCount`);
      if (countStr !== null) {
        const count = parseInt(countStr, 10);
        let result = '';
        for (let i = 0; i < count; i++) {
          const chunk = await SecureStore.getItemAsync(chunkKey(key, i));
          if (chunk === null) return null;
          result += chunk;
        }
        return result;
      }
      // Fallback: single-value (non-chunked) key
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    await SecureStore.setItemAsync(`${key}_chunkCount`, String(chunks.length));
    await Promise.all(
      chunks.map((chunk, i) => SecureStore.setItemAsync(chunkKey(key, i), chunk)),
    );
  },

  async removeItem(key: string): Promise<void> {
    try {
      const countStr = await SecureStore.getItemAsync(`${key}_chunkCount`);
      if (countStr !== null) {
        const count = parseInt(countStr, 10);
        await SecureStore.deleteItemAsync(`${key}_chunkCount`);
        await Promise.all(
          Array.from({ length: count }, (_, i) =>
            SecureStore.deleteItemAsync(chunkKey(key, i)),
          ),
        );
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch {
      // Ignore errors during removal
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
