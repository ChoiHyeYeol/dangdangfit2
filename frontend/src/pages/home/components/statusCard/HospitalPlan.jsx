// src/pages/main/components/HospitalPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DatePicker from "react-mobile-datepicker";

/**
 * 상태 흐름
 * - empty: 저장값 없음 → + 추가 버튼 노출 + 안내문구
 * - edit: 작성/수정 폼
 * - view: 저장된 일정 카드
 */
export default function HospitalPlan({ onSaved }) {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("loading"); // "loading" | "empty" | "edit" | "view"
  const [visit, setVisit] = useState({ date: "", nextDate: "" });

  // ✅ 팝업 열릴 때 서버에서 일정 가져오기
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await axios.get("/api/get/calendar", {
          withCredentials: true,
        });

        const dateStr = res.data;

        // 🚨 잘못된 날짜값 걸러내기 (예: -999999999-01-01)
        if (!dateStr || dateStr.startsWith("-9999")) {
          setMode("empty");
          return;
        }

        setVisit({ date: dateStr, nextDate: calcDday(dateStr) });
        setMode("view");
      } catch (err) {
        console.error("병원 일정 불러오기 실패:", err);
        setMode("empty");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);
  const handleAddClick = () => setMode("edit");
  const handleCancel = () => setMode(visit.date ? "view" : "empty");

  const handleSubmit = (payload) => {
    // TODO: 일정 저장 API 호출 필요하다면 여기서 추가
    setVisit(payload);
    setMode("view");
    if (onSaved) onSaved(payload);
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        padding: 16,
      }}
    >
      {/* <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>
        병원 일정
      </h3> */}

      {mode === "empty" && (
        <div>
          <button
            type="button"
            onClick={handleAddClick}
            style={{
              width: "100%",
              height: 50,
              borderRadius: 999,
              border: "1px dashed #cbd5e1",
              background: "#f8fafc",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + 일정 추가
          </button>

          {/* ✅ 안내문구 */}
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 1.45,
            }}
            aria-live="polite"
          >
            병원 일정을 추가하면
            <br />
            메인 화면 카드에 D-day가 표시됩니다.
          </p>
        </div>
      )}

      {mode === "edit" && (
        // <HospitalPlanForm
        //   todayStr={todayStr}
        //   defaultDate={visit.date || todayStr}
        //   onCancel={() => setMode(visit.date ? "view" : "empty")}
        //   onSubmit={handleSubmit}
        // />
        <HospitalPlanForm
          defaultDate={visit.date || new Date().toISOString().split("T")[0]}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      )}

      {mode === "view" && (
        // <HospitalPlanCard
        //   visit={visit}
        //   onEdit={handleEdit}
        //   onClear={handleClear}
        // />
        <HospitalPlanCard
          visit={visit}
          onEdit={() => setMode("edit")}
          // onClear={() => {
          //   setVisit({ date: "", nextDate: "" });
          //   setMode("empty");
          // }}
        />
      )}
    </div>
  );
}

// function formatDday(dday) {
//   if (dday === 0) return "D-DAY";
//   if (dday > 0) return `D-${dday}`; // 아직 안 온 날 → D-?
//   return `D+${Math.abs(dday)}`; // 이미 지난 날 → D+?
// }

function HospitalPlanForm({ defaultDate, onSubmit, onCancel }) {
  const [date, setDate] = useState(defaultDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🚀 Spring API 호출
      const res = await axios.post(
        "/api/update/calendar",
        { hosDate: date }, // record CalendarRequest(LocalDate hosDate)
        { withCredentials: true }
      );

      const { hosDate, dday } = res.data;

      // ✅ 여기서 문자열까지 확실히 만들어서 넘긴다
      const nextDate =
        dday === 0 ? "D-DAY" : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;

      const payload = {
        date: hosDate,
        nextDate, // 🚀 문자열 확정
        dday, // 숫자 그대로 (0, 양수, 음수)
      };
      // console.log("서버 응답:", res.data);
      // console.log("payload:", payload);

      onSubmit(payload); // HospitalPlan으로 전달
    } catch (err) {
      console.error("일정 저장 실패:", err);
      alert("일정을 저장하지 못했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        방문날짜
      </label>
      <input
        type="date"
        value={date}
        // min={todayStr}

        onChange={(e) => setDate(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          marginBottom: 12,
        }}
        required
      />

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            height: 44,
            border: "1px solid #e5e7eb",
            borderRadius: 999,
            background: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          취소
        </button>
        <button
          type="submit"
          style={{
            flex: 2,
            height: 44,
            border: 0,
            borderRadius: 999,
            background: "#008A69",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          저장하기
        </button>
      </div>
    </form>
  );
}

function HospitalPlanCard({ visit, onEdit, onClear }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 700 }}>방문일</div>
        <div style={{ fontWeight: 800, color: "#16a34a" }}>
          {visit.nextDate}
        </div>
      </div>
      <div style={{ fontSize: 15, marginBottom: 12 }}>{visit.date}</div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onEdit}
          style={{
            flex: 1,
            height: 40,
            border: "1px solid #d1d5db",
            borderRadius: 999,
            background: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          수정
        </button>
        {/* <button
          type="button"
          onClick={onClear}
          style={{
            flex: 1,
            height: 40,
            border: 0,
            borderRadius: 999,
            background: "#ef4444",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          초기화
        </button> */}
      </div>
    </div>
  );
}

// D-day 계산해서 "D-7" 같은 표시 생성
function calcDday(dateStr) {
  if (!dateStr) return "";
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-DAY";
  return `D+${Math.abs(diff)}`;
}
