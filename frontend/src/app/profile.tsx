//프로필 화면.
import { useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>프로필 설정</Text>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveText}>저장</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* 프로필 사진 */}
        <View style={styles.profilePhotoContainer}>
  <View style={styles.profilePhoto}>
    <Text style={styles.photoText}>사진</Text>
  </View>

  <Pressable style={styles.photoAddButton}>
    <Text style={styles.photoAddText}>+</Text>
  </Pressable>
</View>

        {/* 닉네임 */}
        <View style={styles.section}>
          <Text style={styles.label}>닉네임</Text>

          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력해주세요."
            placeholderTextColor="#AAAAAA"
            defaultValue="여행자"
          />
        </View>

        {/* 계정 관리 */}
        <View style={styles.section}>
          <Text style={styles.label}>계정 관리</Text>

          <View style={styles.accountBox}>
            <View style={styles.accountItem}>
              <Text style={styles.itemTitle}>로그인 방식</Text>

              <Text style={styles.itemValue}>
                카카오 로그인
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },

  /* 상단 */

  header: {
    height: 100,
    paddingTop: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  backText: {
    fontSize: 34,
    fontWeight: '300',
    color: '#444444',
    lineHeight: 36,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },

  saveButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5EB1BF',
  },

  /* 내용 */

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  /* 프로필 사진 */

  profilePhotoContainer: {
  alignSelf: 'center',
  position: 'relative',
  marginTop: 10,
},

profilePhoto: {
  width: 130,
  height: 130,
  borderRadius: 65,
  backgroundColor: '#E9F1F2',
  justifyContent: 'center',
  alignItems: 'center',
},

photoText: {
  fontSize: 13,
  color: '#8AA4A8',
},

photoAddButton: {
  position: 'absolute',
  right: -3,
  bottom: -3,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#5EB1BF',
  borderWidth: 3,
  borderColor: '#FEFEFE',
  justifyContent: 'center',
  alignItems: 'center',
},

photoAddText: {
  color: '#FFFFFF',
  fontSize: 25,
  fontWeight: '300',
  marginTop: -2,
},

  /* 입력 */

  section: {
    marginTop: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 10,
  },

  input: {
    height: 52,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#222222',
  },

  /* 계정 관리 */

  accountBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    overflow: 'hidden',
  },

  accountItem: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },

  itemValue: {
    fontSize: 13,
    color: '#888888',
  },
});