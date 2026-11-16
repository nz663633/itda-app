
import api from '@/api/axios';

// 내 정보 타입
export type UserProfile = {
  user_id: number;
  user_name: string;
  profile_image_url: string | null;
};

// 내 정보 조회
export const getMyProfile = async () => {
  const response = await api.get('/users/me');
  return response.data as UserProfile;
};

// 프로필 수정
export const updateMyProfile = async (user_name: string) => {
  const response = await api.patch('/users/me', {
    user_name,
  });
  return response.data as UserProfile;
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  const response = await api.delete('/users/me');
  return response.data;
};
