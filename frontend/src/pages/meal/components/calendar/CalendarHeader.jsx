// src/components/calendar/CalendarHeader.jsx
import React from "react";

function CalendarHeader({ selectedDate }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

  return (
    <div className="calendar-header">
      <span className="calendar-header-text">
        <span className="big-number">{year}</span>
        <span className="unit-text">년</span>
        <span className="big-number">{month}</span>
        <span className="unit-text">월</span>
      </span>
      {/* <button className="calendar-header-button" aria-label="월 선택">
        ▼
      </button> */}
    </div>
  );
}

export default CalendarHeader;
