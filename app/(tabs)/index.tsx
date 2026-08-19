import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import RoleSelectionScreen, { Role } from '@/src/screens/RoleSelectionScreen';

export default function HomeScreen() {
  const router = useRouter();

  const handleRoleSelect = async (role: Role) => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    await AsyncStorage.setItem('userRole', role);
    router.replace(`/(${role})/dashboard` as const);
  };

  return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
}

