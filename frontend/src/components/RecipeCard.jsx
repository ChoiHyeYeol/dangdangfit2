// src/components/RecipeCard.jsx
import "./RecipeCard.css";
import React, { useState } from "react";
import { FaHeart, FaCrown } from "react-icons/fa";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const LIKE_URL = "http://localhost:8086/api/recipe/like";

const RecipeCard = ({ recipe, highlight, rank }) => {
  const [liked, setLiked] = useState(recipe.liked);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // 카드 클릭 → 상세 페이지로 이동 (보여지는 건 name, 실제 id는 state로 전달)
  const handleClick = () => {
    navigate(`/recipe/detail/${encodeURIComponent(recipe.rcpNm)}`, {
      state: { rcpId: recipe.rcpId },
    });
  };

  // 순위별 이모지 매핑
  // const rankIcons = {
  //   1: "🥇",
  //   2: "🥈",
  //   3: "🥉",
  // };
  const toggleLike = async (e) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트랑 충돌 방지
    try {
      const res = await axios.post(
        "/api/recipe/like",
        { rcp_Id: recipe.rcpId }, // DTO 맞춰서 전송
        { withCredentials: true }
      );
      setLiked(res.data.liked); // 서버 응답으로 상태 갱신
      // ✅ 찜 추가된 경우에만 토스트
      if (res.data.liked) {
        setShowToast(true);
      }
    } catch (err) {
      console.error("찜 처리 실패:", err);
      alert("찜 처리 실패");
    }
  };

  // // 하트 클릭
  // const handleHeartClick = (e) => {
  //   e.stopPropagation(); // ✅ 부모 클릭 이벤트 막기
  //   const newLiked = !isLiked;
  //   setIsLiked(newLiked);
  //   if (newLiked) {
  //     setShowToast(true); // 찜했을 때만 토스트
  //   }
  // };

  // ✅ 특정 텍스트 하이라이트
  const highlightText = (text) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="recipe-card-container" onClick={handleClick}>
        {rank && rank <= 3 && (
          <div className={`rank-badge rank-${rank}`}>
            <FaCrown className="crown-icon" /> {rank}위
          </div>
        )}
        <div className="recipe-image-wrapper">
          {recipe.mainImg ? (
            <img src={recipe.mainImg} alt={recipe.rcpNm} />
          ) : (
            <div className="no-image">이미지 준비중</div>
          )}
        </div>

        <div className="recipe-info">
          <div className="recipe-meta">
            <span className="recipe-meta-text">
              {recipe.time} · {recipe.portion} · {recipe.level}
            </span>
            <span
              className={`heart-icon ${liked ? "liked" : ""}`}
              onClick={toggleLike}
            >
              <FaHeart />
            </span>
          </div>
          {/* <h3 className="recipe-name">{recipe.rcpNm}</h3> */}
          <h3 className="recipe-name">{highlightText(recipe.rcpNm)}</h3>
        </div>
      </div>

      {/* ✅ 토스트 */}
      <Toast
        message="레시피를 찜했어요"
        show={showToast}
        onClose={() => setShowToast(false)}
        navigateTo="/collection/recipe"
      />
    </>
  );
};

export default RecipeCard;
