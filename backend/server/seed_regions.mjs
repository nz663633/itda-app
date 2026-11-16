// seed_regions.mjs
// 실행: node --env-file=.env seed_regions.mjs --dry   (저장 없이 확인)
//       node --env-file=.env seed_regions.mjs
import { createClient } from "@supabase/supabase-js";

const BASE = "https://apis.data.go.kr/B551011/KorService2/ldongCode2";
const KEY = process.env.TOUR_API_KEY;
const DRY_RUN = process.argv.includes("--dry");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(params) {
  const qs = new URLSearchParams({
    serviceKey: KEY,
    MobileOS: "ETC",
    MobileApp: "app",
    _type: "json",
    numOfRows: "1000",
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
  const items = json.response.body?.items;
  return !items || items === "" ? [] : [].concat(items.item);
}

async function main() {
  if (!KEY) throw new Error("TOUR_API_KEY가 없습니다.");

  // 1) 시도
  const sidos = await call({});
  const regionRows = sidos.map((s) => ({
    region_name: s.name,       // API 이름 그대로
    ldong_regn_cd: s.code,
  }));
  console.log(`시도 ${regionRows.length}개`);

  let regionIdByCode = new Map();
  if (!DRY_RUN) {
    const { error } = await supabase
      .from("region")
      .upsert(regionRows, { onConflict: "ldong_regn_cd" });
    if (error) throw new Error(`region upsert 실패: ${error.message}`);

    const { data, error: e2 } = await supabase
      .from("region")
      .select("region_id, ldong_regn_cd");
    if (e2) throw new Error(`region 조회 실패: ${e2.message}`);
    regionIdByCode = new Map(data.map((r) => [r.ldong_regn_cd, r.region_id]));
  }

  // 2) 시도별 시군구
  let total = 0;
  for (const r of regionRows) {
    let gus = [];
    try {
      gus = await call({ lDongRegnCd: r.ldong_regn_cd });
    } catch (e) {
      console.log(`${r.region_name} (${r.ldong_regn_cd}): 조회 실패 → ${e.message}`);
      continue;
    }
    await sleep(200);

    if (gus.length === 0) {
      console.log(`${r.region_name} (${r.ldong_regn_cd}): 시군구 0건 ⚠ 확인 필요`);
      continue;
    }

    if (!DRY_RUN) {
      const rows = gus.map((g) => ({
        region_id: regionIdByCode.get(r.ldong_regn_cd),
        sigungu_name: g.name,
        ldong_signgu_cd: g.code,
      }));
      const { error } = await supabase
        .from("sigungu")
        .upsert(rows, { onConflict: "region_id,ldong_signgu_cd" });
      if (error) throw new Error(`sigungu upsert 실패(${r.region_name}): ${error.message}`);
    }
    total += gus.length;
    console.log(`${r.region_name} (${r.ldong_regn_cd}): 시군구 ${gus.length}개`);
  }
  console.log(`\n완료: 시도 ${regionRows.length}개, 시군구 ${total}개 ${DRY_RUN ? "(저장 안 함)" : "저장"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});