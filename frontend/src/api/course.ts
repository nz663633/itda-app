import api from '@/api/axios';

// 코스 타입
export type Course = {
  course_id: number;
  course_title: string;
  destination_count: number;
};

// 코스 내 여행지 타입
export type CourseDestination = {
  destination_id: number;
  destination_name: string;
  visit_order: number;
};

// 코스 생성
export const createCourse = async (course_title: string) => {
  const response = await api.post('/courses', { course_title });
  return response.data;
};

// 내 코스 목록 조회
export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data.courses as Course[];
};

// 코스 상세 조회
export const getCourseDetail = async (courseId: number) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};

// 코스 제목 수정
export const updateCourse = async (
  courseId: number,
  course_title: string
) => {
  const response = await api.patch(`/courses/${courseId}`, {
    course_title,
  });
  return response.data;
};

// 코스 삭제
export const deleteCourse = async (courseId: number) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};

// 코스에 여행지 추가
export const addDestinationToCourse = async (
  courseId: number,
  destinationId: number
) => {
  const response = await api.post(
    `/courses/${courseId}/destinations`,
    { destination_id: destinationId }
  );
  return response.data;
};

// 코스에서 여행지 제거
export const removeDestinationFromCourse = async (
  courseId: number,
  destinationId: number
) => {
  const response = await api.delete(
    `/courses/${courseId}/destinations/${destinationId}`
  );
  return response.data;
};