// 시작 화면.
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, 
         Pressable, 
         StyleSheet, 
         Text, 
         View, 
         Alert, 
         ActivityIndicator
        } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

  const API_URL = 'http://10.0.2.2:3000/api/auth/login';

  type Provider = 'kakao' | 'naver' | 'google';

export default function StartScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 구글 인증 요청
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
  });

  // 네이버 SDK 초기화
  useEffect(() => {
    NaverLogin.initialize({
      appName: 'itda',
      consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID!,
      consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET!,
    });
  }, []);

  // 자동 로그인 확인
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          router.replace('/home');
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
      }
    };

    checkLogin();
  }, [router]);

  // 서버에 소셜 토큰 전달 → JWT 저장 → 화면 이동 (공통)
  const loginToServer = async (provider: Provider, providerToken: string) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        provider_token: providerToken,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || '서버 로그인 실패');
    }
    if (!result.token) {
      throw new Error('서버 토큰 오류');
    }

    await SecureStore.setItemAsync('authToken', result.token);

    // 나중에 취향 질문 화면이 준비되면 해당 화면으로 변경
    router.replace('/home');
  };

  // 로딩 처리 + 에러 처리 (공통)
  // getToken: 각 소셜 SDK로 로그인해서 accessToken을 돌려주는 함수
  const handleSocialLogin = async (
    provider: Provider,
    getToken: () => Promise<string>
  ) => {
    try {
      setLoading(true);
      const token = await getToken();
      await loginToServer(provider, token);
    } catch (error) {
      Alert.alert(
        '로그인 실패',
        error instanceof Error ? error.message : '로그인 오류'
      );
    } finally {
      setLoading(false);
    }
  };

  // 구글: 인증 성공하면 서버로 전달
  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication?.accessToken;
      if (accessToken) {
        handleSocialLogin('google', async () => accessToken);
      }
    }
  }, [response]);

  // 카카오
  const handleKakaoLogin = () =>
    handleSocialLogin('kakao', async () => {
      const kakaoToken = await kakaoLogin();
      return kakaoToken.accessToken;
    });

  // 네이버
  const handleNaverLogin = () =>
    handleSocialLogin('naver', async () => {
      const { successResponse, failureResponse } = await NaverLogin.login();
      if (!successResponse) {
        throw new Error(failureResponse?.message || '네이버 로그인 실패');
      }
      return successResponse.accessToken;
    });


  return (
    <View style={styles.container}>

      <Image
        source={require('@/assets/images/start.png')}
        style={styles.background}
      />

      <View style={styles.buttonContainer}>

        <Pressable
          style={[styles.socialButton, styles.kakaoButton]}
          onPress={handleKakaoLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#191919" />
          ) : (
            <Text style={styles.kakaoText}>카카오로 시작하기</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.socialButton, styles.naverButton]}
          onPress={handleNaverLogin}
        >
          <Text style={styles.naverText}>네이버로 시작하기</Text>
        </Pressable>

        <Pressable
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text style={styles.googleText}>구글로 시작하기</Text>
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

  socialButton: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  kakaoButton: {
    backgroundColor: '#FEE500',
  },

  kakaoText: {
    color: '#191919',
    fontSize: 16,
    fontWeight: 'bold',
  },

  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  googleText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },

  naverButton: {
    backgroundColor: '#03C75A',
  },

  naverText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  guestButton: {
    marginTop: 3,
  },

  guestText: {
    color: '#555555',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});