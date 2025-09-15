// 주간 식후혈당 데이터를 localStorage(glucoseLogs)에서 읽어와 Recharts용으로 가공
// 스키마(권장):
// {
//   "YYYY-MM-DD": {
//     // 선택: fasting(공복)
//     breakfastPost: 130, // 아침 식후(2시간)
//     lunchPost: 145,     // 점심 식후(2시간)
//     dinnerPost: 138     // 저녁 식후(2시간)
//   }
// }
//
// 하위호환:
//  - 기존 morning/lunch/dinner 가 있으면 이를 breakfastPost/lunchPost/dinnerPost 로 간주

import { useMemo } from "react";

function readLogs() {
  try {
    const raw = localStorage.getItem("glucoseLogs");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getKoreanWeekday(dateObj) {
  // 0(일)~6(토)
  const wd = dateObj.getDay();
  return ["일", "월", "화", "수", "목", "금", "토"][wd];
}

function addDays(d, offset) {
  const x = new Date(d);
  x.setDate(x.getDate() + offset);
  return x;
}

function formatDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function useWeeklyGlucoseData({ days = 7 } = {}) {
  return useMemo(() => {
    const logs = readLogs();

    // 오늘을 기준으로 과거 n일 (오래된 날 → 오늘 순서)
    const today = new Date();
    const theDays = Array.from({ length: days }).map((_, i) =>
      addDays(today, -(days - 1 - i))
    );

    const rows = theDays.map((d) => {
      const key = formatDate(d);
      const rec = logs[key] || {};

      // 하위호환 매핑 (이전 morning/lunch/dinner → 식후 키로 간주)
      const breakfastPost =
        typeof rec.breakfastPost === "number"
          ? rec.breakfastPost
          : typeof rec.morning === "number"
          ? rec.morning
          : null;

      const lunchPost =
        typeof rec.lunchPost === "number"
          ? rec.lunchPost
          : typeof rec.lunch === "number"
          ? rec.lunch
          : null;

      const dinnerPost =
        typeof rec.dinnerPost === "number"
          ? rec.dinnerPost
          : typeof rec.dinner === "number"
          ? rec.dinner
          : null;

      return {
        date: key,
        day: getKoreanWeekday(d),
        breakfastPost,
        lunchPost,
        dinnerPost,
        // 필요하면 공복도 함께 노출 가능
        fasting: typeof rec.fasting === "number" ? rec.fasting : null,
      };
    });

    return rows;
  }, [days]);
}
