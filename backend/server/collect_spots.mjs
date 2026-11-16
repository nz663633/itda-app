// collect_spots.mjs
// 실행 예:
//   node --env-file=.env collect_spots.mjs --dry --region=50     (제주만, 저장 없이)
//   node --env-file=.env collect_spots.mjs --region=11,26        (서울·부산만 저장)
//   node --env-file=.env collect_spots.mjs                       (전국)
//   node --env-file=.env collect_spots.mjs --skip-done           (이미 저장된 시군구는 건너뜀)
import { createClient } from "@supabase/supabase-js";

const BASE = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
const KEY = process.env.TOUR_API_KEY;
const DRY_RUN = process.argv.includes("--dry");
const SKIP_DONE = process.argv.includes("--skip-done");
const REGION_ARG = process.argv.find((a) => a.startsWith("--region="));
const REGION_FILTER = REGION_ARG ? REGION_ARG.split("=")[1].split(",") : null;
const PAGE_SIZE = 1000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const str = (v) => (v === "" || v == null ? null : v);
const num = (v) => (v === "" || v == null ? null : Number(v));

let apiCalls = 0;

async function call(params, retry = 3) {
  const qs = new URLSearchParams({
    serviceKey: KEY,
    MobileOS: "ETC",
    MobileApp: "app",
    _type: "json",
    numOfRows: String(PAGE_SIZE),
    ...params,
  });
  for (let i = 1; i <= retry; i++) {
    try {
      apiCalls++;
      const res = await fetch(`${BASE}?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const header = json?.response?.header;
      if (header && header.resultCode !== "0000") {
        throw new Error(`API 오류: ${header.resultCode} ${header.resultMsg}`);
      }
      const body = json.response.body;
      const items = body?.items;
      const list = !items || items === "" ? [] : [].concat(items.item);
      return { totalCount: Number(body.totalCount), list };
    } catch (e) {
      // 한도 초과 계열 오류는 재시도해도 소용없으니 바로 중단
      if (/LIMITED|TRAFFIC|QUOTA/i.test(e.message)) throw e;
      if (i === retry) throw e;
      await sleep(1000 * i);
    }
  }
}

async function fetchSigungu(regnCd, signguCd) {
  const all = [];
  let page = 1;
  let total = 0;
  do {
    const r = await call({ lDongRegnCd: regnCd, lDongSignguCd: signguCd, pageNo: String(page) });
    total = r.totalCount;
    if (r.list.length === 0) break;
    all.push(...r.list);
    page++;
    await sleep(200);
  } while (all.length < total);
  return { total, items: all };
}

function toRow(it, sigunguId) {
  return {
    tour_api_id: Number(it.contentid),
    destination_name: it.title,
    address: [it.addr1, it.addr2].filter(Boolean).join(" ") || null,
    latitude: num(it.mapy),   // mapy = 위도
    longitude: num(it.mapx),  // mapx = 경도
    image_url: str(it.firstimage)?.replace(/^http:\/\//, "https://") ?? null,
    sigungu_id: sigunguId,
    content_type_id: num(it.contenttypeid),
    lcls_systm1: str(it.lclsSystm1),
    lcls_systm2: str(it.lclsSystm2),
    lcls_systm3: str(it.lclsSystm3),
    // description은 일부러 뺌: 나중에 채워도 덮어쓰지 않게
  };
}

async function upsertRows(rows) {
  const unique = [...new Map(rows.map((r) => [r.tour_api_id, r])).values()];
  for (let i = 0; i < unique.length; i += 500) {
    const chunk = unique.slice(i, i + 500);
    const { error } = await supabase
      .from("destination")
      .upsert(chunk, { onConflict: "tour_api_id" });
    if (error) throw new Error(`upsert 실패: ${error.message}`);
  }
  return unique.length;
}

async function main() {
  if (!KEY) throw new Error("TOUR_API_KEY가 없습니다.");

  const { data: all, error } = await supabase
    .from("sigungu")
    .select("sigungu_id, sigungu_name, ldong_signgu_cd, region(region_name, ldong_regn_cd)")
    .order("sigungu_id");
  if (error) throw new Error(`sigungu 조회 실패: ${error.message}`);

  let sigungus = REGION_FILTER
    ? all.filter((s) => REGION_FILTER.includes(s.region.ldong_regn_cd))
    : all;

  // 이미 스팟이 저장된 시군구 건너뛰기 (재개용)
  if (SKIP_DONE) {
    const done = new Set();
    let from = 0;
    while (true) {
      const { data, error: e } = await supabase
        .from("destination")
        .select("sigungu_id")
        .range(from, from + 999);
      if (e) throw new Error(`진행 상황 조회 실패: ${e.message}`);
      data.forEach((d) => done.add(d.sigungu_id));
      if (data.length < 1000) break;
      from += 1000;
    }
    const before = sigungus.length;
    sigungus = sigungus.filter((s) => !done.has(s.sigungu_id));
    console.log(`이미 저장된 시군구 ${before - sigungus.length}개 건너뜀`);
  }

  console.log(`시군구 ${sigungus.length}개 수집 시작 ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

  let grand = 0;
  const failed = [];
  const mismatched = [];
  for (const [idx, s] of sigungus.entries()) {
    const regnCd = s.region.ldong_regn_cd;
    const label = `${s.region.region_name} ${s.sigungu_name} (${regnCd}/${s.ldong_signgu_cd})`;
    try {
      const { total, items } = await fetchSigungu(regnCd, s.ldong_signgu_cd);
      const rows = items.map((it) => toRow(it, s.sigungu_id));
      const saved = DRY_RUN ? rows.length : await upsertRows(rows);
      grand += saved;
      let note = "";
      if (items.length !== total) {
        note = `  ⚠ totalCount(${total})와 받은 수(${items.length})가 다름`;
        mismatched.push(label);
      }
      if (total === 0) note += "  ⚠ 0건";
      console.log(`[${idx + 1}/${sigungus.length}] ${label}: ${total}건 → ${saved}건${note}`);
    } catch (e) {
      failed.push(label);
      console.log(`[${idx + 1}/${sigungus.length}] ${label}: 실패 → ${e.message}`);
      if (/LIMITED|TRAFFIC|QUOTA/i.test(e.message)) {
        console.log("\n일일 호출 한도에 걸린 것 같아요. 내일 --skip-done 으로 이어서 실행하세요.");
        break;
      }
    }
  }

  console.log(`\n완료: 총 ${grand}건 ${DRY_RUN ? "(저장 안 함)" : "저장"}, API 호출 ${apiCalls}번`);
  if (mismatched.length) console.log(`건수 불일치 ${mismatched.length}곳:`, mismatched);
  if (failed.length) console.log(`실패 ${failed.length}곳 (--skip-done 으로 다시 실행하면 이어서 받아요):`, failed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});