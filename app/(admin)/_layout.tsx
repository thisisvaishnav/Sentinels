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
        <Stack.Screen name="add-new-enumerator" />
        <Stack.Screen name="survey-management" />
        <Stack.Screen name="citizen-reports" />
        <Stack.Screen name="supervisor-escalations" />
        <Stack.Screen name="supervisor-escalation-details" />
        <Stack.Screen name="notifications" />
      </Stack>
    </AdminDrawerProvider>
  );
}
