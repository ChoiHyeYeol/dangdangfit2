// src/pages/recipe/RecipeCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../../../components/Header"; // 공통 헤더
import CategoryTabs from "./CategoryTabs";
import CategorySortBar from "./CategorySortBar";
import RecipeGrid from "./RecipeGrid";
import img from "../../../../assets/green.png";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
// import "../diet/recipe.css"; // app-wrap, app, content-scroll 스타일 재사용

// 카테고리별 예시 데이터 (임시, 나중에 API로 교체 가능)
// const RECIPES = {
//   양념: [
//     {
//       id: 1,
//       name: "마늘 양념구이",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 2,
//       name: "간장 치킨",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 3,
//       name: "간 치킨",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 4,
//       name: "간 치킨",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 5,
//       name: "간 치킨",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 6,
//       name: "간 치킨",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//   ],
//   구이: [
//     {
//       id: 3,
//       name: "버섯 구이",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 4,
//       name: "고등어 구이",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//   ],
//   아침: [
//     {
//       id: 5,
//       name: "오트밀 팬케이크",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 6,
//       name: "샌드위치",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//   ],
//   점심: [
//     {
//       id: 7,
//       name: "비빔밥",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//     {
//       id: 8,
//       name: "김치찌개",
//       image: img,
//       time: "10분",
//       servings: "3인분",
//       level: "초급",
//     },
//   ],
// };

export default function RecipeCategoryPage() {
  // URL의 /recipe/category/:categoryName 에서 값 읽기
  const { categoryName } = useParams();
  const location = useLocation();
  const active = decodeURIComponent(categoryName);
  const [sort, setSort] = useState("추천순");
  // const nav = useNavigate();

  // ✅ 현재 카테고리에 맞는 음식 목록
  // const items = RECIPES[active] || [];

  // ✅ 쿼리스트링에서 group 읽기 (time or method)
  const searchParams = new URLSearchParams(location.search);
  const group = searchParams.get("group") || "method";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const activeLabel = decodeURIComponent(categoryName);
  const mapping = {
    채식: "양념",
    구이: "구이",
    국물: "국물",
    무침: "무침",
    볶음: "절임",
    "면/밥": "면/밥",
    디저트: "제과제빵",
    기타: "기타",

    아침: "아침",
    점심: "점심",
    저녁: "저녁",
    간식: "간식",
  };

  const serverCategory = mapping[activeLabel] || activeLabel;
  // const activeLabel = mapping[active] || active;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get("/api/recipe/subList", {
          params: {
            recipeMethod: group, // "time" or "method"
            recipeCategory: serverCategory, // "아침", "구이" 등
          },
          withCredentials: true, // 세션 유지
        });
        setItems(res.data || []);
      } catch (e) {
        console.error("카테고리 레시피 불러오기 실패:", e);
        setErr("레시피를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [group, serverCategory]);

  return (
    <div className="app-wrap">
      <div className="app">
        {/* ✅ 헤더 제목이 선택된 카테고리명 */}
        <Header
          title={activeLabel}
          // onBack={() => nav("/recipe", { replace: true })}
        />
        <CategoryTabs active={activeLabel} />
        <CategorySortBar selected={sort} onChange={setSort} />
        <div className="content-scroll">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                fontSize: "16px",
                fontWeight: "600",
                color: "#008A69",
                gap: "10px",
              }}
            >
              <FaSpinner className="spin" />
              불러오는 중...
            </div>
          ) : err ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                fontSize: "16px",
                fontWeight: "600",
                color: "red",
              }}
            >
              {err}{" "}
            </div>
          ) : (
            <RecipeGrid items={items} />
          )}
        </div>
      </div>
    </div>
  );
}
