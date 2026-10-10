//설정 화면.
import AppTabs from '@/components/app-tabs';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SettingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>설정</Text>

        {/* 설정 및 내 정보 */}
        <Text style={styles.sectionLabel}>설정 및 내 정보</Text>

        <Pressable
          style={styles.profileCard}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>사진</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>다지지</Text>
            <Text style={styles.profileDescription}>
              내 프로필을 관리해보세요.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* 다녀온 여행(마커 등록한 수) */}
        <View style={styles.travelCountCard}>
          <Text style={styles.travelCountNumber}>5</Text>
          <Text style={styles.travelCountText}>다녀온 여행</Text>
        </View>

        {/* 앱 설정 */}
        <SettingGroup title="앱 설정">
          <SettingItem
            title="알림"
            onPress={() => {}}
          />

          <SettingItem
            title="앱 권한"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* 약관 및 정책 */}
        <SettingGroup title="약관 및 정책">
          <SettingItem
            title="서비스 이용약관"
            onPress={() => {}}
          />

          <SettingItem
            title="개인정보처리방침"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* 의견 */}
        <SettingGroup title="의견">
          <SettingItem
            title="의견 보내기"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* 로그아웃 / 회원탈퇴 */}
        <View style={styles.accountActions}>
          <Pressable>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable>
            <Text style={styles.deleteText}>회원탈퇴</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppTabs />
    </View>
  );
}

/* 설정 그룹 */
function SettingGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.groupSection}>
      <Text style={styles.sectionLabel}>{title}</Text>

      <View style={styles.settingBox}>
        {children}
      </View>
    </View>
  );
}

/* 설정 항목 */
function SettingItem({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <Text style={styles.settingItemText}>{title}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 110,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 28,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 10,
  },

  /* 프로필 */

  profileCard: {
    minHeight: 92,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E9F1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImageText: {
    fontSize: 11,
    color: '#8AA4A8',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  profileDescription: {
    marginTop: 5,
    fontSize: 12,
    color: '#999999',
  },

  arrow: {
    fontSize: 26,
    color: '#AAAAAA',
    marginLeft: 8,
  },

  /* 여행 횟수 */

  travelCountCard: {
    height: 82,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelCountNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#5EB1BF',
  },

  travelCountText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555555',
  },

  /* 설정 그룹 */

  groupSection: {
    marginTop: 28,
  },

  settingBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    overflow: 'hidden',
  },

  settingItem: {
    minHeight: 52,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  settingItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },

  /* 로그아웃, 탈퇴 */

  accountActions: {
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    fontSize: 13,
    color: '#666666',
  },

  deleteText: {
    fontSize: 13,
    color: '#da4e4e',
  },

  actionDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 14,
  },
});