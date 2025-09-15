import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./transrecipe.css";
import Header from "../../../components/Header";

export default function TransRecipe() {
  const nav = useNavigate();
  const [url, setUrl] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const clean = (url || "").trim();
    if (!clean) return;
    nav("/transrecipe/loading", { state: { url: clean } });
  };

  const isValid = url.trim().startsWith("http");

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="" className="trp-header" />
        <div className="trp-screen">
          {/* 상단 텍스트 */}
          <p className="trp-desc">
            변환하고 싶은 레시피가 담긴 <br /> 링크를 입력하세요!
          </p>

          {/* 입력창 */}
          <form className="trp-form" onSubmit={onSubmit}>
            <div className="trp-input-wrap">
              <input
                className="trp-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <label className="trp-placeholder">
                만개의 레시피 주소를 입력하세요
              </label>
            </div>

            {/* 버튼 */}
            <button
              type="submit"
              className={`trp-submit ${isValid ? "active" : ""}`}
              disabled={!isValid}
            >
              변환하기
            </button>
          </form>

          {/* 버튼 */}
        </div>
      </div>
    </div>
  );
}
