// src/pages/diet/Recipe.jsx
import React, { useEffect, useState } from "react";
import Header from "../../../src/components/Header"; // 공통 Header 컴포넌트
import SearchBar from "./components/SearchBar";
import TransBanner from "./components/TransBanner";
import SortBar from "./components/SortBar";
import CategoryList from "./components/CategoryList";
import url_image from "../../assets/bannerfood.png";
// import url_image2 from "../../assets/green.png";
import S from "../../assets/category/S.png";
import G from "../../assets/category/G.png";
import B from "../../assets/category/B.png";
import M from "../../assets/category/M.png";
import P from "../../assets/category/P.png";
import N from "../../assets/category/N.png";
import K from "../../assets/category/K.png";
import O from "../../assets/category/O.png";
import Break from "../../assets/category/break.png";
import Lunch from "../../assets/category/lunch.png";
import Dinner from "../../assets/category/dinner.png";
import Snack from "../../assets/category/snack.png";
import RecipeCarousel from "./components/RecipeCarousel";
import Footer from "../../components/Footer";
import "./recipe.css";
import axios from "axios";

// 카테고리 데이터 정의 (그대로)
// const menuCategories = [
//   { name: "채식", image: S },
//   { name: "구이", image: G },
//   { name: "국물", image: B },
//   { name: "무침", image: M },
//   { name: "볶음", image: P },
//   { name: "면/밥", image: N },
//   { name: "디저트", image: K },
//   { name: "기타", image: O },
// ];

const menuCategories = [
  { label: "채식", value: "양념", image: S },
  { label: "구이", value: "구이", image: G },
  { label: "국물", value: "국물", image: B },
  { label: "무침", value: "무침", image: M },
  { label: "볶음", value: "절임", image: P },
  { label: "면/밥", value: "면/밥", image: N },
  { label: "디저트", value: "제과제빵", image: K },
  { label: "기타", value: "기타", image: O },
];

const timeCategories = [
  { label: "아침", value: "아침", image: Break },
  { label: "점심", value: "점심", image: Lunch },
  { label: "저녁", value: "저녁", image: Dinner },
  { label: "간식", value: "간식", image: Snack },
];

// const TOP5_URL = "http://localhost:8086/api/recipe/top5"; // ✅ Spring 연결
const STORAGE_KEY = "recipeSortType"; // sessionStorage 키

const Recipe = () => {
  // ✅ 초기값을 sessionStorage에서 즉시 읽어와 설정 (깜빡임/리셋 방지)
  const [currentSortType, setCurrentSortType] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) || "방식별";
  });

  const [topRecipes, setTopRecipes] = useState([]); // ✅ 서버에서 받아올 top5
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ 선택 변경 시 상태 + sessionStorage 동기화
  const handleSortSelect = (option) => {
    setCurrentSortType(option);
    sessionStorage.setItem(STORAGE_KEY, option);
  };

  // (선택) 혹시 외부에서 값이 바뀌었을 때도 동기화하고 싶다면:
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved && saved !== currentSortType) {
      setCurrentSortType(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoriesToShow =
    currentSortType === "방식별" ? menuCategories : timeCategories;

  // ✅ top5 불러오기
  useEffect(() => {
    const fetchTop5 = async () => {
      try {
        const res = await axios.get("/api/recipe/top5", {
          withCredentials: true,
        });
        setTopRecipes(res.data);
      } catch (e) {
        console.error(e);
        setErr("인기 레시피를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTop5();
  }, []);

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="레시피" />
        <div className="content-scroll recipe-scroll">
          <div className="recipe-page-container">
            <SearchBar />
            <TransBanner />
            {/* ✅ 선택값은 내부에서 표시용으로만 쓰면 OK (SortBar는 수정 안 해도 됨) */}
            <SortBar onSelect={handleSortSelect} selected={currentSortType} />
            <CategoryList
              items={categoriesToShow}
              group={currentSortType === "시간별" ? "time" : "method"}
            />
            <div className="section-divider"></div>
            {/* ✅ 서버 연동 */}
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">불러오는 중...</p>
              </div>
            ) : err ? (
              <p className="error-text">{err}</p>
            ) : (
              <RecipeCarousel recipes={topRecipes} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Recipe;
