// src/components/MealUpdatePopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MealUpdatePopup.css";

export default function MealUpdatePopup({ onClose }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.setItem("lastMealPopupDate", new Date().toDateString());
    onClose();
    navigate("/meal"); // 식단 페이지로 이동
  };

  const handleCancel = () => {
    localStorage.setItem("lastMealPopupDate", new Date().toDateString());
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <p className="popup-message">
          이번주 식단이 업데이트 되었습니다.
          <br />
          확인하시겠습니까?
        </p>
        <div className="popup-buttons">
          <button className="popup-btn cancel" onClick={handleCancel}>
            아니오
          </button>
          <button className="popup-btn confirm" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
