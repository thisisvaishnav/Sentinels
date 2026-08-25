import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoleSelectionScreen, { Role } from '@/src/screens/RoleSelectionScreen';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleRoleSelect = async (role: Role) => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
    } catch (e) {
      console.error('Failed to set hasOnboarded:', e);
    }

    // Enumerators are provisioned externally — send them straight to login.
    // Admins have a dedicated LOKEVISION login screen.
    // Citizens start on the registration screen.
    if (role === 'citizen') {
      router.push({ pathname: '/(auth)/register', params: { role } });
    } else if (role === 'admin') {
      router.push('/(admin)/login');
    } else {
      router.push({ pathname: '/(auth)/login', params: { role } });
    }
  };

  return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
}
