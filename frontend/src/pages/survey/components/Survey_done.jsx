// src/features/survey/Survey_done.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Survey_introDone.module.css";
import { endImg, bg } from "../survey_images/Survey_images";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
// import Lottie from "lottie-react"; // 추가
// import foodLoading from "../../../assets/lottie/food_loading_green.json";

export default function Survey_done({
  next = "/main",
  cta_text = "메인으로가기",
}) {
  const [loading, setLoading] = useState(true); // ✅ 항상 처음엔 로딩
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const calledRef = useRef(false); // ✅ 중복 호출 방지
  // const isAnalyzing = location.state?.analyzing === true;

  // const [loading, setLoading] = useState(isAnalyzing);
  // const [done, setDone] = useState(!isAnalyzing);

  useEffect(() => {
    const analyze = async () => {
      if (calledRef.current) return; // 두 번째 마운트 시 스킵
      calledRef.current = true;

      try {
        await axios.get("/api/survey/done", { withCredentials: true });
        setDone(true); // ✅ 분석 완료 → done화면으로 전환
      } catch (err) {
        console.error("🚨 식단 분석 실패:", err);
        alert("식단 분석에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };
    analyze();
  }, []);

  return (
    <div className={`${styles.surveyContainer} ${styles.done}`}>
      {/* 배경 */}
      <div
        className={styles.bgWrapper}
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden={true}
      />

      {/* 상단 그룹 (이미지는 항상 보여줌) */}
      <div className={styles.topGroup}>
        <img className={styles.heroImg} src={endImg} alt="설문 완료" />

        {loading ? (
          <>
            <FaSpinner
              className="spin"
              style={{ fontSize: "32px", color: "#008a69", marginTop: "40px" }}
            />
            <p
              style={{
                marginTop: "20px",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              설문조사 결과를 바탕으로 <br />
              맞춤형 식단을 분석중입니다...
            </p>
          </>
        ) : (
          <>
            <p className={styles.titleMain} style={{ marginTop: "40px" }}>
              식단 분석이 <br /> 완료됐어요!
            </p>
            <button
              type="button"
              className={styles.ctaBtn}
              onClick={() => navigate(next)}
            >
              {cta_text}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
