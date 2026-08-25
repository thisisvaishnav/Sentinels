import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function EnumeratorLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setIsAuthenticated(!!session?.user);
        }
      } catch (err) {
        console.error('[EnumeratorLayout] Auth check error:', err);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(!!session?.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
      <Stack.Screen name="verification" />
      <Stack.Screen name="anomalies" />
      <Stack.Screen name="blind-spots" />
      <Stack.Screen name="daily-progress" />
      <Stack.Screen name="sync" />
      <Stack.Screen name="escalations" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

