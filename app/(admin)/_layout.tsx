import { Stack } from 'expo-router';
import { AdminDrawerProvider } from '@/src/contexts/AdminDrawerContext';

export default function AdminLayout() {
  return (
    <AdminDrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="field-enumerators" />
        <Stack.Screen name="enumerator-command-center" />
        <Stack.Screen name="add-new-staff" />
      </Stack>
    </AdminDrawerProvider>
  );
}
