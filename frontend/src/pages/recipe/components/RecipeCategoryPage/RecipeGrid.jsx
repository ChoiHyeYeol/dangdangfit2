import React from "react";
import RecipeCard from "../../../../components/RecipeCard"; // 공통 컴포넌트
import "./RecipeGrid.css";

export default function RecipeGrid({ items, highlight }) {
  if (!items || items.length === 0) {
    return <p>레시피가 없습니다.</p>;
  }

  return (
    <div className="recipe-grid">
      {items.map((recipe) => (
        <RecipeCard key={recipe.rcpId} recipe={recipe} highlight={highlight} />
      ))}
    </div>
  );
}
