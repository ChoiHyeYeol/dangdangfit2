// src/features/survey/Survey_dietPreference.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import styles from "./Survey_dietPreference.module.css";
import axios from "axios";

// 이미지 한 번에 모듈에서 가져오기
import {
  meal,
  meal_active,
  simpleMeal,
  simpleMeal_active,
} from "../survey_images/Survey_images";

export default function Survey_dietPreference({
  prev = "/survey/habits",
  next = "/survey/allergy",
  pageIndex = 6,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 수정 모드 여부: ?from=edit 또는 state.from === "edit"
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  const [dietPref, setDietPref] = useState("");

  const isNextEnabled = useMemo(() => !!dietPref, [dietPref]);

  const options = [
    {
      key: "간단식",
      label: "간단식",
      img: simpleMeal,
      imgActive: simpleMeal_active,
    },
    { key: "일반식", label: "일반식", img: meal, imgActive: meal_active },
  ];

  const goPrev = () => navigate(prev);

  // === 매핑 함수 ===
  const mapDietPref = (opt) => {
    switch (opt) {
      case "간단식":
        return 1;
      case "일반식":
        return 2;
      default:
        return 0;
    }
  };
  // const goNext = () => {
  //   if (!isNextEnabled) return;
  //   navigate(next, { state: { diet_preference: dietPref } });
  // };

  // ✅ 서버 저장 + 다음 페이지 이동
  const goNext = async () => {
    if (!isNextEnabled) return;

    const payload = {
      answer15: mapDietPref(dietPref),
    };

    try {
      await axios.post("/api/survey/meal/preference", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: { diet_preference: dietPref },
      });
    } catch (err) {
      console.error("설문 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 수정 모드 저장 처리
  const handleSaveAndBack = async () => {
    const payload = {
      answer15: mapDietPref(dietPref),
    };

    try {
      await axios.post("/api/survey/meal/preference", payload, {
        withCredentials: true,
      });
      alert("식단 선호가 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={common.surveyContainer}>
      <div className={common.headerPlaceholder} />
      <div className={common.contentWrap}>
        {/* 페이지 인디케이터 (수정 모드에서는 숨김) */}
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        <h3 className={common.title}>10. 어떤 식단을 선호하시나요?</h3>

        <div className={styles.cardGrid}>
          {options.map((opt) => {
            const active = dietPref === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                className={`${styles.cardBtn} ${active ? styles.active : ""}`}
                onClick={() => setDietPref(opt.key)}
              >
                <img
                  src={active ? opt.imgActive : opt.img}
                  alt={opt.label}
                  className={styles.cardImage}
                />
                <p className={styles.cardLabel}>{opt.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className={common.bottomBar}>
        <div className={common.bottomInner}>
          {isEditMode ? (
            <>
              <button className={common.prevBtn} onClick={() => navigate(-1)}>
                취소
              </button>
              <button
                className={common.nextBtn}
                disabled={!isNextEnabled}
                onClick={handleSaveAndBack}
              >
                저장 후 돌아가기
              </button>
            </>
          ) : (
            <>
              <button className={common.prevBtn} onClick={goPrev}>
                이전
              </button>
              <button
                className={common.nextBtn}
                disabled={!isNextEnabled}
                onClick={goNext}
              >
                다음
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
