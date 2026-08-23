import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const getIconName = (focused: boolean, outline: IconName, filled: IconName): IconName =>
  focused ? filled : outline;

// M3 tab button: adds ripple + selection haptic without clobbering the
// navigator's own press handling.
function TabBarButton({ children, onPressIn, style, ...rest }: any) {
  return (
    <Pressable
      {...rest}
      style={style}
      android_ripple={{ color: AppColors.primary + '1F', borderless: true }}
      onPressIn={(e) => {
        if (Platform.OS === 'android') {
          Haptics.selectionAsync();
        }
        onPressIn?.(e);
      }}
    >
      {children}
    </Pressable>
  );
}

export default function CitizenLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          // M3 uses tonal elevation instead of a hairline divider.
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          // Respect the Android gesture-nav inset under edge-to-edge.
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={getIconName(focused, 'home-outline', 'home')} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={getIconName(focused, 'stats-chart-outline', 'stats-chart')} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schemes"
        options={{
          title: 'Schemes',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={getIconName(focused, 'newspaper-outline', 'newspaper')} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={getIconName(focused, 'help-circle-outline', 'help-circle')} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="household" options={{ href: null }} />
    </Tabs>
  );
}
