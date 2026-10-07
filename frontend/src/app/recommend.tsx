// 여행 코스 화면.
import AppTabs from '@/components/app-tabs';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function RecommendScreen() {
  // 여행지 추천 영역 열기/닫기
  const [showTravelFinder, setShowTravelFinder] = useState(false);

  // 추천 결과 표시
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 선택한 여행 스타일
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // 내 코스에 담긴 여행지
  const [selectedPlaces, setSelectedPlaces] = useState([
    '문학경기장',
    '포케품은초밥',
    '영종도',
  ]);

  const destinations = [
    {
      name: '속초',
      description: '바다에서 포켓몬고',
    },
    {
      name: '인천',
      description: '도시와 바다를 함께',
    },
    {
      name: '여수',
      description: '여수 밤바다',
    },
  ];

  const travelStyles = [
    '자연',
    '바다',
    '도시',
    '맛집',
    '혼자',
    '친구',
    '연인',
    '가족',
  ];

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((item) => item !== style)
        : [...prev, style]
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
                {travelStyles.map((style) => (
                  <Pressable
                    key={style}
                    style={[
                      styles.tag,
                      selectedStyles.includes(style) &&
                        styles.selectedTag,
                    ]}
                    onPress={() => toggleStyle(style)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedStyles.includes(style) &&
                          styles.selectedTagText,
                      ]}
                    >
                      {style}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* 추천받기 */}
              <Pressable
                style={styles.recommendButton}
                onPress={() => setShowRecommendations(true)}
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
                    {destinations.map((destination) => (
                      <DestinationCard
                        key={destination.name}
                        name={destination.name}
                        description={destination.description}
                        onAdd={() =>
                          addPlace(destination.name)
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>

        {/* 내 코스 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            내 코스
          </Text>

          {/* 여행 이름 */}
          <Text style={styles.inputLabel}>
            여행 이름
          </Text>

          <TextInput
            style={styles.input}
            placeholder="여행 이름을 입력해주세요."
            placeholderTextColor="#AAAAAA"
          />

          {/* 여행 날짜 */}
          <Text style={styles.inputLabel}>
            여행 날짜
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                10/02
              </Text>
            </View>

            <Text style={styles.dateSeparator}>
              ~
            </Text>

            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                10/04
              </Text>
            </View>
          </View>

          {/* 선택한 여행지 */}
          <Text style={styles.inputLabel}>
            선택한 여행지 {selectedPlaces.length}곳
          </Text>

          <View style={styles.placeList}>
            {selectedPlaces.map((place, index) => (
              <PlaceItem
                key={place}
                number={index + 1}
                name={place}
              />
            ))}
          </View>

          {/* 여행지 추가 */}
          <Pressable style={styles.addPlaceButton}>
            <Text style={styles.addPlaceText}>
              ＋ 여행지 추가하기
            </Text>
          </Pressable>

          {/* 코스 저장 */}
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              코스 저장하기
            </Text>
          </Pressable>
        </View>

        {/* 내 여행 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            내 여행
          </Text>

          <Text style={styles.description}>
            저장한 여행을 확인하고 수정할 수 있어요.
          </Text>

          <SavedTravelCard
            title="부산 커플 여행"
            date="10/09 ~ 10/14"
            places="해운대 · 광안리 · 서면카페거리"
          />

          <SavedTravelCard
            title="대전 빵투어"
            date="10/15 ~ 10/16"
            places="성심당 · 우동야"
          />
        </View>
      </ScrollView>

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
}: {
  name: string;
  description: string;
  onAdd: () => void;
}) {
  return (
    <View style={styles.destinationCard}>
      <View style={styles.destinationImage}>
        <Text style={styles.imageText}>사진</Text>
      </View>

      <Text style={styles.destinationName}>{name}</Text>

      <Text style={styles.destinationDescription}>
        {description}
      </Text>

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

/* 저장한 여행 */
function SavedTravelCard({
  title,
  date,
  places,
}: {
  title: string;
  date: string;
  places: string;
}) {
  return (
    <View style={styles.savedTravelCard}>
      <View style={styles.savedTravelInfo}>
        <Text style={styles.savedTravelTitle}>
          {title}
        </Text>

        <Text style={styles.savedTravelDate}>
          {date}
        </Text>

        <Text style={styles.savedTravelPlaces}>
          {places}
        </Text>
      </View>

      <Pressable>
        <Text style={styles.editText}>수정 →</Text>
      </Pressable>
    </View>
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