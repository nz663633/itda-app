// 여행 코스 화면.
import AppTabs from '@/components/app-tabs';
import { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from '@/api/axios';
import {
  getCourses,
  createCourse,
  addDestinationToCourse,
  getCourseDetail,
  removeDestinationFromCourse,
  updateCourse,
  deleteCourse,
  type Course,
  type CourseDestination,
} from '@/api/course';
import { createBoard } from '@/api/board';

//옵션 타입 
type PreferenceOption = {
  option_id: number;
  option_name: string;
};
//카데고리 타입
type PreferenceCategory = {
  category_id: number;
  category_name: string;
  options: PreferenceOption[];
};
//지역 타입
type Region = {
  region_id: number;
  region_name: string;
};
//추천 지역 상세 조회 타입 
type DestinationDetail = {
  destination_id: number;
  destination_name: string;
  region: {
    region_id: number;
    region_name: string;
  };
  address: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  description: string | null;
  tags: string[];
};

export default function RecommendScreen() {
  // 여행지 추천 영역 열기/닫기
  const [showTravelFinder, setShowTravelFinder] = useState(false);

  // 추천 결과 표시
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 선택한 여행 스타일
  const [selectedStyles, setSelectedStyles] = useState<number[]>([]);

  // 내 코스에 담긴 여행지
  const [selectedPlaces, setSelectedPlaces] = useState([
    '문학경기장',
    '포케품은초밥',
    '영종도',
  ]);

  const toggleStyle = (optionId: number) => {
    setSelectedStyles((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const addPlace = (name: string) => {
    if (!selectedPlaces.includes(name)) {
      setSelectedPlaces([...selectedPlaces, name]);
    }
  };

  // 추천 초기화
  const resetRecommendation = () => {
    setSelectedStyles([]);
    setShowRecommendations(false);
  };

  // 서버에서 가져온 취향 질문
  const [preferenceOptions, setPreferenceOptions] =
    useState<PreferenceCategory[]>([]);

  const [recommendations, setRecommendations] = useState<any[]>([]);

  const [loadingPreferences, setLoadingPreferences] = useState(false);

  // 내 코스 목록
  const [courses, setCourses] = useState<Course[]>([]);

  const [loadingCourses, setLoadingCourses] = useState(false);

  // 취향 질문 조회
  const getPreferences = async () => {
    try {
      setLoadingPreferences(true);

      const response = await api.get('/preferences/options');

      console.log('취향 질문 조회 성공:', response.data);

      setPreferenceOptions(response.data.categories);
    } catch (error) {
      console.error('취향 질문 조회 실패:', error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  // 내 코스 목록 조회
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);

      const data = await getCourses();
      setCourses(data);

      console.log('내 코스 조회 성공:', data);
    } catch (error) {
      console.error('내 코스 조회 실패:', error);
    } finally {
      setLoadingCourses(false);
    }
  };
  // 코스 상세 조회
  const handleCourseDetail = async (courseId: number) => {
    try {
      const data = await getCourseDetail(courseId);
      setSelectedCourse(data);
      setEditingCourseTitle(data.course_title);

      console.log('코스 상세 조회 성공:', data);
    } catch (error) {
      console.error('코스 상세 조회 실패:', error);
      alert('코스 상세 정보를 불러오지 못했습니다.');
    }
  };
  //코스에서 여행지 삭제
  const handleRemoveDestination = async (destinationId: number) => {
    if (!selectedCourse) return;

    try {
      await removeDestinationFromCourse(
        selectedCourse.course_id,
        destinationId
      );

      alert('여행지를 삭제했습니다.');

      await handleCourseDetail(selectedCourse.course_id);
      await loadCourses();
    } catch (error) {
      console.error('여행지 삭제 실패:', error);
      alert('여행지 삭제에 실패했습니다.');
    }
  };

  //코스 제목 수정
  const handleUpdateCourse = async () => {
    if (!selectedCourse || !editingCourseTitle.trim()) {
      alert('코스 제목을 입력해 주세요.');
      return;
    }

    try {
      await updateCourse(
        selectedCourse.course_id,
        editingCourseTitle.trim()
      );

      alert('코스 제목을 수정했습니다.');

      await handleCourseDetail(selectedCourse.course_id);
      await loadCourses();
    } catch (error) {
      console.error('코스 수정 실패:', error);
      alert('코스 수정에 실패했습니다.');
    }
  };


  //코스 생성
  const handleCreateCourse = async () => {
    if (!courseTitle.trim()) {
      alert('코스 제목을 입력해 주세요.');
      return;
    }

    try {
      setCreatingCourse(true);

      await createCourse(courseTitle.trim());

      alert('코스가 생성되었습니다.');

      setCourseTitle('');
      setShowCreateCourse(false);

      // 코스 목록 새로고침
      await loadCourses();
    } catch (error) {
      console.error('코스 생성 실패:', error);
      alert('코스 생성에 실패했습니다.');
    } finally {
      setCreatingCourse(false);
    }
  };
  // 코스 삭제 함수
  const handleDeleteCourse = async (courseId: number) => {
    try {
      await deleteCourse(courseId);

      alert('코스를 삭제했습니다.');

      setSelectedCourse(null);
      await loadCourses();
    } catch (error) {
      console.error('코스 삭제 실패:', error);
      alert('코스 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    getPreferences();
    getRegions();
    loadCourses();
  }, []);

  const handleRecommend = async () => {
    if (selectedStyles.length === 0) {
      alert('취향을 하나 이상 선택해 주세요.');
      return;
    }

    try {
      // 1. 선택한 취향 DB에 저장
      await api.put('/users/me/preferences', {
        option_ids: selectedStyles,
      });

      // 2. 저장된 취향으로 여행지 추천 요청
      const response = await api.get('/destinations/recommendations', {
        params: {
          limit: 10,
          ...(selectedRegionId !== null && {
            region_id: selectedRegionId,
          }),
        },
      });

      // 3. 추천 결과 저장
      setRecommendations(response.data.destinations);
      setShowRecommendations(true);

      console.log('추천 결과:', response.data);
    } catch (error) {
      console.error('여행지 추천 실패:', error);
      alert('추천을 불러오지 못했습니다.');
    }
  };
  //지역 상태
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  //지역 목록 조회
  const getRegions = async () => {
    try {
      const response = await api.get('/regions');
      setRegions(response.data.regions);
      console.log('지역 목록 조회 성공:', response.data);
    } catch (error) {
      console.error('지역 목록 조회 실패:', error);
    }
  };
  //추천 여행지 상세 정보 상태
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  //상세 정보 조회
  const getDestinationDetail = async (destinationId: number) => {
    try {
      setLoadingDetail(true);

      const response = await api.get(`/destinations/${destinationId}`);

      setSelectedDestination(response.data);
      console.log('여행지 상세 조회 성공:', response.data);
    } catch (error) {
      console.error('여행지 상세 조회 실패:', error);
      alert('여행지 상세 정보를 불러오지 못했습니다.');
    } finally {
      setLoadingDetail(false);
    }
  };

  // 코스 생성 UI
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);

  // 여행지를 담을 코스 선택
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] =
    useState<number | null>(null);
  const [addingDestination, setAddingDestination] = useState(false);
  //코스 선택
  const openCourseSelect = (destinationId: number) => {
    setSelectedDestinationId(destinationId);
    setShowCourseSelect(true);
  };
  //코스에 여행지 추가 함수 
  const handleAddToCourse = async (courseId: number) => {
    if (selectedDestinationId === null) return;

    try {
      setAddingDestination(true);

      await addDestinationToCourse(
        courseId,
        selectedDestinationId
      );

      alert('코스에 여행지를 추가했습니다.');

      setShowCourseSelect(false);
      setSelectedDestinationId(null);

      await loadCourses();
    } catch (error) {
      console.error('코스에 여행지 추가 실패:', error);
      alert('여행지를 추가하지 못했습니다. 이미 포함된 여행지인지 확인해 주세요.');
    } finally {
      setAddingDestination(false);
    }
  };

  // 선택한 코스 상세 정보
  const [selectedCourse, setSelectedCourse] = useState<{
    course_id: number;
    course_title: string;
    destinations: CourseDestination[];
  } | null>(null);

  // 코스 제목 수정
  const [editingCourseTitle, setEditingCourseTitle] = useState('');

  // 여행 완료 및 트래블보드 생성
  const handleCompleteCourse = () => {
    if (!selectedCourse) return;

    if (selectedCourse.destinations.length === 0) {
      Alert.alert('알림', '여행지가 담긴 코스만 여행 완료할 수 있습니다.');
      return;
    }

    Alert.alert(
      '여행 완료',
      '이 코스를 트래블보드에 기록할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '기록하기',
          onPress: async () => {
            try {
              // 한국 현지 날짜 기준
              const today = new Date();
              const visitedAt = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, '0'),
                String(today.getDate()).padStart(2, '0'),
              ].join('-');

              await createBoard({
                course_id: selectedCourse.course_id,
                board_title: editingCourseTitle.trim() || '나의 여행',
                board_context: '',
                visited_at: visitedAt,
              });

              Alert.alert(
                '등록 완료',
                '트래블보드에 여행 기록이 생성되었습니다.',
                [
                  {
                    text: '확인',
                    onPress: () => setSelectedCourse(null),
                  },
                ]
              );
            } catch (error) {
              console.error('트래블보드 생성 실패:', error);
              Alert.alert('오류', '트래블보드 생성에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* 페이지 제목 */}
        <Text style={styles.title}>여행</Text>

        <Text style={styles.pageDescription}>
          나만의 여행을 계획해보세요.
        </Text>

        {/* 여행지 추천 */}
        <View style={styles.section}>
          <View style={styles.recommendHeader}>
            <View style={styles.recommendHeaderText}>
              <Text style={styles.recommendTitle}>
                여행지 추천
              </Text>

              {!showTravelFinder && (
                <Text style={styles.recommendDescription}>
                  원하는 여행지를 추천받아보세요.
                </Text>
              )}
            </View>

            {/* 열기 / 닫기 */}
            <Pressable
              style={styles.openButton}
              onPress={() => {
                setShowTravelFinder(!showTravelFinder);

                // 닫을 때 추천 결과도 닫기
                if (showTravelFinder) {
                  setShowRecommendations(false);
                }
              }}
            >
              <Text style={styles.openButtonText}>
                {showTravelFinder ? '×' : '→'}
              </Text>
            </Pressable>
          </View>

          {/* 추천 영역 */}
          {showTravelFinder && (
            <View style={styles.findTravelContent}>
              {/* 여행 스타일 */}
              <Text style={styles.sectionTitle}>
                여행 스타일
              </Text>
              <View style={styles.tagContainer}>

                <Text style={styles.sectionTitle}>여행 지역 선택</Text>
                <Pressable
                  style={[
                    styles.tag,
                    selectedRegionId === null && styles.selectedTag,
                  ]}
                  onPress={() => setSelectedRegionId(null)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedRegionId === null && styles.selectedTagText,
                    ]}
                  >
                    전체
                  </Text>
                </Pressable>

                {regions.map((region) => (
                  <Pressable
                    key={region.region_id}
                    style={[
                      styles.tag,
                      selectedRegionId === region.region_id && styles.selectedTag,
                    ]}
                    onPress={() => setSelectedRegionId(region.region_id)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedRegionId === region.region_id && styles.selectedTagText,
                      ]}
                    >
                      {region.region_name}
                    </Text>
                  </Pressable>
                ))}

                {loadingPreferences ? (
                  <Text>취향 옵션을 불러오는 중...</Text>
                ) : (
                  preferenceOptions.map((category) => (
                    <View key={category.category_id}>
                      <Text style={styles.sectionTitle}>
                        {category.category_name}
                      </Text>

                      <View style={styles.tagContainer}>
                        {category.options.map((option) => (
                          <Pressable
                            key={option.option_id}
                            style={[
                              styles.tag,
                              selectedStyles.includes(option.option_id) &&
                              styles.selectedTag,
                            ]}
                            onPress={() => toggleStyle(option.option_id)}
                          >
                            <Text
                              style={[
                                styles.tagText,
                                selectedStyles.includes(option.option_id) &&
                                styles.selectedTagText,
                              ]}
                            >
                              {option.option_name}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ))
                )}

              </View>

              {/* 추천받기 */}
              <Pressable
                style={styles.recommendButton}
                onPress={handleRecommend}
              >
                <Image
                  source={require('../../assets/images/tabIcons/recommend.png')}
                  style={styles.recommendIcon}
                />

                <Text style={styles.recommendButtonText}>
                  추천받기
                </Text>
              </Pressable>

              {/* 추천 결과 */}
              {showRecommendations && (
                <View style={styles.recommendResult}>
                  <View style={styles.resultHeader}>
                    <View>
                      <Text style={styles.resultTitle}>
                        추천 여행지
                      </Text>

                      <Text style={styles.resultDescription}>
                        다지지님에게 맞는 여행지예요.
                      </Text>
                    </View>

                    <Pressable
                      onPress={resetRecommendation}
                    >
                      <Text style={styles.resetText}>
                        초기화
                      </Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.destinationList}
                  >
                    {recommendations.map((destination) => (
                      <DestinationCard
                        key={destination.destination_id}
                        name={destination.destination_name}
                        description={destination.region?.region_name ?? ''}
                        onAdd={() => openCourseSelect(destination.destination_id)}
                        onDetail={() => getDestinationDetail(destination.destination_id)}
                      />
                    ))}
                  </ScrollView>

                </View>
              )}

              {loadingDetail && (
                <Text>상세 정보를 불러오는 중...</Text>
              )}

              {selectedDestination && (
                <View style={styles.destinationCard}>
                  {/* 여행지 사진 */}
                  {selectedDestination.image_url && (
                    <Image
                      source={{ uri: selectedDestination.image_url }}
                      style={{ width: '100%', height: 200, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                  )}

                  {/* 여행지 이름 */}
                  <Text style={styles.destinationName}>
                    {selectedDestination.destination_name}
                  </Text>

                  {/* 지역 및 주소 */}
                  <Text style={styles.destinationDescription}>
                    {selectedDestination.region?.region_name}
                  </Text>

                  <Text>
                    {selectedDestination.address ?? '주소 정보 없음'}
                  </Text>

                  {/* 여행지 설명 */}
                  <Text>
                    {selectedDestination.description ?? '소개 정보 없음'}
                  </Text>

                  {/* 태그 */}
                  <View style={styles.tagContainer}>
                    {selectedDestination.tags?.map((tag: string) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  {/* 닫기 */}
                  <Pressable
                    onPress={() => setSelectedDestination(null)}
                  >
                    <Text>닫기</Text>
                  </Pressable>
                </View>
              )}

            </View>
          )}
        </View>

        {/* 내 코스 */}
        <View style={styles.section}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={styles.sectionTitle}>내 코스</Text>

            <Pressable
              onPress={() => setShowCreateCourse(true)}
              style={styles.addDestinationButton}
            >
              <Text style={styles.addDestinationText}>
                ＋ 코스 만들기
              </Text>
            </Pressable>
          </View>

          <Text style={styles.description}>
            저장한 여행 코스를 확인하고 관리할 수 있어요.
          </Text>

          {/* 코스 생성 입력창 */}
          {showCreateCourse && (
            <View style={styles.destinationCard}>
              <Text style={styles.sectionTitle}>
                새 코스 만들기
              </Text>

              <TextInput
                style={styles.input}
                placeholder="코스 제목을 입력하세요."
                value={courseTitle}
                onChangeText={setCourseTitle}
                maxLength={50}
              />

              <View style={{ flexDirection: 'row', gap: 10, }}>
                <Pressable
                  style={styles.addDestinationButton}
                  onPress={() => {
                    setShowCreateCourse(false);
                    setCourseTitle('');
                  }}
                >
                  <Text style={styles.addDestinationText}>취소</Text>
                </Pressable>

                <Pressable
                  style={styles.addDestinationButton}
                  onPress={handleCreateCourse}
                  disabled={creatingCourse}
                >
                  <Text style={styles.addDestinationText}>
                    {creatingCourse ? '생성 중...' : '생성하기'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* 내 코스 목록 */}
          {loadingCourses ? (
            <Text>코스 목록을 불러오는 중...</Text>
          ) : courses.length === 0 ? (
            <Text>아직 생성한 코스가 없습니다.</Text>
          ) : (
            courses.map((course) => (
              <SavedTravelCard
                key={course.course_id}
                title={course.course_title}
                destinationCount={course.destination_count}
                onPress={() => handleCourseDetail(course.course_id)}
              />
            ))
          )}

          {/* 코스 상세 정보 */}
          {selectedCourse && (
            <View style={styles.destinationCard}>
              <Text style={styles.sectionTitle}>
                코스 상세 정보
              </Text>

              {/* 코스 제목 수정 */}
              <TextInput
                style={styles.input}
                value={editingCourseTitle}
                onChangeText={setEditingCourseTitle}
                placeholder="코스 제목"
                maxLength={50}
              />

              <Pressable
                style={styles.addDestinationButton}
                onPress={handleUpdateCourse}
              >
                <Text style={styles.addDestinationText}>
                  제목 수정
                </Text>
              </Pressable>

              {/* 여행지 목록 */}
              <Text>
                선택한 여행지 {selectedCourse.destinations.length}곳
              </Text>

              {selectedCourse.destinations.length === 0 ? (
                <Text>아직 담긴 여행지가 없습니다.</Text>
              ) : (
                selectedCourse.destinations.map((destination) => (
                  <View
                    key={destination.destination_id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: 8,
                    }}
                  >
                    <Text>
                      {destination.visit_order}. {destination.destination_name}
                    </Text>

                    <Pressable
                      onPress={() =>
                        handleRemoveDestination(destination.destination_id)
                      }
                    >
                      <Text style={{ color: 'red' }}>삭제</Text>
                    </Pressable>
                  </View>
                ))
              )}

              {/* 여행 완료 및 트래블보드 생성 */}
              <Pressable
                style={styles.addDestinationButton}
                onPress={handleCompleteCourse}
              >
                <Text style={styles.addDestinationText}>
                  여행 완료하고 트래블보드 만들기
                </Text>
              </Pressable>

              {/* 코스 삭제 */}
              <Pressable
                style={styles.addDestinationButton}
                onPress={() => handleDeleteCourse(selectedCourse.course_id)}
              >
                <Text style={{ color: 'red' }}>코스 삭제</Text>
              </Pressable>

              {/* 상세 정보 닫기 */}
              <Pressable onPress={() => setSelectedCourse(null)}>
                <Text>상세 정보 닫기</Text>
              </Pressable>
            </View>
          )}

        </View>

      </ScrollView>

      {/* 코스 선택 */}
      {showCourseSelect && (
        <View style={styles.destinationCard}>
          <Text style={styles.sectionTitle}>
            여행지를 담을 코스를 선택하세요.
          </Text>

          {courses.length === 0 ? (
            <Text>먼저 코스를 만들어 주세요.</Text>
          ) : (
            courses.map((course) => (
              <Pressable
                key={course.course_id}
                style={styles.addDestinationButton}
                onPress={() => handleAddToCourse(course.course_id)}
                disabled={addingDestination}
              >
                <Text style={styles.addDestinationText}>
                  {course.course_title}
                  {' '}({course.destination_count}곳)
                </Text>
              </Pressable>
            ))
          )}

          <Pressable
            onPress={() => setShowCourseSelect(false)}
          >
            <Text>취소</Text>
          </Pressable>
        </View>
      )}

      <AppTabs />
    </View>
  );
}

/* 여행 스타일 태그 */
function Tag({
  text,
  selected,
  onPress,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.tag,
        selected && styles.selectedTag,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tagText,
          selected && styles.selectedTagText,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

/* 추천 여행지 카드 */
function DestinationCard({
  name,
  description,
  onAdd,
  onDetail,
}: {
  name: string;
  description: string;
  onAdd: () => void;
  onDetail: () => void;
}) {
  return (
    <View style={styles.destinationCard}>
      <Pressable onPress={onDetail}>
        <View style={styles.destinationImage}>
          <Text style={styles.imageText}>사진</Text>
        </View>

        <Text style={styles.destinationName}>{name}</Text>

        <Text style={styles.destinationDescription}>
          {description}
        </Text>
      </Pressable>

      <Pressable
        style={styles.addDestinationButton}
        onPress={onAdd}
      >
        <Text style={styles.addDestinationText}>
          ＋ 코스에 담기
        </Text>
      </Pressable>
    </View>
  );
}

/* 선택한 여행지 */
function PlaceItem({
  number,
  name,
}: {
  number: number;
  name: string;
}) {
  return (
    <View style={styles.placeItem}>
      <Text style={styles.placeNumber}>{number}</Text>

      <Text style={styles.placeName}>{name}</Text>

      <Text style={styles.dragIcon}>☰</Text>
    </View>
  );
}

/* 저장한 코스 */
function SavedTravelCard({
  title,
  destinationCount,
  onPress,
}: {
  title: string;
  destinationCount: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.savedTravelCard}
      onPress={onPress}
    >
      <View style={styles.savedTravelInfo}>
        <Text style={styles.savedTravelTitle}>
          {title}
        </Text>

        <Text style={styles.savedTravelPlaces}>
          여행지 {destinationCount}곳
        </Text>
      </View>

      <Text style={styles.editText}>
        상세 보기 →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 100,
  },

  /* 페이지 */
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },

  pageDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#777777',
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },

  description: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 14,
  },

  /* 여행지 추천 */
  recommendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recommendHeaderText: {
    flex: 1,
  },

  recommendTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
  },

  recommendDescription: {
    marginTop: 5,
    fontSize: 13,
    color: '#888888',
  },

  openButton: {
    width: 42,
    height: 42,
    marginLeft: 12,
    borderRadius: 21,
    backgroundColor: '#EAF4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  openButtonText: {
    fontSize: 25,
    fontWeight: '300',
    color: '#5EB1BF',
  },

  findTravelContent: {
    marginTop: 18,
  },

  /* 여행 스타일 */
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#EAF4F5',
  },

  tagText: {
    fontSize: 14,
    color: '#4C8F99',
  },

  selectedTag: {
    backgroundColor: '#5EB1BF',
  },

  selectedTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  /* 추천받기 */
  recommendButton: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  recommendIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5EB1BF',
    padding: 14,
    tintColor: '#FFFFFF',
  },

  recommendButtonText: {
    marginTop: 5,
    fontSize: 11,
    color: '#555555',
  },

  /* 추천 결과 */
  recommendResult: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  resultDescription: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
  },

  resetText: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'underline',
  },

  /* 추천 여행지 카드 */
  destinationList: {
    gap: 12,
  },

  destinationCard: {
    width: 170,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  destinationImage: {
    height: 100,
    borderRadius: 10,
    backgroundColor: '#E8F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageText: {
    fontSize: 13,
    color: '#9AAEB2',
  },

  destinationName: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  destinationDescription: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: '#777777',
  },

  addDestinationButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#5EB1BF',
    alignItems: 'center',
  },

  addDestinationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* 내 코스 */
  inputLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444444',
  },

  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    fontSize: 14,
    color: '#222222',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateBox: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    justifyContent: 'center',
  },

  dateText: {
    fontSize: 14,
    color: '#444444',
  },

  dateSeparator: {
    marginHorizontal: 10,
    color: '#777777',
  },

  placeList: {
    gap: 8,
  },

  placeItem: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
  },

  placeNumber: {
    width: 25,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5EB1BF',
  },

  placeName: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },

  dragIcon: {
    fontSize: 16,
    color: '#AAAAAA',
  },

  addPlaceButton: {
    height: 48,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#5EB1BF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addPlaceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5EB1BF',
  },

  saveButton: {
    height: 52,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#5EB1BF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* 내 여행 */
  savedTravelCard: {
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  savedTravelInfo: {
    flex: 1,
  },

  savedTravelTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  savedTravelDate: {
    marginTop: 5,
    fontSize: 13,
    color: '#777777',
  },

  savedTravelPlaces: {
    marginTop: 8,
    fontSize: 13,
    color: '#555555',
  },

  editText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#5EB1BF',
  },
});