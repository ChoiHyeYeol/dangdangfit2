// src/pages/main/components/DDayBadge.jsx
import React, { useMemo } from "react";

/**
 * D-Day 뱃지
 * props:
 *  - value: "D-4", "D-DAY", "D+2" 처럼 보여줄 문자열
 *  - label: 상단 작은 라벨 (기본: "병원 방문일")
 *  - onClick: 클릭 시 (수정/입력용 바텀시트 열기 등)
 */
export default function DDayBadge({ value, label = "병원 방문일", onClick }) {
  // 값에 따라 색상 톤 조절
  const color = useMemo(() => {
    if (!value) return "#6b7280"; // 기본 회색
    if (value === "D-DAY") return "#ef4444"; // 오늘: 빨강
    const m = value.match(/D([+-])(\d+)/i);
    if (!m) return "#6b7280";
    const sign = m[1];
    const n = Number(m[2] || 0);
    if (sign === "+") return "#ef4444"; // 이미 지남
    if (n <= 3) return "#f59e0b"; // 임박(주황)
    return "#16a34a"; // 여유(초록)
  }, [value]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} ${value || ""}`.trim()}
      style={{
        marginTop: 4,
        appearance: "none",
        border: 0,
        background: "#f4f7efff",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        padding: "8px 16px",
        minWidth: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f9fafb";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.5px",
          color,
        }}
      >
        {value || "미정"}
      </span>
    </button>
  );
}
