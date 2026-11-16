
import api from '@/api/axios';


// 트래블보드 생성
export const createBoard = async (data: {
  course_id: number;
  board_title: string;
  board_context: string;
  visited_at: string;
}) => {
  const response = await api.post('/boards', data);
  return response.data;
};

// 보드 목록에서 사용하는 여행지 타입
export type BoardPlace = {
  destination_id: number;
  destination_name: string;
  latitude: number;
  longitude: number;
};

// 내 보드 목록 타입
export type Board = {
  board_id: number;
  board_title: string;
  course_id: number;
  course_title: string;
  places: BoardPlace[];
  visited_at: string;
};

// 보드 상세 타입
export type BoardDetail = Board & {
  board_context: string | null;
  photos: unknown[];
  expenses: unknown[];
  created_at: string;
  updated_at: string;
};

// 내 보드 목록 조회
export const getBoards = async () => {
  const response = await api.get('/boards');
  return response.data.boards as Board[];
};

// 보드 상세 조회
export const getBoardDetail = async (boardId: number) => {
  const response = await api.get(`/boards/${boardId}`);
  return response.data as BoardDetail;
};

// 보드 수정
export const updateBoard = async (
  boardId: number,
  data: {
    board_title?: string;
    board_context?: string;
    visited_at?: string;
  }
) => {
  const response = await api.patch(`/boards/${boardId}`, data);
  return response.data;
};

// 보드 삭제
export const deleteBoard = async (boardId: number) => {
  const response = await api.delete(`/boards/${boardId}`);
  return response.data;
};
