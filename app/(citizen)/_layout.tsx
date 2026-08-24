import { Stack } from 'expo-router';
import { CitizenDrawerProvider } from '@/src/contexts/CitizenDrawerContext';
import { CitizenDrawer } from '@/src/components/citizen/CitizenDrawer';

export default function CitizenRootLayout() {
  return (
    <CitizenDrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="schemes" />
        <Stack.Screen name="support" />
        <Stack.Screen name="household" />
        <Stack.Screen name="report-need" />
        <Stack.Screen name="scheme-application" />
        <Stack.Screen name="notifications" />
      </Stack>
      <CitizenDrawer />
    </CitizenDrawerProvider>
  );
}
