import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetailedEnumeratorProfile } from '../types/profileTypes';

export const PROFILE_STORAGE_KEY = '@lokvision_enumerator_profile';

export const DEFAULT_ENUMERATOR_PROFILE: DetailedEnumeratorProfile = {
  id: 'ENUM001',
  name: 'Sarah Jenkins',
  role: 'Lead Field Enumerator',
  status: 'Active',
  zoneId: 'Zone A-12',
  zoneName: 'Zone A-12 - Shastri Nagar',
  ward: 'Ward 12',
  district: 'Varanasi',
  pinCode: '221005',
  mobile: '+91 98765 43210',
  email: 'ENUM001@enumerator.sentinels.app',
  supervisor: 'Dr. R. K. Sharma',
  unit: 'Unit 4',
  joinedDate: '15 Jan 2024',
  dailyTarget: 25,
};

export async function loadEnumeratorProfile(): Promise<DetailedEnumeratorProfile> {
  try {
    const json = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!json) {
      await saveEnumeratorProfile(DEFAULT_ENUMERATOR_PROFILE);
      return DEFAULT_ENUMERATOR_PROFILE;
    }
    const parsed = JSON.parse(json);
    return { ...DEFAULT_ENUMERATOR_PROFILE, ...parsed };
  } catch (error) {
    console.error('Failed to load enumerator profile from AsyncStorage:', error);
    return DEFAULT_ENUMERATOR_PROFILE;
  }
}

export async function saveEnumeratorProfile(profile: DetailedEnumeratorProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save enumerator profile to AsyncStorage:', error);
  }
}

export async function resetEnumeratorProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset enumerator profile:', error);
  }
}
