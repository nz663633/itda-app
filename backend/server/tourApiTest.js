// 관광공사 API를 호출 테스트
import 'dotenv/config';

const url = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';

const params = {
    serviceKey: process.env.TOUR_API_KEY,
    numOfRows: 10, // 10개 요청
    pageNo: 1,
    MobileOS: 'ETC',
    MobileApp: 'AND', // 안드로이드
    _type: 'json', // json 응답
    arrange: 'C', // 수정일순 정렬
    contentTypeId: 12, // 관광지
    lDongRegnCd: 11, // 법정동 시도 코드
    lDongSignguCd: 170 // 법정동 시군구 코드
};

// 쿼리 문자열 생성(URL에 사용할 수 있는 형태로 변환)
const searchParams = new URLSearchParams(params);

// 최종 URL
const requestUrl = `${url}?${searchParams}`;

const response = await fetch(requestUrl);

const data = await response.json();

console.log(console.dir(data, { depth: null }));