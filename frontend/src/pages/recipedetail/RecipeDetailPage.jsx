// src/pages/recipedetail/RecipeDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import RecipeDetailHeader from "./components/RecipeDetailHeader";
import img from "../../assets/green.png"; // 임시 이미지
import RecipeDetailInfo from "./components/RecipeDetailInfo";
import RecipeDetailTabs from "./components/RecipeDetailTabs";
import RecipeDetailIngredients from "./components/RecipeDetailIngredients";
import RecipeDetailStep from "./components/RecipeDetailSteps";
import RecipeDetailSauces from "./components/RecipeDetailSauces";
import axios from "axios";

// const DETAIL_URL = "http://localhost:8086/api/recipe/detail";

export default function RecipeDetailPage() {
  const { name, rcpId: paramId } = useParams();
  const location = useLocation();
  // state가 있으면 우선 사용, 없으면 URL param 사용
  const stateId = location.state?.rcpId;
  const rcpId = stateId || paramId;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("재료");

  const isTrans = location.pathname.startsWith("/transrecipe");
  // 제목은 일반/변환 분기해서 처리
  const recipeName = isTrans
    ? recipe?.rcpNm // 변환 레시피 → DB에서 불러온 rcpNm
    : decodeURIComponent(name || ""); // 일반 레시피 → URL param에서 가져옴

  useEffect(() => {
    if (!rcpId) return;
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/recipe/detail?rcp_id=${rcpId}`, {
          withCredentials: true,
        });
        console.log("API 응답:", res);

        setRecipe(res.data);
      } catch (err) {
        console.error("레시피 상세 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [rcpId]);

  if (loading)
    return (
      <div className="app-wrap loading-screen">
        <div className="loading-card">
          <div className="loading-icon" />
          <p className="loading-text">레시피 불러오는 중이에요... 🍲</p>
          <p className="loading-sub">잠시만 기다려 주세요!</p>
        </div>
      </div>
    );
  if (!recipe)
    return (
      <div className="app-wrap">
        <div className="app">데이터 없음</div>
      </div>
    );

  return (
    <div className="app-wrap">
      <div className="app">
        {/* 헤더 (이미지 + 이름 + 하트) */}
        <div className="content-scroll recipe-detail-scroll">
          <RecipeDetailHeader
            recipeName={recipeName}
            image={recipe.mainImg}
            likes={isTrans ? undefined : recipe.likeCount}
            initLiked={isTrans ? undefined : recipe.liked}
            rcpId={isTrans ? undefined : rcpId}
            isTrans={isTrans}
            // rcpId={rcpId}
          />
          {/* 조리 정보 */}
          <RecipeDetailInfo
            time={recipe.time}
            servings={recipe.portion}
            level={recipe.level}
          />

          <RecipeDetailTabs activeTab={activeTab} onChange={setActiveTab} />
          {/* 탭별 내용 */}
          {activeTab === "재료" && (
            <RecipeDetailIngredients ingredients={recipe.ingredients || []} />
          )}
          {activeTab === "양념" && (
            <RecipeDetailSauces sauces={recipe.sauces || []} />
          )}
          {activeTab === "조리 순서" && (
            <div className="steps-list">
              {recipe.steps.map((s) => (
                <RecipeDetailStep
                  key={s.stepOrd}
                  step={s.stepOrd}
                  description={s.stepCont}
                  image={s.stepImg}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
