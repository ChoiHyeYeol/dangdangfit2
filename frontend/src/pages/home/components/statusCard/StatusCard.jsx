import React, { useEffect, useMemo, useState } from "react";
import FastingGauge from "./FastingGauge";
import "./statuscard.css";

// react-icons 불러오기
import { FaTint, FaHospitalAlt } from "react-icons/fa";

/* ---- 슬롯 메타 ---- */
const SLOT_META = {
  fasting: { short: "공복", label: "공복 혈당" },
  breakfastPost: { short: "아침", label: "아침 식후 혈당" },
  lunchPost: { short: "점심", label: "점심 식후 혈당" },
  dinnerPost: { short: "저녁", label: "저녁 식후 혈당" },
};

function getCurrentSlot() {
  const h = new Date().getHours();
  if (h >= 0 && h < 8) return "fasting";
  if (h >= 8 && h < 11) return "breakfastPost";
  if (h >= 11 && h < 16) return "lunchPost";
  if (h >= 16 && h < 24) return "dinnerPost";
  return "fasting";
}
// ✅ 혈당 값에 따른 색상
function getGlucoseColor(value, slot) {
  if (value == null || isNaN(value)) return "#9ca3af";

  if (slot === "fasting") {
    if (value >= 126) return "#ef4444"; // 빨강
    if (value >= 100) return "#f59e0b"; // 주황
    return "#16a34a"; // 초록
  } else {
    if (value >= 200) return "#ef4444";
    if (value >= 140) return "#f59e0b";
    return "#16a34a";
  }
}

export default function StatusCard({
  dday,
  glucose,
  onOpenHospital,
  onOpenBlood,
}) {
  const ddayLabel = useMemo(() => {
    if (dday === null || dday === undefined || isNaN(dday)) return null;

    if (dday > 0) {
      return { days: dday, status: "future" }; // 7 → "7일 남았어요!"
    }
    if (dday === 0) {
      return { days: 0, status: "today" }; // 오늘
    }
    return { days: Math.abs(dday), status: "past" }; // 2 → "2일 지났어요!"
  }, [dday]);

  const [displaySlot, setDisplaySlot] = useState(getCurrentSlot());
  useEffect(() => {
    const iv = setInterval(() => setDisplaySlot(getCurrentSlot()), 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const hasGlucose = typeof glucose === "number" && glucose >= 0;
  const slotLabel = SLOT_META[displaySlot]?.label ?? "혈당";

  return (
    <div className="pg-card">
      {/* ✅ 왼쪽: 혈당 */}
      <div className="pg-section">
        <div className="pg-label">
          <FaTint className="pg-icon-inline" />
          {slotLabel}
        </div>

        {hasGlucose ? (
          <div
            className="pg-glucose-value"
            style={{ color: getGlucoseColor(glucose, displaySlot) }}
            onClick={onOpenBlood}
          >
            {glucose}
            <span className="pg-unit">mg/dL</span>
          </div>
        ) : (
          <button type="button" className="pg-empty" onClick={onOpenBlood}>
            <span className="plus">＋</span> {slotLabel}을 입력할 시간이에요!
          </button>
        )}
      </div>

      <div className="pg-divider" />

      {/* ✅ 오른쪽: 병원 */}
      <div className="pg-section">
        <div className="pg-label">
          <FaHospitalAlt className="pg-icon-inline" />
          병원 방문일
        </div>
        {ddayLabel ? (
          <div className="pg-dday-value" onClick={onOpenHospital}>
            {ddayLabel.status === "today" ? (
              <span className="pg-dday-today">오늘이에요!</span>
            ) : (
              <>
                <span
                  className="pg-dday-number"
                  style={{ color: getDdayColor(ddayLabel) }}
                >
                  {ddayLabel.days}
                </span>
                <span className="pg-dday-suffix">
                  {ddayLabel.status === "past"
                    ? "일 지났어요!"
                    : "일 남았어요!"}
                </span>
              </>
            )}
          </div>
        ) : (
          <button type="button" className="pg-empty" onClick={onOpenHospital}>
            <span className="plus">＋</span> 병원 방문일을 입력해보세요!
          </button>
        )}
      </div>
    </div>
  );
}
function getDdayColor(ddayLabel) {
  if (!ddayLabel) return "#6b7280"; // 회색

  if (ddayLabel.status === "today") return "#ef4444"; // 오늘
  if (ddayLabel.status === "past") return "#6b7280"; // 지난 일정
  if (ddayLabel.status === "future") {
    if (ddayLabel.days <= 3) return "#ef4444"; // 임박
    return "#16a34a"; // 여유
  }

  return "#6b7280";
}
