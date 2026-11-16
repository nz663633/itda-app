//트래블 보드 화면.
import AppTabs from '@/components/app-tabs';
import { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import {
  getBoards,
  getBoardDetail,
  updateBoard,
  deleteBoard,
  type Board,
  type BoardDetail,
} from '@/api/board';

export default function BoardScreen() {

  // 선택한 여행

  const [selectedTravel, setSelectedTravel] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('이미지');

  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContext, setBoardContext] = useState('');
  const [visitedAt, setVisitedAt] = useState('');

  // 내 보드 목록 불러오기
  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error('보드 목록 조회 실패:', error);
      Alert.alert('오류', '보드 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 화면 진입 시 보드 목록 조회
  useEffect(() => {
    loadBoards();
  }, []);

  // 보드 상세 조회
  const handleBoardDetail = async (boardId: number) => {
    try {
      const data = await getBoardDetail(boardId);

      setSelectedBoard(data);
      setSelectedTravel(boardId);
      setBoardTitle(data.board_title);
      setBoardContext(data.board_context ?? '');
      setVisitedAt(data.visited_at);
      setActiveTab('이미지');
      setEditing(false);
    } catch (error) {
      console.error('보드 상세 조회 실패:', error);
      Alert.alert('오류', '보드 상세 정보를 불러오지 못했습니다.');
    }
  };

  // 보드 수정
  const handleUpdateBoard = async () => {
    if (!selectedTravel) return;

    try {
      await updateBoard(selectedTravel, {
        board_title: boardTitle,
        board_context: boardContext,
        visited_at: visitedAt,
      });

      const updatedBoard = await getBoardDetail(selectedTravel);
      setSelectedBoard(updatedBoard);
      setEditing(false);
      await loadBoards();

      Alert.alert('완료', '보드가 수정되었습니다.');
    } catch (error) {
      console.error('보드 수정 실패:', error);
      Alert.alert('오류', '보드 수정에 실패했습니다.');
    }
  };

  // 보드 삭제
  const handleDeleteBoard = () => {
    if (!selectedTravel) return;

    Alert.alert('보드 삭제', '이 보드를 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBoard(selectedTravel);
            setSelectedTravel(null);
            setSelectedBoard(null);
            await loadBoards();
            Alert.alert('완료', '보드가 삭제되었습니다.');
          } catch (error) {
            console.error('보드 삭제 실패:', error);
            Alert.alert('오류', '보드 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };


  // 여행 상세 화면
  if (selectedTravel !== null && selectedBoard !== null) {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* 뒤로가기 */}
          <Pressable
            style={styles.backButton}
            onPress={() => setSelectedTravel(null)}
          >
            <Text style={styles.backText}>‹</Text>
            <Text style={styles.backLabel}>트래블보드</Text>
          </Pressable>

          {/* 여행 정보 */}
          <Text style={styles.title}>{selectedBoard?.board_title}</Text>
          <Text style={styles.date}>{selectedBoard?.visited_at}</Text>
          <Text style={styles.places}>{selectedBoard?.places.map((place) => place.destination_name).join(' . ')}</Text>


          {editing ? (
            <>
              <TextInput
                style={styles.expenseInput}
                value={boardTitle}
                onChangeText={setBoardTitle}
                placeholder="보드 제목"
              />
              <TextInput
                style={styles.memoInput}
                value={boardContext}
                onChangeText={setBoardContext}
                placeholder="여행 메모"
                multiline
              />
              <TextInput
                style={styles.expenseInput}
                value={visitedAt}
                onChangeText={setVisitedAt}
                placeholder="방문일 (YYYY-MM-DD)"
              />
              <Pressable style={styles.saveButton} onPress={handleUpdateBoard}>
                <Text style={styles.saveButtonText}>수정 저장</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                {selectedBoard?.board_context || '작성된 메모가 없습니다.'}
              </Text>
              <Pressable
                style={styles.saveButton}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.saveButtonText}>보드 수정</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, { backgroundColor: '#D66A6A' }]}
                onPress={handleDeleteBoard}
              >
                <Text style={styles.saveButtonText}>보드 삭제</Text>
              </Pressable>
            </>
          )}


          {/* 탭바 */}
          <View style={styles.tabBar}>
            {['이미지', '메모', '가계부'].map((tab) => (
              <Pressable
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 사진 기록 */}
          {activeTab === '이미지' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>여행 사진</Text>
              <Text style={styles.description}>
                여행에서 찍은 사진을 저장해보세요.
              </Text>

              <View style={styles.imageGrid}>
                <Pressable style={styles.addImage}>
                  <Text style={styles.plus}>+</Text>
                  <Text style={styles.addText}>이미지 추가</Text>
                </Pressable>

                <View style={styles.emptyImage} />
              </View>
            </View>
          )}

          {/* 메모 */}
          {activeTab === '메모' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>여행 기록</Text>
              <Text style={styles.description}>
                여행에서 있었던 일을 기록해보세요.
              </Text>

              <TextInput
                style={styles.memoInput}
                placeholder="메모를 작성해보세요."
                placeholderTextColor="#AAAAAA"
                multiline
                textAlignVertical="top"
              />

              <Pressable style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  메모 저장
                </Text>
              </Pressable>
            </View>
          )}

          {/* 가계부 */}
          {activeTab === '가계부' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>여행 가계부</Text>
              <Text style={styles.description}>
                여행 중 사용한 금액을 기록해보세요.
              </Text>

              <View style={styles.expenseBox}>
                <Text style={styles.expenseLabel}>항목</Text>
                <TextInput
                  style={styles.expenseInput}
                  placeholder="예: 식비"
                  placeholderTextColor="#AAAAAA"
                />

                <Text style={styles.expenseLabel}>금액</Text>
                <TextInput
                  style={styles.expenseInput}
                  placeholder="금액을 입력하세요."
                  placeholderTextColor="#AAAAAA"
                  keyboardType="number-pad"
                />
              </View>

              <Pressable style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  지출 추가
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        <AppTabs />
      </View>
    );
  }

  // 기본 트래블보드 화면
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>트래블보드</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 여행</Text>


          {loading ? (
            <Text>보드 목록을 불러오는 중...</Text>
          ) : boards.length === 0 ? (
            <Text style={styles.description}>
              아직 등록된 여행 보드가 없습니다.
            </Text>
          ) : (
            boards.map((board) => (
              <Pressable
                key={board.board_id}
                style={styles.travelCard}
                onPress={() => handleBoardDetail(board.board_id)}
              >
                <View style={styles.travelInfo}>
                  <Text style={styles.travelTitle}>
                    {board.board_title}
                  </Text>

                  <Text style={styles.travelDate}>
                    {board.visited_at}
                  </Text>

                  <Text style={styles.travelPlaces}>
                    {board.places
                      .map((place) => place.destination_name)
                      .join(' · ')}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))
          )}


        </View>
      </ScrollView>

      <AppTabs />
    </View>
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

  /* 기본 화면 */

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },

  travelCard: {
    minHeight: 120,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    backgroundColor: '#e8f3f5',
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E8F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholder: {
    fontSize: 12,
    color: '#9AAEB2',
  },

  travelInfo: {
    flex: 1,
  },

  travelTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  travelDate: {
    marginTop: 6,
    fontSize: 12,
    color: '#777777',
  },

  travelPlaces: {
    marginTop: 7,
    fontSize: 12,
    color: '#555555',
  },

  arrow: {
    marginLeft: 8,
    fontSize: 25,
    color: '#AAAAAA',
  },

  /* 상세 화면 */

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backText: {
    fontSize: 32,
    color: '#555555',
    marginRight: 5,
  },

  backLabel: {
    fontSize: 14,
    color: '#666666',
  },

  date: {
    marginTop: 6,
    fontSize: 13,
    color: '#777777',
  },

  places: {
    marginTop: 5,
    fontSize: 13,
    color: '#555555',
  },

  /* 탭바 */

  tabBar: {
    height: 52,
    marginTop: 28,
    padding: 5,
    borderRadius: 26,
    backgroundColor: '#EAF4F5',
    flexDirection: 'row',
  },

  tab: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#5EB1BF',
  },

  tabText: {
    fontSize: 13,
    color: '#5B8F96',
  },

  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  /* 탭 내용 */

  tabContent: {
    marginTop: 30,
  },

  description: {
    marginTop: -4,
    marginBottom: 18,
    fontSize: 13,
    color: '#888888',
  },

  /* 이미지 */

  imageGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  addImage: {
    width: 150,
    height: 150,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plus: {
    fontSize: 30,
    fontWeight: '300',
    color: '#5EB1BF',
  },

  addText: {
    marginTop: 5,
    fontSize: 12,
    color: '#777777',
  },

  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 14,
    backgroundColor: '#F4F8F8',
  },

  /* 메모 */

  memoInput: {
    height: 180,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },

  /* 가계부 */

  expenseBox: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F7FAFA',
  },

  expenseLabel: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555555',
  },

  expenseInput: {
    height: 45,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    fontSize: 13,
  },

  /* 버튼 */

  saveButton: {
    height: 48,
    marginTop: 14,
    borderRadius: 10,
    backgroundColor: '#5EB1BF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});