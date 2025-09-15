// src/pages/diet/components/mealplan/MealHeaderInfo.jsx
import React from "react";
import "./MealHeaderInfo.css";

// 요일 구하기
function getDayOfWeek(date) {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
}

function MealHeaderInfo({ nickName, dDay, selectedDate }) {
  if (!selectedDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sel = new Date(selectedDate);
  sel.setHours(0, 0, 0, 0);

  const isToday = sel.getTime() === today.getTime();

  return (
    <div className="meal-header-info">
      <p className="meal-progress">
        🔥 <span className="nickname">{nickName}</span>님 현재 식단{" "}
        <span className="highlight">{dDay + 1}</span>일째
      </p>

      <p className="meal-date">
        <span className="date-text">
          {sel.getMonth() + 1}월 {sel.getDate()}일 {getDayOfWeek(sel)}요일
        </span>{" "}
        {isToday && <span className="today-text">(오늘)</span>}
      </p>
    </div>
  );
}

export default MealHeaderInfo;
