// src/pages/recipedetail/components/RecipeDetailInfo.jsx
import React from "react";
import { FaClock, FaUserFriends, FaStar } from "react-icons/fa";
import "./RecipeDetailInfo.css";

export default function RecipeDetailInfo({ time, servings, level }) {
  // 값이 없으면 "없음"으로 대체
  const safeTime = time && time.trim() !== "" ? time : "없음";
  const safeServings = servings && servings.trim() !== "" ? servings : "없음";
  const safeLevel = level && level.trim() !== "" ? level : "없음";

  return (
    <div className="detail-info">
      <div className="detail-info__item">
        <FaClock className="detail-info__icon" />
        <span>{safeTime}</span>
      </div>
      <div className="detail-info__item">
        <FaUserFriends className="detail-info__icon" />
        <span>{safeServings}</span>
      </div>
      <div className="detail-info__item">
        <FaStar className="detail-info__icon" />
        <span>{safeLevel}</span>
      </div>
    </div>
  );
}
