// src/pages/diet/components/desert/DesertCard.jsx
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./DesertCard.css";
import image from "../../../../assets/category/snack.png";

function DesertCard({ desert }) {
  //   if (!desert) return null;

  //   const handleClick = () => {
  //     // 예: 라우팅 또는 외부 링크 이동
  //     // window.location.href = desert.link;
  //   };
  const navigate = useNavigate();

  // if (!desert || !Array.isArray(desert)) return null;

  // // desert = [이름, id, category]
  // const [name, id, category] = desert;
  // const isRecipe = category === "S"; // 👉 S = 레시피, X = 일반 음식

  let name = "";
  let id = null;
  let category = null;
  let isRecipe = false;

  if (desert && Array.isArray(desert)) {
    [name, id, category] = desert;
    isRecipe = category === "S";
  }

  const handleGoDetail = (e) => {
    e.preventDefault();
    if (!id) return;

    // 레시피 상세 페이지로 이동 (id만 param으로 넘김)
    navigate(`/transrecipe/detail/${id}`, {
      state: { rcpId: id }, // state로도 넘겨줌 (안전하게)
    });
  };

  return (
    <div className="desert-card">
      <div className="desert-left">
        오늘의 <span className="highlight">간식</span>은?
      </div>

      <div className="desert-right">
        <div className="desert-name">{name || "오늘의 간식이 없어요"}</div>
        {name &&
          (isRecipe ? (
            <a href="#" className="desert-link" onClick={handleGoDetail}>
              레시피 보러가기 <FaChevronRight size={12} />
            </a>
          ) : (
            <span className="desert-info">레시피가 없는 음식이에요</span>
          ))}
      </div>
    </div>
  );
}
export default DesertCard;
