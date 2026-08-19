import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const surface = '#f7f9fb';
const primary = '#162839';
const onPrimaryContainer = '#96a9be';
const primaryContainer = '#2c3e50';
const onSurfaceVariant = '#43474c';
const outlineVariant = '#c4c6cd';
const surfaceContainerLowest = '#ffffff';
const secondary = '#006397';

type RoleKey = 'citizen' | 'enumerator' | 'admin';

const ROLES: {
  key: RoleKey;
  icon: 'person' | 'edit-document' | 'admin-panel-settings';
  title: string;
  description: string;
  route: '/(citizen)/dashboard' | '/(enumerator)/dashboard' | '/(admin)/dashboard';
}[] = [
  {
    key: 'citizen',
    icon: 'person',
    title: 'Citizen',
    description: 'Report your household and find government schemes',
    route: '/(citizen)/dashboard',
  },
  {
    key: 'enumerator',
    icon: 'edit-document',
    title: 'Enumerator',
    description: 'Field data collection and zone verification',
    route: '/(enumerator)/dashboard',
  },
  {
    key: 'admin',
    icon: 'admin-panel-settings',
    title: 'Admin',
    description: 'System oversight, GIS analysis, and command center',
    route: '/(admin)/dashboard',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const selectRole = async (role: (typeof ROLES)[number]) => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    await AsyncStorage.setItem('userRole', role.key);
    router.replace(role.route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Sentinels</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Select your role to continue</Text>
        <View style={styles.roleList}>
          {ROLES.map((role) => (
            <Pressable
              key={role.key}
              style={({ pressed }) => [
                styles.roleCard,
                pressed && styles.roleCardPressed,
              ]}
              onPress={() => selectRole(role)}
            >
              <View style={styles.iconBadge}>
                <MaterialIcons name={role.icon} size={24} color={onPrimaryContainer} />
              </View>
              <View style={styles.roleText}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Need help?</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surface,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    color: primary,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.02 * 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  subtitle: {
    color: onSurfaceVariant,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  roleList: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: surfaceContainerLowest,
    borderWidth: 1,
    borderColor: outlineVariant,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  roleCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f2f4f6',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    color: primary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 4,
  },
  roleDescription: {
    color: onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  help: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 32,
  },
  helpText: {
    color: secondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
