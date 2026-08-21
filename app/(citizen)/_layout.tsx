import { Stack } from 'expo-router';

export default function CitizenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="household" />
    </Stack>
  );
}
