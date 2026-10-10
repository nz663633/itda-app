//하단 탭
import { usePathname, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

const tabs = [
  {
    path: '/home' as const,
    icon: require('../../assets/images/tabIcons/home.png'),
  },
  {
    path: '/recommend' as const,
    icon: require('../../assets/images/tabIcons/recommend.png'),
  },
  {
    path: '/board' as const,
    icon: require('../../assets/images/tabIcons/board.png'),
  },
  {
    path: '/setting' as const,
    icon: require('../../assets/images/tabIcons/setting.png'),
  },
];

export default function AppTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = pathname === tab.path;

        return (
          <Pressable
            key={tab.path}
            style={[
              styles.tab,
              selected && styles.selectedTab,
            ]}
            onPress={() => router.push(tab.path)}
          >
            <Image source={tab.icon} 
                   style={[styles.icon, selected && styles.selectedIcon,]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  tab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedTab: {
    backgroundColor: '#5EB1BF',
  },

  selectedIcon: {
  tintColor: '#FFFFFF',
},

  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor : '#98c3cb'
  },
});