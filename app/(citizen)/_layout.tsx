import { Stack } from 'expo-router';
import { CitizenDrawerProvider } from '@/src/contexts/CitizenDrawerContext';
import { CitizenDrawer } from '@/src/components/citizen/CitizenDrawer';

export default function CitizenRootLayout() {
  return (
    <CitizenDrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report-need" />
        <Stack.Screen name="scheme-application" />
        <Stack.Screen name="notifications" />
      </Stack>
      <CitizenDrawer />
    </CitizenDrawerProvider>
  );
}
