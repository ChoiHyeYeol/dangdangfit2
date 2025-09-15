// src/pages/recipedetail/components/RecipeDetailHeader.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./RecipeDetailHeader.css";
import axios from "axios";

// const LIKE_URL = "http://localhost:8086/api/recipe/like";

export default function RecipeDetailHeader({
  recipeName,
  image,
  likes,
  initLiked,
  rcpId,
  isTrans = false,
}) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(initLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleHeartClick = async () => {
    try {
      const res = await axios.post(
        "/api/recipe/like",
        { rcp_Id: rcpId },
        { withCredentials: true }
      );
      setIsLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리 실패");
    }
  };

  return (
    <div className="detail-header">
      {/* 상단 이미지 + 뒤로가기 버튼 */}
      <div className="detail-header__image">
        {image ? (
          <img src={image} alt={recipeName} />
        ) : (
          <div className="no-image">이미지 준비중</div>
        )}
        <button
          className="detail-header__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          ←
        </button>
      </div>

      {/* 이미지 아래 제목 + 하트/좋아요 */}
      <div className="detail-header__bottom">
        <h2 className="detail-header__title">{recipeName}</h2>
        {/* ✅ 변환 레시피일 땐 하트/좋아요 숨기기 */}
        {isTrans ? (
          <div className="detail-header__likes-placeholder" />
        ) : (
          <div className="detail-header__likes">
            <span
              className={`heart-icon ${isLiked ? "liked" : ""}`}
              onClick={handleHeartClick}
            >
              <FaHeart />
            </span>
            <span className={`likes-count ${isLiked ? "liked" : ""}`}>
              {likeCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
