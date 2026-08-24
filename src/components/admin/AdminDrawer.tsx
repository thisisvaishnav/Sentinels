import React from 'react';
import { SideDrawer, DrawerMenuItem } from '@/src/components/shared/SideDrawer';
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';

const ADMIN_MENU_ITEMS: DrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(admin)/dashboard', iconName: 'view-dashboard-outline' },
  { id: 'supervisor-escalations', label: 'Supervisor Escalations', route: '/(admin)/supervisor-escalations', iconName: 'shield-alert-outline' },
  { id: 'surveys', label: 'Surveys', route: '/(admin)/survey-management', iconName: 'clipboard-text-outline' },
  { id: 'enumerators', label: 'Enumerators', route: '/(admin)/field-enumerators', iconName: 'account-group-outline' },
  { id: 'citizen-reports', label: 'Citizen Reports', route: '/(admin)/citizen-reports', iconName: 'bullhorn-outline' },
  { id: 'settings', label: 'Settings', route: '/(admin)/dashboard', iconName: 'cog-outline' },
];

interface AdminDrawerProps {
  profile?: {
    name: string;
    id: string;
    zone?: string;
  };
}

export default function AdminDrawer({ profile }: AdminDrawerProps) {
  const { isOpen, close } = useAdminDrawer();

  const userProfile = profile || {
    name: 'Admin',
    id: 'ADM-001',
    zone: 'All Zones',
  };

  return (
    <SideDrawer
      visible={isOpen}
      onClose={close}
      menuItems={ADMIN_MENU_ITEMS}
      profile={userProfile}
      branding="DRISHTI"
      version="Admin v1.0"
    />
  );
}
