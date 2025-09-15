// src/pages/main/components/BloodPop.jsx
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
// import "./BloodPop.css";

// ① SLOTS & SLOT_META: 식후 키로 통일(표시용)
const SLOTS = ["fasting", "breakfastPost", "lunchPost", "dinnerPost"];

const SLOT_META = {
  fasting: { label: "공복 혈당", window: "기상 직후" },
  breakfastPost: {
    label: "아침 식사 후 혈당",
    window: "식후 2시간 이내 (05:00~10:59)",
  },
  lunchPost: {
    label: "점심 식사 후 혈당",
    window: "식후 2시간 이내 (11:00~15:59)",
  },
  dinnerPost: {
    label: "저녁 식사 후 혈당",
    window: "식후 2시간 이내 (16:00~21:59)",
  },
}; // 프론트 슬롯 → 서버 enum 매핑
const SLOT_TO_ENUM = {
  fasting: "F", // 공복
  breakfastPost: "M", // 아침
  lunchPost: "A", // 점심
  dinnerPost: "E", // 저녁
};

// ③ 슬롯별 임계값 반영
function levelColor(n, slot) {
  if (n == null || Number.isNaN(n)) return "#9ca3af";

  if (slot === "fasting") {
    if (n >= 126) return "#ef4444"; // 공복 고혈당
    if (n >= 100) return "#f59e0b"; // 공복 경계
    return "#16a34a";
  } else {
    if (n >= 200) return "#ef4444"; // 식후 고혈당
    if (n >= 140) return "#f59e0b"; // 식후 경계
    return "#16a34a";
  }
}

function getTodayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ② 시간대별 기본 슬롯
function getCurrentSlot() {
  const h = new Date().getHours();
  if (h >= 0 && h < 8) return "fasting";
  if (h >= 8 && h < 11) return "breakfastPost";
  if (h >= 11 && h < 16) return "lunchPost";
  if (h >= 16 && h < 24) return "dinnerPost";
  return "fasting";
}

