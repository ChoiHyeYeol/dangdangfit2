// src/pages/recipedetail/components/RecipeDetailStep.jsx
import React from "react";
import "./RecipeDetailSteps.css";

export default function RecipeDetailStep({ step, description, image }) {
  // 이미지 유효성 검사
  const isValidImage =
    image &&
    typeof image === "string" &&
    image.trim().length > 10 && // 길이가 너무 짧은 값 제외
    image !== "0" &&
    /^https?:\/\//i.test(image); // http:// 또는 https:// 로 시작해야만 허용

  return (
    <div className="detail-step">
      <div className="step-info">
        <span className="step-badge">step {step}</span>
        <p className="step-desc">{description}</p>
      </div>
      {/* ✅ 이미지가 있을 때만 렌더링 */}
      {isValidImage && (
        <img className="step-img" src={image} alt={`step ${step}`} />
      )}
    </div>
  );
}
