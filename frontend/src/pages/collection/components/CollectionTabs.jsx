// src/pages/collection/CollectionTabs.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CollectionTabs.css";

export default function CollectionTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname.includes("trans")
    ? "변환 레시피"
    : "일반 레시피";

  return (
    <div className="collection-tabs">
      <div
        className={`tab-item ${active === "일반 레시피" ? "active" : ""}`}
        onClick={() => navigate("/collection/recipe", { replace: true })}
      >
        일반 레시피
      </div>
      <div
        className={`tab-item ${active === "변환 레시피" ? "active" : ""}`}
        onClick={() => navigate("/collection/trans", { replace: true })}
      >
        변환 레시피
      </div>
    </div>
  );
}
