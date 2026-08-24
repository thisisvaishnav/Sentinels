import { Stack } from 'expo-router';

export default function CitizenRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="report-need" />
      <Stack.Screen name="scheme-application" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
