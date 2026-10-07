//홈 화면.
import AppTabs from '@/components/app-tabs';
import { Text, View, Image, Pressable, ScrollView, StyleSheet, Animated, PanResponder, } from 'react-native';
import {useRef} from 'react';

export default function HomeScreen() {
  {/* 지도 드래그 설정 */}
const mapHeight = useRef(new Animated.Value(90)).current;
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
          <View style={styles.mapHandle}
          {...panResponder.panHandlers}>
            <View style={styles.handle} /></View>
            <Text style={styles.mapTitle}>내 여행 지도</Text>
            <Text style={styles.mapSubTitle}>
              위로 올려 여행 기록을 확인해보세요
            </Text>
      
        </Animated.View>
      

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
});