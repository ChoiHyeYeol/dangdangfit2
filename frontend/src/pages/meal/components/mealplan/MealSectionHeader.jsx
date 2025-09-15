// src/pages/diet/components/meal/MealHeader.jsx
import React from "react";
import { FaRedo } from "react-icons/fa";
import "./MealSectionHeader.css";

function MealSectionHeader({ label = "아침", icon = "☀️", onRefresh }) {
  console.log("MealSectionHeader render");

  return (
    <div className="meal-header">
      <div className="meal-label">
        {label}
        <span className="meal-icon">{icon}</span>
      </div>
      <button className="refresh-btn" onClick={onRefresh} aria-label="새로고침">
        <FaRedo />
      </button>
    </div>
  );
}

export default MealSectionHeader;
