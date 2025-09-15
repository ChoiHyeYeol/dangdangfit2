// src/pages/diet/components/mealplan/MealRefreshModal.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./MealRefreshModal.css";

function MealRefreshModal({ visible, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!visible) return null;

  // const handleConfirm = async () => {
  //   setIsLoading(true); // 로딩 시작
  //   try {
  //     await onConfirm(); // 부모에서 실제 API 호출
  //     onClose();
  //   } finally {
  //     setIsLoading(false); // 닫히면 무시됨
  //   }
  // };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3 className="modal-title">식단이 맘에 들지 않으신가요?</h3>
        <p className="modal-message">식단을 새로 추천받아보세요!</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            아니요
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            네, 새로 주세요
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ Portal로 body 전체에 렌더링
  return ReactDOM.createPortal(modalContent, document.body);
}

export default MealRefreshModal;
