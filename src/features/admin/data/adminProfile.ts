import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetailedAdminProfile } from '../types/adminProfileTypes';

export const ADMIN_PROFILE_STORAGE_KEY = '@lokvision_admin_profile';

export const DEFAULT_ADMIN_PROFILE: DetailedAdminProfile = {
  id: 'ADMIN-001',
  name: 'Rajesh Kumar',
  role: 'District Administrator',
  status: 'Active',
  email: 'rajesh.kumar@drishti.gov.in',
  phone: '+91 98765 43210',
  district: 'Varanasi',
  zone: 'All Zones',
  authorityLevel: 'District Level',
  joinedDate: '01 Mar 2024',
};

export async function loadAdminProfile(): Promise<DetailedAdminProfile> {
  try {
    const json = await AsyncStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (!json) {
      await saveAdminProfile(DEFAULT_ADMIN_PROFILE);
      return DEFAULT_ADMIN_PROFILE;
    }
    const parsed = JSON.parse(json);
    return { ...DEFAULT_ADMIN_PROFILE, ...parsed };
  } catch (error) {
    console.error('Failed to load admin profile from AsyncStorage:', error);
    return DEFAULT_ADMIN_PROFILE;
  }
}

export async function saveAdminProfile(profile: DetailedAdminProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save admin profile to AsyncStorage:', error);
  }
}

export async function resetAdminProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ADMIN_PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset admin profile:', error);
  }
}
