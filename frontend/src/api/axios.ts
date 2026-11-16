
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/token';

// Android 폰에서 접속할 백엔드 주소
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 재요청 여부 확인용 타입
type CustomConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// 토큰 갱신 중 대기하는 요청들
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

// 대기 중인 요청 처리
const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// 로그아웃 처리
const forceLogout = async () => {
  await clearTokens();
  router.replace('/');
};

// 1. 요청 인터셉터: Access Token 자동 첨부
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 응답 인터셉터: 401이면 토큰 갱신
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomConfig | undefined;

    // 응답이 없거나 요청 정보가 없는 경우
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 403은 권한 없음이므로 로그아웃하지 않음
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    // 401이 아니거나 이미 재시도한 요청이면 종료
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 이미 토큰 갱신 중이면 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh Token이 없습니다.');
      }

      // 기존 api가 아닌 axios로 요청하여 인터셉터 반복 방지
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newAccessToken = response.data.token;
      const newRefreshToken = response.data.refresh_token;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('새 토큰 발급에 실패했습니다.');
      }

      // 새 토큰 2개 저장
      await saveTokens(newAccessToken, newRefreshToken);

      // 대기 중인 요청에 새 Access Token 전달
      processQueue(null, newAccessToken);

      // 원래 요청 다시 실행
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      // Refresh Token이 만료되거나 유효하지 않은 경우
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        await forceLogout();
      } else if (
        refreshError instanceof Error &&
        refreshError.message === 'Refresh Token이 없습니다.'
      ) {
        await forceLogout();
      }

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

// 로그아웃 API
export const logout = async () => {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } finally {
    // 서버 요청 성공 여부와 관계없이 로컬 토큰 삭제
    await clearTokens();
    router.replace('/');
  }
};

export default api;