export default function BloodPop({ onSaved }) {
  const todayStr = useMemo(getTodayStr, []);
  const initialSlot = useMemo(getCurrentSlot, []);
  const [activeSlot, setActiveSlot] = useState(initialSlot);

  // const [logs, setLogs] = useState(() => readLogs());
  const [logs, setLogs] = useState({ [todayStr]: {} });
  const todayLogs = logs[todayStr] || {};

  // ④ 마이그레이션: legacy 키 → 새 키로 매핑 (삭제 없이 동시 유지)
  // useEffect(() => {
  //   try {
  //     let next = readLogs();
  //     const today = getTodayStr();

  //     // 레거시 단일키(fastingGlucose) → 오늘 공복으로 이관
  //     const legacy = localStorage.getItem("fastingGlucose");
  //     if (legacy != null) {
  //       const v = Number(legacy);
  //       if (Number.isFinite(v)) {
  //         next[today] = { ...(next[today] || {}) };
  //         setSlotValue(next[today], "fasting", v);
  //       }
  //       localStorage.removeItem("fastingGlucose");
  //     }

  //     // 레거시 식전 키 매핑: morning/lunch/dinner -> breakfastPost/lunchPost/dinnerPost
  //     Object.keys(next).forEach((d) => {
  //       const rec = next[d] || {};
  //       if (typeof rec.morning === "number" && rec.breakfastPost == null) {
  //         setSlotValue(rec, "breakfastPost", rec.morning);
  //       }
  //       if (typeof rec.lunch === "number" && rec.lunchPost == null) {
  //         setSlotValue(rec, "lunchPost", rec.lunch);
  //       }
  //       if (typeof rec.dinner === "number" && rec.dinnerPost == null) {
  //         setSlotValue(rec, "dinnerPost", rec.dinner);
  //       }
  //       next[d] = rec;
  //     });

  //     writeLogs(next);
  //     setLogs(next);
  //     window.dispatchEvent(new CustomEvent("glucose:changed"));
  //   } catch {}
  // }, []);

  // 🔗 서버에서 값 불러오기
  useEffect(() => {
    const fetchBlood = async () => {
      try {
        const res = await axios.get("/api/get/blood", {
          withCredentials: true,
        });
        const arr = res.data || [-1, -1, -1, -1];
        console.log(res.data);
        // console.log(res.data);
        const mapped = {
          fasting: arr[0] >= 0 ? arr[0] : null,
          breakfastPost: arr[1] >= 0 ? arr[1] : null,
          lunchPost: arr[2] >= 0 ? arr[2] : null,
          dinnerPost: arr[3] >= 0 ? arr[3] : null,
        };

        setLogs({ [todayStr]: mapped });

        // ✅ 여기서 초기 모드/값도 세팅
        const initVal = mapped[activeSlot];
        if (Number.isFinite(initVal)) {
          setMode("view");
          setValue(String(initVal));
        } else {
          setMode("empty");
          setValue("");
        }
      } catch (err) {
        console.error("혈당 불러오기 실패:", err);
        setLogs({ [todayStr]: {} });
        setMode("empty");
        setValue("");
      }
    };
    fetchBlood();
  }, [todayStr, activeSlot]);

  // const hasValue = Number.isFinite(getSlotValue(todayLogs, activeSlot));
  // const [mode, setMode] = useState(hasValue ? "view" : "empty");
  // const [value, setValue] = useState(
  //   hasValue ? String(getSlotValue(todayLogs, activeSlot)) : ""
  // );

  const hasValue = Number.isFinite(todayLogs[activeSlot]);
  const [mode, setMode] = useState(hasValue ? "view" : "empty");
  const [value, setValue] = useState(
    hasValue ? String(todayLogs[activeSlot]) : ""
  );

  // 슬롯 전환
  const switchSlot = (slot) => {
    setActiveSlot(slot);
    const v = todayLogs[slot];
    const exists = Number.isFinite(v);
    setMode(exists ? "view" : "empty");
    setValue(exists ? String(v) : "");
  };

  const onAddClick = () => setMode("edit");

  // 저장 → 서버 호출
  const onSubmit = async (e) => {
    e.preventDefault();
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      alert("올바른 숫자를 입력해 주세요.");
      return;
    }
    if (n < 40 || n > 300) {
      const ok = window.confirm(
        "보통 40~300 mg/dL 범위를 권장합니다. 이 값으로 저장할까요?"
      );
      if (!ok) return;
    }

    try {
      await axios.post(
        "/api/update/blood",
        { type: SLOT_TO_ENUM[activeSlot], measurement: n },
        { withCredentials: true }
      );

      const next = { ...logs };
      const today = { ...(next[todayStr] || {}) };
      today[activeSlot] = n;
      next[todayStr] = today;
      setLogs(next);

      setMode("view");
      setValue(String(n));
      onSaved?.(activeSlot, n); // ✅ 슬롯과 값 같이 전달
    } catch (err) {
      console.error("혈당 저장 실패:", err);
      alert("혈당 저장 실패. 다시 시도해주세요.");
    }
  };

  // const currentVal = getSlotValue(todayLogs, activeSlot);
  const currentVal = todayLogs[activeSlot];

  // const chipInfo = SLOTS.map((s) => {
  //   const v = getSlotValue(todayLogs, s);
  //   return { slot: s, has: Number.isFinite(v), val: v };
  // });

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h3 style={styles.title}>오늘의 혈당</h3>
        {/* <div style={styles.tabs}>
          {SLOTS.map((s) => {
            const v = todayLogs[s];
            const has = Number.isFinite(v);
            return (
              <button
                key={s}
                type="button"
                onClick={() => switchSlot(s)}
                aria-pressed={activeSlot === s}
                style={{
                  ...styles.tab,
                  ...(has ? styles.tabHas : styles.tabEmpty),
                  ...(activeSlot === s ? styles.tabActive : {}),
                }}
              >
                {SLOT_META[s].label.split(" ")[0]}
              </button>
            );
          })}
        </div> */}
      </div>

      {mode === "empty" && (
        <button type="button" onClick={onAddClick} style={styles.addBtn}>
          + {SLOT_META[activeSlot].label} 추가
          <small style={styles.windowText}>
            {" "}
            ({SLOT_META[activeSlot].window})
          </small>
        </button>
      )}

      {mode === "edit" && (
        <form
          onSubmit={onSubmit}
          noValidate
          style={{ display: "grid", gap: 10 }}
        >
          <label style={styles.label}>{SLOT_META[activeSlot].label}</label>
          <div style={styles.row}>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              placeholder="예: 130"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              style={styles.input}
            />
            <span style={styles.unit}>mg/dL</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setMode(hasValue ? "view" : "empty")}
              style={styles.btnSecondary}
            >
              취소
            </button>
            <button type="submit" style={styles.btnPrimary}>
              저장
            </button>
          </div>
        </form>
      )}

      {mode === "view" && (
        <div style={styles.card}>
          <div style={styles.cardHead}>
            <div style={{ fontWeight: 700 }}>{SLOT_META[activeSlot].label}</div>
            <div
              style={{
                ...styles.badge,
                background: levelColor(currentVal, activeSlot),
              }}
              aria-label="혈당 상태"
            />
          </div>

          <div style={styles.valueRow}>
            <span style={styles.valueText}>{currentVal}</span>
            <span style={styles.valueUnit}>mg/dL</span>
          </div>

          <div style={styles.windowLine}>
            권장 입력 시간대: {SLOT_META[activeSlot].window}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setMode("edit")}
              style={styles.btnGhost}
            >
              수정
            </button>
          </div>
        </div>
      )}

      {/* <div style={styles.chipsWrap}>
        {chipInfo.map(({ slot, has, val }) => (
          <button
            key={slot}
            type="button"
            onClick={() => switchSlot(slot)}
            style={{
              ...styles.chip,
              ...(activeSlot === slot ? styles.chipActive : {}),
            }}
          >
            <span style={{ fontWeight: 700 }}>
              {SLOT_META[slot].label.split(" ")[0]}
            </span>
            <span style={{ marginLeft: 8, color: has ? "#111827" : "#9ca3af" }}>
              {has ? `${val} mg/dL` : "미입력"}
            </span>
          </button>
        ))}
      </div> */}
      {/* 칩 형태 슬롯 목록 */}
      <div style={styles.chipsWrap}>
        {SLOTS.map((slot) => {
          const v = todayLogs[slot];
          const has = Number.isFinite(v);
          return (
            <button
              key={slot}
              type="button"
              className="chip-btn"
              onClick={() => switchSlot(slot)}
              style={{
                ...styles.chip,
                ...(has ? styles.chipHas : styles.chipEmpty),
                ...(activeSlot === slot ? styles.chipActive : {}),
              }}
            >
              <span style={{ fontWeight: 700 }}>
                {SLOT_META[slot].label.split(" ")[0]}
              </span>
              <span
                style={{
                  marginLeft: 8,
                  color: has ? "#111827" : "#9ca3af",
                  fontWeight: has ? 600 : 400,
                }}
              >
                {has ? `${v} mg/dL` : "미입력"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 16px rgba(0,0,0,.08)",
    padding: 16,
    display: "grid",
    gap: 12,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: { margin: 0, fontSize: 16, fontWeight: 800 },
  // tabs: { display: "flex", gap: 6, flexWrap: "wrap" },

  // tab: {
  //   border: "1px solid #e5e7eb", // 기본 회색 보더
  //   background: "#fff", // 흰색 배경
  //   padding: "6px 10px",
  //   borderRadius: 999,
  //   fontSize: 12,
  //   cursor: "pointer",
  //   transition: "all 0.2s ease",
  //   color: "#374151", // 회색 텍스트
  //   outline: "none",
  //   boxShadow: "none",
  // },

  // // 값 없는 슬롯
  // tabEmpty: {
  //   borderColor: "#d9d9d9", // 옅은 회색
  //   // background: "#f9fafb",
  //   // color: "#9ca3af",
  // },

  // // 값 있는 슬롯
  // tabHas: {
  //   borderColor: "#bbf7d0", // 옅은 민트색 (#bbf7d0 → tailwind green-200)
  //   background: "#ecfdf5", // 연한 초록 배경 (#ecfdf5 → tailwind emerald-50)
  //   color: "#047857", // 녹색 텍스트 (#047857 → emerald-700)
  // },

  // // 현재 클릭된(active) 슬롯
  // tabActive: {
  //   borderColor: "#059669",
  //   // background: "#d1fae5",
  //   color: "#065f46",
  //   fontWeight: 800,
  //   boxShadow: "0 0 0 1px rgba(5,150,105,0.25)",
  // },

  addBtn: {
    width: "100%",
    height: 44,
    borderRadius: 999,
    border: "1px dashed #cbd5e1",
    background: "#f8fafc",
    fontWeight: 700,
    cursor: "pointer",
  },
  windowText: { color: "#6b7280", fontWeight: 500, marginLeft: 6 },
  label: { fontWeight: 700, fontSize: 14 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 8,
  },
  input: {
    appearance: "none",
    width: "100%",
    fontSize: 16,
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    outline: "none",
  },
  unit: { color: "#374151", fontSize: 14, fontWeight: 600 },
  btnPrimary: {
    flex: 1,
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    background: "#10b981",
    color: "#fff",
  },
  btnSecondary: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    background: "#fff",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    background: "#f9fafb",
    display: "grid",
    gap: 10,
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: { width: 12, height: 12, borderRadius: 999 },
  valueRow: { display: "flex", alignItems: "baseline", gap: 6 },
  valueText: { fontSize: 28, fontWeight: 900 },
  valueUnit: { fontSize: 14, color: "#6b7280", fontWeight: 700 },
  windowLine: { fontSize: 12, color: "#6b7280" },
  btnGhost: {
    flex: 1,
    height: 40,
    border: "1px solid #a9aca9ff",
    borderRadius: 999,
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  chipsWrap: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "2px solid transparent",
    background: "#fff",
    outline: "none",
    boxShadow: "none",
  },
  chipEmpty: {
    borderColor: "#e5e7eb",
    background: "#f9fafb",
    color: "#9ca3af",
  },
  chipHas: {
    borderColor: "#bbf7d0",
    background: "#ecfdf5",
    color: "#047857",
  },
  chipActive: {
    borderColor: "#059669",
    // background: "#d1fae5",
    color: "#065f46",
    fontWeight: 800,
    // boxShadow: "0 0 0 1px rgba(5,150,105,0.25)",
  },
};
