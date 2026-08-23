import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="field-enumerators" />
      <Stack.Screen name="enumerator-command-center" />
      <Stack.Screen name="add-new-staff" />
    </Stack>
  );
}
