// fetch_lcls.mjs  (실행: node --env-file=.env fetch_lcls.mjs)
import { writeFileSync } from "node:fs";

const BASE = "https://apis.data.go.kr/B551011/KorService2/lclsSystmCode2";
const KEY = process.env.TOUR_API_KEY;

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
  const items = json?.response?.body?.items;
  if (!items || items === "") return [];
  return Array.isArray(items.item) ? items.item : [items.item];
}

function toCsv(rows, keys) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [keys.map(esc).join(",")];
  for (const r of rows) lines.push(keys.map((k) => esc(r[k])).join(","));
  return "\ufeff" + lines.join("\n"); // 엑셀 한글 깨짐 방지(BOM)
}

async function main() {
  if (!KEY) throw new Error("환경변수 TOUR_API_KEY를 설정하세요.");

  const all = []; // lcls_code 테이블 형태: { lcls_code, lcls_level, lcls_name, parent_code }

  // 1) 대분류
  const level1 = await call({});
  for (const it of level1) {
    all.push({ lcls_code: it.code, lcls_level: 1, lcls_name: it.name, parent_code: "" });
  }
  console.log(`대분류 ${level1.length}건`);

  // 2) 중분류: 대분류 코드를 lclsSystm1에 넣어 호출
  const level2 = [];
  for (const l1 of level1) {
    const items = await call({ lclsSystm1: l1.code });
    for (const it of items) {
      level2.push({ ...it, parent: l1.code });
      all.push({ lcls_code: it.code, lcls_level: 2, lcls_name: it.name, parent_code: l1.code });
    }
    await sleep(200);
  }
  console.log(`중분류 ${level2.length}건`);

  // 3) 소분류: 대분류 + 중분류 코드를 함께 넣어 호출
  const level3 = [];
  for (const l2 of level2) {
    const items = await call({ lclsSystm1: l2.parent, lclsSystm2: l2.code });
    for (const it of items) {
      level3.push({ ...it, parent: l2.code });
      all.push({ lcls_code: it.code, lcls_level: 3, lcls_name: it.name, parent_code: l2.code });
    }
    await sleep(200);
  }
  console.log(`소분류 ${level3.length}건`);
  console.log("소분류 응답 샘플:", level3[0]);

  // 4) 중복 코드 점검 (lcls_code 기본키 확인용)
  const seen = new Map();
  const dups = [];
  for (const r of all) {
    if (seen.has(r.lcls_code)) dups.push(r.lcls_code);
    seen.set(r.lcls_code, true);
  }
  console.log(dups.length ? `중복 코드 ${dups.length}건: ${dups.slice(0, 10)}` : "중복 코드 없음");

  // 5) 저장
  writeFileSync(
    "lcls_code.csv",
    toCsv(all, ["lcls_code", "lcls_level", "lcls_name", "parent_code"])
  );
  console.log(`lcls_code.csv 저장 완료 (총 ${all.length}건)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});