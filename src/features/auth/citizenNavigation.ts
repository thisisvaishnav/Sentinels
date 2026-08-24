import { router } from 'expo-router';
import { getCitizenHouseholdStatus } from './authService';

export async function routeCitizenAfterAuth() {
  const household = await getCitizenHouseholdStatus();

  if (household.completed) {
    router.replace('/(citizen)/dashboard');
  } else {
    router.replace('/(citizen)/household');
  }
}
