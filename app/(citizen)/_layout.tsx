import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { CitizenDrawerProvider } from '@/src/contexts/CitizenDrawerContext';
import { CitizenDrawer } from '@/src/components/citizen/CitizenDrawer';

export default function CitizenLayout() {
  return (
    <CitizenDrawerProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E2E8F0',
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 28,
          },
          tabBarActiveTintColor: '#0EA5E9',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="schemes"
          options={{
            title: 'Schemes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen name="household" options={{ href: null }} />
      </Tabs>
      <CitizenDrawer />
    </CitizenDrawerProvider>
  );
}
