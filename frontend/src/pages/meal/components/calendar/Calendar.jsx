// src/pages/diet/components/calendar/Calendar.jsx
import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import WeekDates from "./WeekDates";
import "./Calendar.css";
import { useEffect } from "react";

function Calendar({ onDateSelect, joinDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 제거

  // ✅ joinDate 정규화 (시간 제거)
  const normalizedJoinDate = joinDate
    ? new Date(new Date(joinDate).setHours(0, 0, 0, 0))
    : null;

  const [selectedDate, setSelectedDate] = useState(today); // ✅ 기본 선택 오늘
  const [viewDate, setViewDate] = useState(today); // ✅ 주를 기준으로 보는 날짜

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const startDate = getStartOfWeek(viewDate);

  const handlePrevWeek = () => {
    const prev = new Date(viewDate);
    prev.setDate(prev.getDate() - 7);
    setViewDate(prev);
    setSelectedDate(null); // ✅ 선택 해제
  };

  const handleNextWeek = () => {
    const next = new Date(viewDate);
    next.setDate(next.getDate() + 7);

    const startOfNext = getStartOfWeek(next);
    const startOfToday = getStartOfWeek(today);

    if (startOfNext > startOfToday) return; // ✅ 미래 주 막기

    setViewDate(next);
    setSelectedDate(null); // ✅ 선택 해제
  };

  // ✅ 날짜 클릭 시: 선택 + viewDate 동기화
  const handleSelectDate = (date) => {
    // 가입일 이전이면 선택 막기
    if (normalizedJoinDate && date < normalizedJoinDate) return;

    setSelectedDate(date);
    setViewDate(date); // 🌟 header가 선택된 날짜의 월로 변경됨
    if (onDateSelect) {
      onDateSelect(date); // ✅ Meal.jsx로 전달
    }
  };

  // 내부 상태 추가
  const [isTodayWeek, setIsTodayWeek] = useState(true); // 현재 주 여부 기억

  // 현재 주 판단 함수
  const isSameWeek = (date1, date2) => {
    return getStartOfWeek(date1).getTime() === getStartOfWeek(date2).getTime();
  };

  useEffect(() => {
    const nowInTodayWeek = isSameWeek(viewDate, today);
    if (nowInTodayWeek && !isTodayWeek) {
      // 🔁 다른 주에서 현재 주로 돌아옴
      setSelectedDate(today);
      if (onDateSelect) {
        onDateSelect(today); // ✅ 오늘 날짜 식단 다시 불러오기
      }
    }
    setIsTodayWeek(nowInTodayWeek);
  }, [viewDate]);

  return (
    <div className="calendar-container">
      <CalendarHeader selectedDate={viewDate} />
      <WeekDates
        startDate={startDate}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        isCurrentWeek={startDate.getTime() === getStartOfWeek(today).getTime()}
        joinDate={normalizedJoinDate}
      />
    </div>
  );
}

export default Calendar;
