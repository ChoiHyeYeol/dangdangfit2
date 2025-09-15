// src/features/survey/Survey_bstrendFPG.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/** 설문조사 - FPG(공복혈당) "알 때" */
export default function Survey_bstrendFPG({
  prev = "/survey/basic-info",
  next = "/survey/bstrend/ppg",
  pageIndex = 2,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // 수정 모드 여부 확인
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // 3-1. 최근 2주 공복혈당 평균 구간
  const [rangeFpg_bstrend, setRangeFpg] = useState("");
  // 3-2. 목표 초과 빈도
  const [exceedDays_bstrend, setExceedDays] = useState("");
  // 3-3. 취침 전 취식/야식
  const [eatSleep_bstrend, seteatSleep] = useState("");

  const isNextActive_fpg = useMemo(
    () => Boolean(rangeFpg_bstrend && exceedDays_bstrend && eatSleep_bstrend),
    [rangeFpg_bstrend, exceedDays_bstrend, eatSleep_bstrend]
  );

  const goPrev = () => navigate(prev);

  // === 매핑 함수 (문자열 → 숫자) ===
  const mapRange = (opt) => {
    switch (opt) {
      case "< T_FPG -15":
        return 1;
      case "T_FPG -15 ~ -1":
        return 2;
      case "T_FPG ~ +10":
        return 3;
      case "T_FPG +10 이상":
        return 4;
      case "모름":
        return 5;
      default:
        return 0;
    }
  };

  const mapExceed = (opt) => {
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

  const mapEatSleep = (opt) => {
    switch (opt) {
      case "없음":
        return 1;
      case "주 1일":
        return 2;
      case "주2 ~ 3일":
        return 3;
      case "주4 ~ 5일":
        return 4;
      case "거의 매일":
        return 5;
      default:
        return 0;
    }
  };

  // const handleNext = () => {
  //   if (!isNextActive_fpg) return;
  //   navigate(next, {
  //     state: {
  //       fpg_known: true,
  //       rangeFpg_bstrend,
  //       exceedDays_bstrend,
  //       eatSleep_bstrend,
  //       bstrend_fpg: {
  //         range: rangeFpg_bstrend,
  //         exceed_days: exceedDays_bstrend,
  //         eat_sleep: eatSleep_bstrend,
  //       },
  //     },
  //   });
  // };

  // ✅ 서버 저장 + 다음 페이지 이동
  const handleNext = async () => {
    if (!isNextActive_fpg) return;

    const payload = {
      answer3: mapRange(rangeFpg_bstrend),
      answer4: mapExceed(exceedDays_bstrend),
      answer5: mapEatSleep(eatSleep_bstrend),
    };

    try {
      await axios.post("/api/survey/bstrend/fpg", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: {
          fpg_known: true,
          rangeFpg_bstrend,
          exceedDays_bstrend,
          eatSleep_bstrend,
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
      answer3: mapRange(rangeFpg_bstrend),
      answer4: mapExceed(exceedDays_bstrend),
      answer5: mapEatSleep(eatSleep_bstrend),
    };

    try {
      await axios.post("/api/survey/bstrend/fpg", payload, {
        withCredentials: true,
      });
      alert("공복혈당 수정이 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const fpgRanges = [
    "< T_FPG -15",
    "T_FPG -15 ~ -1",
    "T_FPG ~ +10",
    "T_FPG +10 이상",
    "모름",
  ];
  const exceedOptions = ["1일", "2 ~ 3일", "4 ~ 6일", "7일 이상", "모름"];
  const eatSleep = ["없음", "주 1일", "주2 ~ 3일", "주4 ~ 5일", "거의 매일"];

  return (
    <div className={common.surveyContainer}>
      {/* 헤더 자리 */}
      <div className={common.headerPlaceholder} />

      <div className={common.contentWrap}>
        {/* 페이지 인디케이터 (수정 모드에서는 숨김) */}
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        <h3 className={common.title}>3. 공복 혈당 사례를 선택해주세요.</h3>
        <p className={common.helperText}>(최근 2주 기준)</p>

        {/* 3-1. 평균 구간 */}
        <section className={common.section}>
          <p className={common.question}>3 - 1. 평균 구간을 골라주세요.</p>
          <div className={common.optionsGrid}>
            {fpgRanges.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  rangeFpg_bstrend === opt ? common.selected : ""
                }`}
                onClick={() => setRangeFpg(opt)}
              >
                {opt}
              </button>
            ))}
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
                  exceedDays_bstrend === opt ? common.selected : ""
                }`}
                onClick={() => setExceedDays(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 3-3. 취침 전 취식/야식 빈도 */}
        <section className={common.section}>
          <p className={common.question}>
            3 - 3. 최근 2주 취침 전 취식/야식 빈도를 선택해주세요.
          </p>
          <div className={common.optionsGrid}>
            {eatSleep.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  eatSleep_bstrend === opt ? common.selected : ""
                }`}
                onClick={() => seteatSleep(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 하단 버튼 */}
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
                onClick={handleSaveAndBack}
                disabled={!isNextActive_fpg}
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
                onClick={handleNext}
                disabled={!isNextActive_fpg}
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
