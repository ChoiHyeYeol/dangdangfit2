// src/pages/main/components/FastingGauge.jsx
import React, { useMemo } from "react";

/**
 * 반원 게이지 (공복 혈당)
 * props:
 *  - value: number | null  (mg/dL)
 *  - min: number (기본 70)
 *  - max: number (기본 160)
 *  - track: 배경선 색 (선택)
 *  - onClick: 클릭 시 동작 (선택)
 *
 * 값이 클수록 빨개지는 단일 색상 매핑 사용
 */

export default function FastingGauge({
  value,
  min = 70,
  max = 200,
  track = "#E5E7EB",
  onClick,
}) {
  const { r, cx, cy, length, progress, stroke, knob } = useMemo(() => {
    const radius = 48;
    const centerX = 60;
    const centerY = 60;

    const L = Math.PI * radius;
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const p =
      typeof value === "number" ? clamp((value - min) / (max - min), 0, 1) : 0;

    const getColor = (p) => {
      const lerp = (a, b, t) => a + (b - a) * t;
      const hex = (r, g, b) =>
        `#${[r, g, b]
          .map((n) => Math.round(n).toString(16).padStart(2, "0"))
          .join("")}`;
      const g = [16, 185, 129];
      const o = [245, 158, 11];
      const r = [239, 68, 68];
      if (p <= 0.5) {
        const t = p / 0.5;
        return hex(
          lerp(g[0], o[0], t),
          lerp(g[1], o[1], t),
          lerp(g[2], o[2], t)
        );
      }
      const t = (p - 0.5) / 0.5;
      return hex(lerp(o[0], r[0], t), lerp(o[1], r[1], t), lerp(o[2], r[2], t));
    };

    const angle = Math.PI - Math.PI * p;
    const knobX = centerX + radius * Math.cos(angle);
    const knobY = centerY + radius * Math.sin(angle);

    return {
      r: radius,
      cx: centerX,
      cy: centerY,
      length: L,
      progress: p,
      stroke: getColor(p),
      knob: { x: knobX, y: knobY },
    };
  }, [value, min, max]);

  const dashArray = length;
  const dashOffset = length * (1 - progress);

  return (
    <svg
      className="pg-svg"
      width="120"
      height="64"
      viewBox="0 0 120 72"
      role="img"
      onClick={onClick}
    >
      {/* 배경 반원 */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={track}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* 값 반원 */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="10"
        strokeLinecap="round"
        style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
      />
      {/* 포인터 노브 */}
      {typeof value === "number" && (
        <circle cx={knob.x} cy={knob.y} r="5" fill={stroke} />
      )}
      {/* 중앙 값 텍스트 */}
      {typeof value === "number" && (
        <text className="pg-gauge-value" x="60" y="50">
          {value}
          <tspan className="unit" dx="4">
            mg/dL
          </tspan>
        </text>
      )}
    </svg>
  );
}
