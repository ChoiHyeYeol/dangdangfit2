// src/components/calendar/WeekDates.jsx
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Calendar.css";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

function WeekDates({
  startDate,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  isCurrentWeek,
  joinDate,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div className="week-dates-wrapper">
      <button className="nav-button" onClick={onPrevWeek}>
        <FaChevronLeft />
      </button>

      <div className="week-dates">
        {dates.map((date, index) => {
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;

          // 가입일 이전이면 비활성화
          const isBeforeJoin = joinDate && date < joinDate;

          return (
            <div
              key={index}
              className={`date-item ${isSelected ? "selected" : ""} ${
                isSunday ? "sunday" : isSaturday ? "saturday" : ""
              }
                ${isBeforeJoin ? "disabled" : ""}
              }`}
              onClick={() => !isBeforeJoin && onSelectDate(date)}
            >
              <div className="day-name">{dayNames[date.getDay()]}</div>
              <div className="day-number">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      <button
        className="nav-button"
        onClick={onNextWeek}
        disabled={isCurrentWeek}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

export default WeekDates;
