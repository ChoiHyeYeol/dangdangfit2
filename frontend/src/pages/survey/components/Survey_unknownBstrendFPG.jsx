// src/features/survey/Survey_unknownBstrendFPG.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/**
 * 설문조사 - FPG(공복혈당) "모를 때"
 */
export default function Survey_unknownBstrendFPG({
  prev = "/survey/basic-info",
  next = "/survey/bstrend/unknown-ppg",
  pageIndex = 2,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 수정 모드 여부
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // 상태 관리
  const [fpgFeel_unknown, setFpgFeel] = useState(""); // Likert 1~5
  const [exceedDays_unknown, setExceedDays] = useState(""); // 목표 초과 빈도
  const [nightSnack_unknown, setNightSnack] = useState(""); // 야식 빈도

  // 답변 완료 여부
  const isAllAnswered =
    fpgFeel_unknown && exceedDays_unknown && nightSnack_unknown;

  const goPrev = () => navigate(prev);

  // const goNext = () => {
  //   if (!isAllAnswered) return;
  //   navigate(next, {
  //     state: {
  //       fpg_known: false,
  //       fpgFeel_unknown,
  //       exceedDays_unknown,
  //       nightSnack_unknown,
  //       bstrend_fpg_unknown: {
  //         feel_likert: fpgFeel_unknown,
  //         exceed_days: exceedDays_unknown,
  //         night_snack: nightSnack_unknown,
  //       },
  //     },
  //   });
  // };

  // ✅ 서버 저장 + 다음 페이지 이동
  const goNext = async () => {
    if (!isAllAnswered) return;

    // 서버에 보낼 payload (백엔드 DTO 맞춤)
    const payload = {
      answer3: Number(fpgFeel_unknown),
      answer4: mapExceedDays(exceedDays_unknown),
      answer5: mapNightSnack(nightSnack_unknown),
    };

    try {
      await axios.post("/api/survey/bstrend/unknown-fpg", payload, {
        withCredentials: true,
      });
      // 저장 성공 후 다음 페이지 이동
      navigate(next, {
        state: {
          fpg_known: false,
          fpgFeel_unknown,
          exceedDays_unknown,
          nightSnack_unknown,
        },
      });
    } catch (err) {
      console.error("설문 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 수정 모드 저장
  const handleSaveAndBack = async () => {
    const payload = {
      answer3: Number(fpgFeel_unknown),
      answer4: mapExceedDays(exceedDays_unknown),
      answer5: mapNightSnack(nightSnack_unknown),
    };

    try {
      await axios.post("/api/survey/bstrend/unknown-fpg", payload, {
        withCredentials: true,
      });
      alert("공복 혈당(모름) 항목이 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // Likert scale
  const likertOptions = [
    "전혀 그렇지 않다",
    "그렇지 않다",
    "보통",
    "그렇다",
    "매우 그렇다",
  ];

  // 초과 빈도
  const exceedOptions = ["1일", "2 ~ 3일", "4 ~ 6일", "7일 이상", "모름"];

  // 야식 빈도
  const nightSnackOptions = [
    "없음",
    "주 1일",
    "주 2 ~ 3일",
    "주 4 ~ 5일",
    "거의 매일",
  ];

  // === 매핑 함수 (문자열 → 숫자) ===
  const mapExceedDays = (opt) => {
    switch (opt) {
      case "1일":
        return 1;
      case "2 ~ 3일":
        return 2;
      case "4 ~ 6일":
        return 3;
      case "7일 이상":
        return 4;
      case "모름":
        return 5;
      default:
        return 0;
    }
  };

  const mapNightSnack = (opt) => {
    switch (opt) {
      case "없음":
        return 1;
      case "주 1일":
        return 2;
      case "주 2 ~ 3일":
        return 3;
      case "주 4 ~ 5일":
        return 4;
      case "거의 매일":
        return 5;
      default:
        return 0;
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

        <h3 className={common.title}>3. 공복 혈당 사례를 선택해주세요.</h3>

        {/* 3-1. Likert scale */}
        <section className={common.section}>
          <p className={common.question}>
            3 - 1. 아침 공복 혈당이 높다고 느끼시나요?
          </p>
          <div className={common.optionsGrid}>
            {likertOptions.map((label, idx) => {
              const value = String(idx + 1);
              return (
                <button
                  key={label}
                  type="button"
                  className={`${common.optionBtn} ${
                    fpgFeel_unknown === value ? common.selected : ""
                  }`}
                  onClick={() => setFpgFeel(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3-2. 목표 초과 빈도 */}
        <section className={common.section}>
          <p className={common.question}>
            3 - 2. 최근 2주 간 공복 혈당 목표 초과 빈도를 선택해주세요.
          </p>
          <div className={common.optionsGrid}>
            {exceedOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  exceedDays_unknown === opt ? common.selected : ""
                }`}
                onClick={() => setExceedDays(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 3-3. 야식 빈도 */}
        <section className={common.section}>
          <p className={common.question}>
            3 - 3. 최근 2주 간 취침 전 취식·야식 빈도를 선택해주세요.
          </p>
          <div className={common.optionsGrid}>
            {nightSnackOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  nightSnack_unknown === opt ? common.selected : ""
                }`}
                onClick={() => setNightSnack(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 하단 네비게이션 */}
      <div className={common.bottomBar}>
        <div className={common.bottomInner}>
          {isEditMode ? (
            <>
              <button
                type="button"
                className={common.prevBtn}
                onClick={() => navigate(-1)}
              >
                취소
              </button>
              <button
                type="button"
                className={common.nextBtn}
                disabled={!isAllAnswered}
                onClick={handleSaveAndBack}
              >
                저장 후 돌아가기
              </button>
            </>
          ) : (
            <>
              <button type="button" className={common.prevBtn} onClick={goPrev}>
                이전
              </button>
              <button
                type="button"
                className={common.nextBtn}
                disabled={!isAllAnswered}
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
