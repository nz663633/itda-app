// 시작 화면.
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View, } from 'react-native';

export default function StartScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>

      <Image
        source={require('@/assets/images/start.png')}
        style={styles.background}
      />

      <View style={styles.buttonContainer}>

        <Pressable
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>로그인</Text>
        </Pressable>

        <Pressable
          style={styles.signupButton}
        >
          <Text style={styles.signupText}>회원가입</Text>
        </Pressable>

    
        <Pressable onPress={() => router.push('/home')}>
          <Text style={styles.guestText}>로그인 없이 둘러보기</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
     background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },

  loginButton: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2a4347',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signupButton: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  signupText: {
    color: '#5EB1BF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  guestText: {
    color: '#555555',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});