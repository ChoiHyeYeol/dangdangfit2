// src/features/survey/Survey_intro.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Survey_introDone.module.css";
import { startImg, bg } from "../survey_images/Survey_images";

export default function Survey_intro({ next = "../basic-info" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => {
      document.body.style.overflow = originalOverflow || "auto";
      clearTimeout(timer);
    };
  }, []);

  const goNext = () => navigate(next);

  return (
    <div className={`${styles.surveyContainer} ${styles.intro}`}>
      {/* 배경 */}
      <div
        className={styles.bgWrapper}
        style={{
          backgroundImage: `url(${bg})`,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
        aria-hidden={true}
      />

      {/* 이미지 + 타이틀 묶음 (Done과 동일 구조) */}
      <div className={styles.topGroup}>
        <img src={startImg} alt="설문 시작" className={styles.heroImg} />
        <p className={styles.titleMain}>
          맞춤 식단 <br /> 설문조사
        </p>
      </div>

      {/* 버튼 */}
      <button
        type="button"
        className={styles.ctaBtn}
        onClick={goNext}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") goNext();
        }}
      >
        시작하기
      </button>
    </div>
  );
}
