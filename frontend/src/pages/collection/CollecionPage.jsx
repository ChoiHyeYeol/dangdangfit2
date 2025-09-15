// src/pages/collection/CollectionPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import img from "../../assets/green.png";
import CollectionTabs from "./components/CollectionTabs";
import CollectionItem from "./components/CollectionItems";
import "./CollectionPage.css";
import axios from "axios";

export default function Collection() {
  const location = useLocation();
  const isTrans = location.pathname.includes("trans");

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ 공통 axios 인스턴스 (쿠키 포함)
  const client = axios.create({ withCredentials: true });

  // ✅ 서버에서 찜/변환 목록 불러오기
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setErr("");
      try {
        const category = isTrans ? "trans" : "recipe"; // 분기
        const res = await client.post("/api/my/recipe", { category });
        setCollections(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("목록 불러오기 실패:", e);
        setErr("목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrans]);

  // ✅ 찜 토글 → 서버에도 반영 (키 이름 rcpId 로 통일)
  const handleToggleLike = async (rcpId) => {
    try {
      const res = await client.post("/api/recipe/like", { rcpId });
      const { liked, likeCount } = res.data || {};
      setCollections((prev) =>
        prev.map((item) =>
          item.rcpId === rcpId ? { ...item, liked, likeCount } : item
        )
      );
    } catch (e) {
      console.error("찜 토글 실패:", e);
      alert("찜 처리 실패");
    }
  };

  // ✅ 변환 레시피: 삭제 (키 이름 rcpId 로 통일)
  const handleDeleteTrans = async (rcpId) => {
    try {
      await client.post("/api/recipe/delete", { rcpId });
      setCollections((prev) => prev.filter((item) => item.rcpId !== rcpId));
    } catch (e) {
      console.error("변환 레시피 삭제 실패:", e);
      alert("삭제 실패");
    }
  };

  const handleClearAll = () => {
    setCollections([]);
  };

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="나의 레시피" />
        <CollectionTabs />

        <div className="content-scroll">
          {loading ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
              }}
            >
              불러오는 중...
            </p>
          ) : err ? (
            <p style={{ color: "red", textAlign: "center" }}>{err}</p>
          ) : (
            <>
              <div className="collection-header">
                <span className="collection-count">
                  전체 {collections.length}개
                </span>
                <button
                  className="collection-clear-btn"
                  onClick={handleClearAll}
                >
                  {isTrans ? "전체삭제" : "전체해제"}
                </button>
              </div>

              <div className="collection-list">
                {collections.map((recipe) => (
                  <CollectionItem
                    key={recipe.rcpId}
                    recipe={{
                      id: recipe.rcpId,
                      name: recipe.rcpNm,
                      image: recipe.mainImg || img,
                      time: recipe.time,
                      servings: recipe.portion,
                      level: recipe.level,
                      liked: recipe.liked,
                    }}
                    isTrans={isTrans}
                    onRemove={() => handleDeleteTrans(recipe.rcpId)}
                    onToggleLike={
                      !isTrans
                        ? () => handleToggleLike(recipe.rcpId)
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
