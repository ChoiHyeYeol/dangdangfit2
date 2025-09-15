import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/search-icon.png"; // 아이콘 경로
import "./SearchBar.css";

function SearchBar({ initialKeyword = "" }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const navigate = useNavigate();

  // ✅ initialKeyword가 바뀔 때 state도 동기화
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return; // 빈값 무시
    navigate(`/recipe/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="찾고 싶은 레시피를 입력해보세요!"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {keyword && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => setKeyword("")}
        >
          x
        </button>
      )}
      <button type="submit" className="search-icon">
        <img src={searchIcon} alt="검색" />
      </button>
    </form>
  );
}

export default SearchBar;
