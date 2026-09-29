import AppTabs from '@/components/app-tabs';
import { Text, View } from 'react-native';

export default function RecommendScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>트래블보드 화면</Text>

      <AppTabs />
    </View>
  );
}