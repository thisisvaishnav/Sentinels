import { Stack } from 'expo-router';

export default function EnumeratorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="start-survey" />
      <Stack.Screen name="register-household" />
      <Stack.Screen name="report-missing" />
      <Stack.Screen name="gis-map" />
      <Stack.Screen name="priority-tasks" />
      <Stack.Screen name="assigned-zone" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
