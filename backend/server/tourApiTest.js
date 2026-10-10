// 관광공사 API를 호출 테스트
import 'dotenv/config';

// areaBasedList2 호출 함수 (지역 기반 관광정보 조회 API)
const callAreaBasedList2 = async () => {
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

    // 요청 파라미터를 URL 쿼리 문자열로 변환
    const searchParams = new URLSearchParams(params);
    const requestUrl = `${url}?${searchParams}`;

    const response = await fetch(requestUrl);
    const data = await response.json();

    return data;
}

// detailCommon2 호출 함수 (관광지 상세정보 조회 API)
// areaBasedList2 함수에서 contentid를 전달받아
// 해당 관광지의 상세 설명(overview)을 반환
const callDetailCommon2 = async (contentid) => {
    const url = 'https://apis.data.go.kr/B551011/KorService2/detailCommon2';

    const params = {
        serviceKey: process.env.TOUR_API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'AND', // 안드로이드
        _type: 'json', // json 응답
        contentId: contentid, // 임시값
        numOfRows: 10, // 10개 요청
        pageNo: 1
    }

    // 요청 파라미터를 URL 쿼리 문자열로 변환
    const searchParams = new URLSearchParams(params);
    const requestUrl = `${url}?${searchParams}`;

    const response = await fetch(requestUrl);
    const data = await response.json();

    // 필요한 overview(상세 설명)만 반환
    return data.response.body.items.item[0].overview;
}

// 두 API의 응답을 결합
const apiStart = async () => {
    const data = await callAreaBasedList2();

    // 조회 결과 중 첫 번째 관광지 선택
    const item = data.response.body.items.item[0];

    // 관광지 ID(contentid)로 상세 설명 조회
    const overview = await callDetailCommon2(item.contentid);

    // 기존 관광지 정보에 상세 설명을 추가한 객체 반환
    return { ...item, overview };
}

// 비동기 함수의 실행 결과 출력
apiStart()
    .then(data => console.log(data))
    .catch(error => console.error('API 호출 오류:', error));