// src/pages/diet/components/mealplan/MealItemList.jsx

import React from "react";
// import { PiBowlFoodBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./MealItemList.css";

// 실제 아이콘 이미지 import
import sauceIcon from "../../../../assets/category/S.png"; // 양념
import grillIcon from "../../../../assets/category/G.png"; // 구이
import soupIcon from "../../../../assets/category/B.png"; // 국물
import mixIcon from "../../../../assets/category/M.png"; // 무침
import pickleIcon from "../../../../assets/category/P.png"; // 절임
import riceIcon from "../../../../assets/category/N.png"; // 면/밥
import bakeryIcon from "../../../../assets/category/K.png"; // 제과제빵
import otherIcon from "../../../../assets/category/O.png"; // 기타

// 카테고리 코드 ↔ 아이콘 매핑
const categoryToIcon = {
  G: grillIcon, // 구이
  S: sauceIcon, // 양념 -> 채식
  B: soupIcon, // 국물
  M: mixIcon, // 무침
  P: pickleIcon, // 절임 -> 볶음
  N: riceIcon, // 면/밥
  K: bakeryIcon, // 제과제빵 -> 디저트
  O: otherIcon, // 기타
  X: otherIcon, // 레시피 아님 → 일반 음식은 기타 처리
};

function MealItemList({ items = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="meal-item-list loading">
        {/* <div className="loading-spinner" /> ✅ 이름 통일 */}
        <p className="loading-text">새로운 식단을 분석중입니다...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="empty-text">식단이 없습니다.</p>;
  }

  const handleGoDetail = (id, name) => {
    navigate(`/recipe/detail/${encodeURIComponent(name)}`, {
      state: { rcpId: id }, // 👉 RecipeDetailPage에서 location.state.rcpId로 받음
    });
  };

  return (
    <div className="meal-item-list">
      {items.map((item, idx) => {
        const [name, id, category] = item;
        const isRecipe = category !== "X"; // 레시피 여부

        return (
          <div key={idx} className="meal-item">
            <div className="item-left">
              <img
                src={categoryToIcon[category] || otherIcon}
                className="food-icon"
                alt="icon"
              />
              <span className="food-name">{name}</span>
            </div>
            {isRecipe && (
              <button
                className="recipe-button"
                onClick={() => handleGoDetail(id, name)}
              >
                레시피
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MealItemList;
