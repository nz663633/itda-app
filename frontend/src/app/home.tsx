import AppTabs from '@/components/app-tabs';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>잇다 홈 화면</Text>

      <AppTabs />
    </View>
  );
}