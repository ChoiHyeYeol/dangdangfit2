// src/pages/recipedetail/components/RecipeDetailTabs.jsx
import React from "react";
import "./RecipeDetailTabs.css";

export default function RecipeDetailTabs({ activeTab, onChange }) {
  return (
    <div className="detail-tabs-wrapper">
      {" "}
      {/* ✅ 바깥 배경 */}
      <div className="detail-tabs">
        <button
          className={`detail-tab ${activeTab === "재료" ? "active" : ""}`}
          onClick={() => onChange("재료")}
        >
          재료
        </button>
        <button
          className={`detail-tab ${activeTab === "양념" ? "active" : ""}`}
          onClick={() => onChange("양념")}
        >
          양념
        </button>
        <button
          className={`detail-tab ${activeTab === "조리 순서" ? "active" : ""}`}
          onClick={() => onChange("조리 순서")}
        >
          조리 순서
        </button>
      </div>{" "}
    </div>
  );
}
