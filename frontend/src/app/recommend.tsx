import AppTabs from '@/components/app-tabs';
import { Text, View } from 'react-native';

export default function RecommendScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>추천 화면</Text>

      <AppTabs />
    </View>
  );
}