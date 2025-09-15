import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Dot,
} from "recharts";

/**
 * props
 * - weekData: [{ day, breakfastPost?, lunchPost?, dinnerPost?, fasting? }]
 * - mode: "post" | "fasting"
 * - height: number
 */
export default function WeeklyGlucoseSlider({
  weekData = [],
  mode,
  height = 360,
  className = "",
}) {
  const [innerMode, setInnerMode] = useState(mode);
  useEffect(() => setInnerMode(mode), [mode]);

  // ✅ 오늘 날짜 (항상 마지막에 배치)
  const today = new Date();

  // ✅ 백엔드 데이터 그대로 사용
  // const data = useMemo(() => {
  //   return weekData.map((r) => ({
  //     day: r.day,
  //     breakfastPost: isNum(r.breakfastPost) ? r.breakfastPost : null,
  //     lunchPost: isNum(r.lunchPost) ? r.lunchPost : null,
  //     dinnerPost: isNum(r.dinnerPost) ? r.dinnerPost : null,
  //     fasting: isNum(r.fasting) ? r.fasting : null,
  //   }));
  // }, [weekData]);

  // ✅ 7일간 데이터 + 날짜/요일 라벨링
  const data = useMemo(() => {
    return weekData.map((r, idx) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - idx));
      const month = d.getMonth() + 1;
      const date = d.getDate();
      const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];

      return {
        ...r,
        // 라벨은 "8/31 일" 같이 저장, Tick에서 두 줄로 분리
        day: `${month}/${date} ${weekday}`,
      };
    });
  }, [weekData]);
  // ✅ Y축: 항상 [60, 200] 이상 고정
  const yDomain = useMemo(() => {
    const vals = data
      .flatMap((d) => [d.breakfastPost, d.lunchPost, d.dinnerPost, d.fasting])
      .filter(isNum);
    if (!vals.length) return [60, 200]; // 데이터 없을 때도 축은 고정
    const min = Math.min(...vals),
      max = Math.max(...vals),
      pad = 10;
    return [
      Math.max(60, Math.floor((min - pad) / 10) * 10),
      Math.ceil((max + pad) / 10) * 10,
    ];
  }, [data]);
  // console.log("yDomain:", yDomain, data);

  // ✅ X축 Tick 커스텀 (월/일 위줄, (요일) 아래줄)
  // XAxis 커스텀 Tick
  const CustomTick = ({ x, y, payload, index }) => {
    if (!payload?.value) return null;

    const [date, weekday] = payload.value.split(" ");

    // ✅ 날짜별 값 유무 판정
    const row = weekData[index];
    let isEmpty = false;

    if (mode === "post") {
      // 세 끼 전부 null → 비어있음
      isEmpty =
        row.breakfastPost == null &&
        row.lunchPost == null &&
        row.dinnerPost == null;
    } else if (mode === "fasting") {
      // 공복 값이 null → 비어있음
      isEmpty = row.fasting == null;
    }

    const color = isEmpty ? "#9ca3af" : "#475569"; // 회색 or 기본색

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill={color}
          fontSize={11}
          fontWeight={600}
        >
          {date}
        </text>
        <text x={0} y={14} textAnchor="middle" fill={color} fontSize={11}>
          ({weekday})
        </text>
      </g>
    );
  };

  return (
    <section className={className} style={{ width: "100%" }}>
      <div style={{ width: "100%", height, marginTop: -70 }}>
        {innerMode === "post" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 100, right: 12, left: -20, bottom: 50 }}
            >
              <CartesianGrid
                stroke="#94a3b8"
                strokeOpacity={0.25}
                strokeDasharray="4 6"
              />
              <XAxis
                dataKey="day"
                tick={<CustomTick />}
                interval={0}
                padding={{ left: 20, right: 20 }} // 👈 여백 추가
                // tickMargin={7} // 👈 X축 tick 아래 여백 추가
              />

              <YAxis
                domain={yDomain}
                tickCount={6}
                tick={{ fontSize: 12, fill: "#475569" }}
                // hide={false}
                tickMargin={7} // 👈 Y축 tick 오른쪽 여백
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="breakfastPost"
                name="아침 식후"
                stroke="#3b82f6"
                strokeWidth={3.5}
                dot={true}
                activeDot={{ r: 5 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="lunchPost"
                name="점심 식후"
                stroke="#10b981"
                strokeWidth={3.5}
                dot={true}
                activeDot={{ r: 5 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="dinnerPost"
                name="저녁 식후"
                stroke="#ef4444"
                strokeWidth={3.5}
                dot={true}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 100, right: 12, left: -20, bottom: 50 }}
            >
              <CartesianGrid
                stroke="#94a3b8"
                strokeOpacity={0.25}
                strokeDasharray="4 6"
              />

              <XAxis
                dataKey="day"
                tick={<CustomTick />}
                // tickMargin={8}
                // tick={{ fontSize: 12, fill: "#475569" }}
                interval={0}
                // padding={{ left: 10, right: 10 }} // 👈 여백 추가
              />
              <YAxis
                domain={yDomain}
                tickCount={6}
                tick={{ fontSize: 12, fill: "#475569" }}
                tickMargin={7}
              />
              <Tooltip />
              <Bar
                dataKey="fasting"
                name="공복"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ✅ 범례: 탭 상관없이 항상 고정 */}
      {/* <div className="m-legend" aria-hidden="true">
        {innerMode === "post" ? (
          <>
            <span className="m-dot m-blue" /> 아침
            <span className="m-dot m-green" /> 점심
            <span className="m-dot m-pink" /> 저녁
          </>
        ) : (
          <>
            <span className="m-dot m-purple" /> 공복
          </>
        )}
      </div> */}
    </section>
  );
}

function isNum(n) {
  return typeof n === "number" && Number.isFinite(n);
}
