// src/pages/recipedetail/components/RecipeDetailIngredients.jsx
import React, { useState } from "react";
import "./RecipeDetailIngredients.css";

export default function RecipeDetailIngredients({ ingredients }) {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (name) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const cleanText = (text) =>
    text
      ?.replace(/\s+/g, "") // ✅ 모든 공백 제거 (스페이스, 탭, 개행 포함)
      .replace(/\u00A0/g, "") // non-breaking space 제거
      .replace(/\u3000/g, "") // 전각 공백 제거
      .trim();
  // ✅ 배열 체크
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="ingredients-list empty-message">
        필요한 재료가 없습니다.
      </div>
    );
  }
  return (
    <div className="ingredients-list">
      {ingredients.map((item, idx) => {
        const cleanName = cleanText(item.ingrName);

        return (
          <div key={idx} className="ingredient-item">
            <label className="ingredient-left">
              <input
                type="checkbox"
                checked={!!checkedItems[cleanName]}
                onChange={() => handleCheck(cleanName)}
              />
              <span
                className={`ingredient-name ${
                  checkedItems[cleanName] ? "checked" : ""
                }`}
              >
                {cleanName?.startsWith("(대체)") ? (
                  <>
                    <span className="substitute-label">(대체)</span>
                    {cleanName.replace("(대체)", "")}
                  </>
                ) : (
                  cleanName
                )}
              </span>
            </label>
            <span className="ingredient-amount">{item.ingrCnt || "없음"}</span>
          </div>
        );
      })}
    </div>
  );
}
