// src/pages/recipe/SearchResult.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import SearchBar from "../SearchBar";
import url_image2 from "../../../../assets/green.png"; // 임시 이미지
import "./SearchResult.css";
// import RecipeCard from "../../../../components/RecipeCard";
import RecipeGrid from "../RecipeCategoryPage/RecipeGrid";
import axios from "axios";

// const dummyRecipes = [
//   {
//     id: 1,
//     name: "저당 시금치 나물",
//     time: "10분",
//     servings: "3인분",
//     level: "초급",
//     image: url_image2,
//   },
//   { id: 2, name: "콩국수", tags: "#여름요리", image: url_image2 },
//   {
//     id: 3,
//     name: "콩나물저당무침",
//     time: "10분",
//     servings: "3인분",
//     level: "초급",
//     image: url_image2,
//   },
//   {
//     id: 4,
//     name: "시금치 나물",
//     time: "10분",
//     servings: "3인분",
//     level: "초급",
//     image: url_image2,
//   },
// ];

function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword") || "";

  // 임시 조건: "저당"만 결과 있음
  // const hasResult = keyword === "저당";
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [top5, setTop5] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/recipe/search`, {
          params: { query: keyword },
          withCredentials: true,
        });
        setRecipes(res.data || []);
      } catch (err) {
        console.error("검색 실패:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [keyword]);

  /* 연관검색어 추출 (단순히 레시피 이름 기반으로 함) */
  const relatedKeywords = React.useMemo(() => {
    const words = new Set();
    recipes.forEach((r) => {
      if (r.rcpNm) {
        r.rcpNm
          .replace(/[^\w가-힣 ]/g, " ") // 특수문자 제거
          .split(/\s+/)
          .forEach((w) => {
            if (
              w.length > 1 && // 한 글자 제외
              w !== keyword
            ) {
              words.add(w);
            }
          });
      }
    });
    return Array.from(words).slice(0, 4); // 최대 4개만 노출
  }, [recipes, keyword]);

  // 검색 결과 없을때 Top5 불러오기
  useEffect(() => {
    const fetchTop5 = async () => {
      try {
        const res = await axios.get("/api/recipe/top5", {
          withCredentials: true,
        });
        setTop5(res.data || []);
      } catch (err) {
        console.error("Top5 불러오기 실패:", err);
        setTop5([]);
      }
    };

    fetchTop5();
  }, []);

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="검색" />
        <SearchBar initialKeyword={keyword} />
        <div className="content-scroll">
          {/* 로딩 중 */}
          {loading && <p className="loading-text">검색 중입니다...</p>}

          {/* 검색 결과 없음 */}
          {!loading && recipes.length === 0 && (
            <div className="empty-result">
              <div className="empty-icon">
                <span>!</span>
              </div>
              <p className="empty-title">검색 결과가 없습니다.</p>
              <p className="empty-desc">
                원하는 결과를 찾지 못했다면
                <br />
                레시피를 추가해 저당 레시피로 변환해 보세요
              </p>
              <button
                className="empty-btn"
                onClick={() =>
                  navigate("/transrecipe", {
                    state: { from: location.pathname + location.search },
                  })
                }
              >
                외부 레시피 변환하기
              </button>

              {/* ✅ 인기 레시피 4개 추천 */}
              {top5.length > 0 && (
                <>
                  <h3 className="recommend-title">이 레시피는 어떠세요?</h3>
                  <div className="recommend-list">
                    <RecipeGrid items={top5.slice(0, 4)} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* 검색 결과 있음 */}
          {!loading && recipes.length > 0 && (
            <div className="result-section">
              {/* 연관 태그 (프론트에서 처리) */}
              {relatedKeywords.length > 0 && (
                <div className="related-tags">
                  <span className="tag-label">연관</span>
                  {relatedKeywords.map((tag, idx) => (
                    <button
                      key={idx}
                      className="tag-btn"
                      onClick={() =>
                        navigate(
                          `/recipe/search?keyword=${encodeURIComponent(tag)}`
                        )
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* ✅ 구분선 */}
              {/* <div className="result-divider"></div> */}

              {/* 검색 결과 리스트 */}
              <RecipeGrid items={recipes} highlight={keyword} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
