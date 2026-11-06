//홈 화면.
import AppTabs from '@/components/app-tabs';
import { Text, View, Image, Pressable, ScrollView, StyleSheet, Animated, PanResponder, Modal, TextInput} from 'react-native';
import {useRef, useState} from 'react';
import KakaoMap, { KakaoMapHandle, Place } from '@/components/kakao-map';

export default function HomeScreen() {
  {/* 지도 드래그 설정 */}
const mapHeight = useRef(new Animated.Value(90)).current;
const mapRef = useRef<KakaoMapHandle>(null);
const [searchVisible, setSearchVisible] = useState(false);
const [keyword, setKeyword] = useState('');
const [results, setResults] = useState<Place[]>([]);
const handleSearch = () => {
  if (!keyword.trim()) return;
  mapRef.current?.searchPlace(keyword);
};
const handleSelect = (place: Place) => {
  mapRef.current?.addMarker(place);
  setSearchVisible(false);
  setKeyword('');
  setResults([]);
  // 지도 영역 펼치기
  Animated.spring(mapHeight, { toValue: 700, useNativeDriver: false }).start();
};
const panResponder = PanResponder.create({  //panResponder : 사용자 터치, 드래그 동작 감지
  onMoveShouldSetPanResponder: (_, gesture) => {
    return Math.abs(gesture.dy) > 5;
  },

  onPanResponderMove: (_, gesture) => {
    const newHeight = 90 - gesture.dy;

    if (newHeight >= 90 && newHeight <= 700) { //지도 부분 최대높이 700
      mapHeight.setValue(newHeight);
    }
  },

  onPanResponderRelease: (_, gesture) => {
    const targetHeight =
      gesture.dy < -100 ? 700 : 90;

    Animated.spring(mapHeight, {
      toValue: targetHeight,
      useNativeDriver: false,
    }).start();
  },
});

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subTitle}>안녕하세요</Text>
          <Text style={styles.title}>다지지님.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진행중인 여행</Text>

          <View style={styles.travelCard}>
            <View>
              <Text style={styles.travelName}>다지지 우정 여행</Text>
              <Text style={styles.travelDate}>2026. 07. 09 ~ 2026. 08. 04</Text>
            </View>

            <View style={styles.userInfo}>
              <Image
                source={require('../../assets/images/sample.jpg')}
                style={styles.profileImage}
              />
              <Text style={styles.nickname}>다지지</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘의 코스</Text>
            <Text style={styles.moreText}>전체보기 ›</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.courseList}
          >
            <View style={styles.courseCard}>
              <View style={styles.courseImage}>
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>인하공업전문대</Text>
                <Text style={styles.courseLocation}>인천 연수구</Text>
              </View>
            </View>

            <View style={styles.courseCard}>
              <View style={styles.courseImage}>
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>알촌</Text>
                <Text style={styles.courseLocation}>인천 연수구</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추억 돌아보기</Text>
            <Text style={styles.moreText}>전체보기 ›</Text>
          </View>

          <View style={styles.memoryCard}>
            <View style={styles.memoryImage}>
            </View>

            <View style={styles.memoryInfo}>
              <Text style={styles.memoryLocation}>부산</Text>

              <View style={styles.memoryBottom}>
                <Text style={styles.memoryName}>할머니 칠순녀행!!</Text>
                <Text style={styles.memoryDate}>2026.09.20</Text>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>

        <Animated.View style={[styles.mapSection, { height: mapHeight}]}>
            <KakaoMap ref={mapRef} onSearchResult={setResults}/>

            <View style={styles.mapOverlay}>
              <View style={styles.mapHandle} {...panResponder.panHandlers}>
                <View style={styles.handle} />
              </View>
              
              <Text style={styles.mapTitle}>내 여행 지도</Text>
              <Text style={styles.mapSubTitle}>
              위로 올려 여행 기록을 확인해보세요
              </Text>
             </View>

            <Pressable
              style={styles.addMarkerButton}
              onPress={() => {
                    setSearchVisible(true)
              }}
            >
                <Text style={styles.addMarkerText}>+</Text>
            </Pressable>
        </Animated.View>
      
      <Modal visible={searchVisible} animationType="slide" onRequestClose={() => setSearchVisible(false)}>
  <View style={styles.searchContainer}>
    <View style={styles.searchHeader}>
      <TextInput
        style={styles.searchInput}
        placeholder="다녀온 장소를 검색해보세요"
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoFocus
      />
      <Pressable onPress={() => setSearchVisible(false)}>
        <Text style={styles.searchClose}>닫기</Text>
      </Pressable>
    </View>

    <ScrollView keyboardShouldPersistTaps="handled">
      {results.map((place) => (
        <Pressable key={place.id} style={styles.resultItem} onPress={() => handleSelect(place)}>
          <Text style={styles.resultName}>{place.name}</Text>
          <Text style={styles.resultAddress}>{place.address}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
</Modal>
      
      <AppTabs />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingTop: 85,
    paddingHorizontal: 24,
    paddingBottom: 110,
  },

  /* 상단 */
  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 14,
    color: '#888888',
  },

  /* 공통 섹션 */
  section: {
    marginBottom: 32,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 14,
  },

  moreText: {
    fontSize: 13,
    color: '#999999',
  },

  /* 진행중인 여행 */
  travelCard: {
    width: 243,
    height: 172,
    borderRadius: 18,
    backgroundColor: '#F4FAFB',
    padding: 20,
    justifyContent: 'space-between',
  },

  travelName: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },

  travelDate: {
    fontSize: 13,
    color: '#777777',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 9,
  },

  nickname: {
    fontSize: 14,
    color: '#555555',
  },

  /* 오늘의 코스 */
  courseList: {
    gap: 12,
  },

  courseCard: {
    width: 180,
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
  },

  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#DCEFF2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  courseInfo: {
    padding: 12,
  },

  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },

  courseLocation: {
    fontSize: 12,
    color: '#999999',
  },

  /* 추억 돌아보기 */
  memoryCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
  },

  memoryImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#DCEFF2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  memoryInfo: {
    padding: 16,
    paddingTop: 14,
  },

  memoryLocation: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 10,
  },

  memoryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  memoryName: {
    flex: 1,
    fontSize: 13,
    color: '#777777',
  },

  memoryDate: {
    fontSize: 12,
    color: '#999999',
  },

  /* 여행 지도 */
  mapSection: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 70,
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: -3,
  },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 5,
  },

  mapHandle: {
  height: 35,
  justifyContent: 'center',
  alignItems: 'center',
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CCCCCC',
    marginBottom: 18,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },

  mapSubTitle: {
    fontSize: 12,
    color: '#999999',
  },
mapOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
},
/*마커 추가 버튼 */
addMarkerButton: {
  position: 'absolute',
  right: 20,
  bottom: 20,

  width: 52,
  height: 52,
  borderRadius: 26,

  backgroundColor: '#FFFFFF',

  justifyContent: 'center',
  alignItems: 'center',

  elevation: 5,

  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 5,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

addMarkerText: {
  fontSize: 30,
  fontWeight: '300',
  color: '#208AEF',
  lineHeight: 32,
},
searchContainer: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
searchInput: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#f2f2f2', paddingHorizontal: 14, fontSize: 16 },
searchClose: { fontSize: 16, color: '#555' },
resultItem: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
resultName: { fontSize: 16, fontWeight: '600' },
resultAddress: { fontSize: 13, color: '#888', marginTop: 2 }
});

