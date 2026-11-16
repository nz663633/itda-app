
import * as SecureStore from 'expo-secure-store';

// Access Token 저장
export const saveAccessToken = async (token: string) => {
  await SecureStore.setItemAsync('accessToken', token);
};

// Refresh Token 저장
export const saveRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync('refreshToken', token);
};

// Access Token 조회
export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

// Refresh Token 조회
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

// 토큰 2개 모두 삭제
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};

// 새 토큰 2개 저장
export const saveTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
};
