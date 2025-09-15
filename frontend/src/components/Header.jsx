import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css"; // 스타일은 따로 분리

function Header({ title, onBack, className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = () => {
    if (location.pathname.startsWith("/recipe/category")) {
      // 카테고리 페이지 → 레시피 메인으로
      navigate("/recipe", { replace: true });
    } else if (location.pathname === "/recipe") {
      // 레시피 메인 → 홈으로
      navigate("/", { replace: true });
    } else if (location.pathname === "/recipe/search") {
      // 레시피 메인 → 홈으로
      navigate("/recipe", { replace: true });
    } else if (location.pathname === "/collection/trans") {
      // 레시피 메인 → 홈으로
      navigate("/my", { replace: true });
    } else if (location.pathname === "/transrecipe") {
      if (location.state?.from === "/main") {
        navigate("/main", { replace: true });
      } else if (location.state?.from) {
        // 검색이나 카테고리 같은 경우 → state.from으로 복귀
        navigate(location.state.from, { replace: true });
      } else {
        navigate("/recipe", { replace: true });
      }
    } else if (location.pathname === "/my/edit/update") {
      // 레시피 메인 → 홈으로
      navigate("/my", { replace: true });
    } else {
      // 그 외엔 일반 뒤로
      navigate(-1);
    }
  };
  return (
    <header className={`common-header ${className}`}>
      <button className="back-button" aria-label="뒤로가기" onClick={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="common-title">{title}</h1>
    </header>
  );
}

export default Header;
