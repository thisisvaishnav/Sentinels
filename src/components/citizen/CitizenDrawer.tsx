import React from 'react';
import { SideDrawer, DrawerMenuItem } from '@/src/components/shared/SideDrawer';
import { useCitizenDrawer } from '@/src/contexts/CitizenDrawerContext';

const CITIZEN_MENU_ITEMS: DrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(citizen)/dashboard', iconName: 'home-outline' },
  { id: 'progress', label: 'My Progress', route: '/(citizen)/progress', iconName: 'chart-line' },
  { id: 'schemes', label: 'Government Schemes', route: '/(citizen)/schemes', iconName: 'file-document-outline' },
  { id: 'household', label: 'My Household', route: '/(citizen)/household', iconName: 'home-outline' },
  { id: 'support', label: 'Support & Help', route: '/(citizen)/support', iconName: 'head-question-outline' },
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

  const userProfile = profile || {
    name: 'Citizen',
    id: 'CIT-001',
    zone: 'Zone A-12',
  };

  return (
    <SideDrawer
      visible={isOpen}
      onClose={close}
      menuItems={CITIZEN_MENU_ITEMS}
      profile={userProfile}
      branding="DRISHTI"
      version="Citizen v1.0"
    />
  );
}
