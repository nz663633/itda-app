// probe_spot.mjs  (실행: node --env-file=.env probe_spot.mjs)
const BASE = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
const KEY = process.env.TOUR_API_KEY;

async function call(params) {
  const qs = new URLSearchParams({
    serviceKey: KEY,
    MobileOS: "ETC",
    MobileApp: "app",
    _type: "json",
    numOfRows: "3",
    pageNo: "1",
    ...params,
  });
  const res = await fetch(`${BASE}?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const header = json?.response?.header;
  if (header && header.resultCode !== "0000") {
    throw new Error(`API 오류: ${header.resultCode} ${header.resultMsg}`);
  }
  return json.response.body;
}

if (!KEY) throw new Error("TOUR_API_KEY가 없습니다.");

// A) 지역 필터 없이 호출
const a = await call({});
console.log("A) totalCount:", a.totalCount);
console.log("A) 첫 번째 항목:", a.items?.item?.[0]);

// B) 관광지(12)만 호출
const b = await call({ contentTypeId: "12" });
console.log("B) totalCount(관광지):", b.totalCount);
console.log("B) 첫 번째 항목:", b.items?.item?.[0]);