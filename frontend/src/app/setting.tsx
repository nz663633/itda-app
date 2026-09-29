import AppTabs from '@/components/app-tabs';
import { Text, View } from 'react-native';

export default function SettingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>설정 화면</Text>

      <AppTabs />
    </View>
  );
}