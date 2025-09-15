// src/components/Toast.jsx
import React, { useEffect } from "react";
import "./Toast.css";
import { useNavigate } from "react-router-dom";

export default function Toast({ message, show, onClose, navigateTo }) {
  const navigate = useNavigate();

  // 2초 후 자동 닫기
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast">
      <span>{message}</span>
      <button className="toast-btn" onClick={() => navigate(navigateTo)}>
        찜 목록 보러가기
      </button>
    </div>
  );
}
