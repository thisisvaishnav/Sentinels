import { Stack } from 'expo-router';
import { CitizenDrawerProvider } from '@/src/contexts/CitizenDrawerContext';
import { CitizenDrawer } from '@/src/components/citizen/CitizenDrawer';

export default function CitizenLayout() {
  return (
    <CitizenDrawerProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <CitizenDrawer />
    </CitizenDrawerProvider>
  );
}
