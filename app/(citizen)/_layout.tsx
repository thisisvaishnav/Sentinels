import { Stack } from 'expo-router';

export default function CitizenRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="household" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="schemes" />
      <Stack.Screen name="support" />
      <Stack.Screen name="report-need" />
      <Stack.Screen name="scheme-application" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
