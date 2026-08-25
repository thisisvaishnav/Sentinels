import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SideDrawer, DrawerMenuItem } from '@/src/components/shared/SideDrawer';
import { useCitizenDrawer } from '@/src/contexts/CitizenDrawerContext';
import { signOut } from '@/src/features/auth/authService';

const CITIZEN_MENU_ITEMS: DrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(citizen)/dashboard', iconName: 'home-outline' },
  { id: 'progress', label: 'My Progress', route: '/(citizen)/progress', iconName: 'chart-line' },
  { id: 'schemes', label: 'Government Schemes', route: '/(citizen)/schemes', iconName: 'file-document-outline' },
  { id: 'household', label: 'My Household', route: '/(citizen)/household', iconName: 'home-outline' },
  { id: 'discuss', label: 'Discuss Problem', route: '/(citizen)/discuss-problem', iconName: 'chat-outline' },
  { id: 'support', label: 'Support & Help', route: '/(citizen)/support', iconName: 'head-question-outline' },
  { id: 'profile', label: 'Profile & Settings', route: '/(citizen)/profile', iconName: 'cog-outline' },
];

interface CitizenDrawerProps {
  profile?: {
    name: string;
    id: string;
    zone?: string;
  };
}

export function CitizenDrawer({ profile }: CitizenDrawerProps) {
  const { isOpen, close } = useCitizenDrawer();
  const router = useRouter();

  const userProfile = profile || {
    name: 'Citizen',
    id: 'CIT-001',
    zone: 'Zone A-12',
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            close();
            try {
              await signOut();
            } catch {
              // Ignore sign out errors
            }
            router.replace('/onboarding');
          },
        },
      ],
    );
  };

  return (
    <SideDrawer
      visible={isOpen}
      onClose={close}
      menuItems={CITIZEN_MENU_ITEMS}
      profile={userProfile}
      branding="LOKEVISION"
      version="Citizen v1.0"
      onLogout={handleLogout}
    />
  );
}
