// src/pages/collection/components/collectionItem.jsx
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsBookmarkFill } from "react-icons/bs";
import "./CollectionItems.css";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

export default function CollectionItem({
  recipe,
  isTrans,
  onRemove,
  onToggleLike,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isTrans) {
      // 변환 레시피 → LowRecipe 페이지
      navigate(`/transrecipe/detail/${recipe.id}`, {
        state: { rcpId: recipe.id },
      });
    } else {
      // 일반 레시피 → 상세 페이지
      navigate(`/recipe/detail/${encodeURIComponent(recipe.name)}`, {
        state: { rcpId: recipe.id },
      });
    }
  };

  const handleRemoveClick = () => {
    setShowConfirm(true); // 팝업 열기
  };

  const confirmDelete = () => {
    onRemove();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="collection-item" onClick={handleClick}>
        {/* 이미지 */}
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="collection-item__img"
          />
        ) : (
          <div
            className="collection-item__img"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e5e7eb",
              color: "#6b7280",
              fontSize: "11px",
              fontWeight: "600",
              borderRadius: "8px",
            }}
          >
            이미지 준비중
          </div>
        )}

        {/* 텍스트 */}
        <div className="collection-item__info">
          <h4 className="collection-item__title">{recipe.name}</h4>
          <p className="collection-item__tags">
            {recipe.time} · {recipe.servings} · {recipe.level}
          </p>
        </div>

        {/* X 버튼은 변환 레시피만 */}
        {isTrans && (
          <button
            className="collection-item__remove"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 막기
              setShowConfirm(true);
            }}
          >
            <IoClose size={18} />
          </button>
        )}

        {/* 일반 레시피: 하트 버튼 */}
        {!isTrans && (
          <button
            className={`collection-item__heart ${recipe.liked ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 막기
              onToggleLike();
            }}
          >
            <FaHeart />
          </button>
        )}
      </div>

      {/* ✅ Portal로 body 최상단에 렌더링 */}
      {showConfirm &&
        ReactDOM.createPortal(
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3 className="confirm-title">정말 삭제하시겠어요?</h3>
              <p className="confirm-msg">삭제된 레시피는 복구되지 않습니다.</p>
              <div className="confirm-actions">
                <button
                  className="btn ghost"
                  onClick={() => setShowConfirm(false)}
                >
                  취소
                </button>
                <button className="btn primary" onClick={confirmDelete}>
                  네, 삭제합니다
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
