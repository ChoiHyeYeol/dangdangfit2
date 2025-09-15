// src/features/survey/Survey_unknownBstrendPPG.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/**
 * 설문조사 - PPG(식후혈당) "모를 때"
 * - 4-1: 전체 평균 인지(1~5 Likert)
 * - 4-2: 끼니별 인지(아침/점심/저녁 각각 1~5 Likert)
 */
export default function Survey_unknownBstrendPPG({
  prev = "/survey/bstrend/unknown-fpg",
  next = "/survey/diet/compose",
  pageIndex = 3,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 수정 모드 여부: ?from=edit 또는 state.from === "edit"
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // 4-1 전체 평균 Likert (1~5)
  const [ppgFeel_unknown, setPpgFeel] = useState("");

  // 4-2 끼니별 Likert (1~5)
  const [ppgFeelBreakfast_unknown, setPpgFeelBreakfast] = useState("");
  const [ppgFeelLunch_unknown, setPpgFeelLunch] = useState("");
  const [ppgFeelDinner_unknown, setPpgFeelDinner] = useState("");

  // 다음 버튼 활성화: 네 값 모두 필요
  const isNextActive = useMemo(
    () =>
      Boolean(
        ppgFeel_unknown &&
          ppgFeelBreakfast_unknown &&
          ppgFeelLunch_unknown &&
          ppgFeelDinner_unknown
      ),
    [
      ppgFeel_unknown,
      ppgFeelBreakfast_unknown,
      ppgFeelLunch_unknown,
      ppgFeelDinner_unknown,
    ]
  );

  const goPrev = () => navigate(prev);

  // const goNext = () => {
  //   if (!isNextActive) return;
  //   navigate(next, {
  //     state: {
  //       ppg_known: false,
  //       bstrend_ppg_unknown: {
  //         // 4-1 전체 평균
  //         feel_likert: ppgFeel_unknown,
  //         // 4-2 끼니별
  //         perMeal: {
  //           breakfast: ppgFeelBreakfast_unknown,
  //           lunch: ppgFeelLunch_unknown,
  //           dinner: ppgFeelDinner_unknown,
  //         },
  //       },
  //     },
  //   });
  // };

  // ✅ 서버 저장 + 다음 페이지 이동
  const goNext = async () => {
    if (!isNextActive) return;

    const payload = {
      answer6: Number(ppgFeel_unknown),
      answer7: Number(ppgFeelBreakfast_unknown),
      answer8: Number(ppgFeelLunch_unknown),
      answer9: Number(ppgFeelDinner_unknown),
    };

    try {
      await axios.post("/api/survey/bstrend/unknown-ppg", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: {
          ppg_known: false,
          bstrend_ppg_unknown: {
            feel_likert: ppgFeel_unknown,
            perMeal: {
              breakfast: ppgFeelBreakfast_unknown,
              lunch: ppgFeelLunch_unknown,
              dinner: ppgFeelDinner_unknown,
            },
          },
        },
      });
    } catch (err) {
      console.error("설문 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 수정 모드 저장 처리
  const handleSaveAndBack = async () => {
    const payload = {
      answer6: Number(ppgFeel_unknown),
      answer7: Number(ppgFeelBreakfast_unknown),
      answer8: Number(ppgFeelLunch_unknown),
      answer9: Number(ppgFeelDinner_unknown),
    };

    try {
      await axios.post("/api/survey/bstrend/unknown-ppg", payload, {
        withCredentials: true,
      });
      alert("식후 혈당(모름) 항목이 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // Likert 옵션
  const likertOptions = [
    "전혀 그렇지 않다",
    "그렇지 않다",
    "보통",
    "그렇다",
    "매우 그렇다",
  ];

  // 서브 질문 라벨 스타일
  const subLabelStyle = {
    color: "#313030ff",
    fontWeight: 700,
    margin: "12px 0 6px",
  };

  return (
    <div className={common.surveyContainer}>
      {/* 헤더 자리 확보 */}
      <div className={common.headerPlaceholder} />

      {/* 본문 */}
      <div className={common.contentWrap}>
        {/* 페이지 인디케이터 (수정 모드에서는 숨김) */}
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        {/* 타이틀/설명 */}
        <h3 className={common.title}>4. 식후 혈당 사례를 선택해주세요.</h3>
        <p className={common.desc}>(전체 식사 평균 기준)</p>

        {/* 4-1. 식후 혈당 "전체 평균" 인지 */}
        <section className={common.section}>
          <p className={common.question}>
            4 - 1. 식후 1시간 후에 혈당이 급상승한다고 느끼시나요?
          </p>
          <div className={common.optionsGrid}>
            {likertOptions.map((label, idx) => {
              const value = String(idx + 1);
              return (
                <button
                  key={label}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeel_unknown === value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeel(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4-2. 끼니별 혈당 상승 패턴 */}
        <section className={common.section}>
          <p className={common.question}>
            4 - 2 끼니별 혈당 상승 패턴을 골라주세요
          </p>

          {/* 아침 */}
          <p style={subLabelStyle}>아침 식후 1시간이 높다고 느끼시나요?</p>
          <div className={common.optionsGrid}>
            {likertOptions.map((label, idx) => {
              const value = String(idx + 1);
              return (
                <button
                  key={`b-${value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeelBreakfast_unknown === value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelBreakfast(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 점심 */}
          <p style={subLabelStyle}>점심 식후 1시간이 높다고 느끼시나요?</p>
          <div className={common.optionsGrid}>
            {likertOptions.map((label, idx) => {
              const value = String(idx + 1);
              return (
                <button
                  key={`l-${value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeelLunch_unknown === value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelLunch(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 저녁 */}
          <p style={subLabelStyle}>저녁 식후 1시간이 높다고 느끼시나요?</p>
          <div className={common.optionsGrid}>
            {likertOptions.map((label, idx) => {
              const value = String(idx + 1);
              return (
                <button
                  key={`d-${value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeelDinner_unknown === value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelDinner(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 하단 네비게이션 */}
      <div className={common.bottomBar}>
        <div className={common.bottomInner}>
          {isEditMode ? (
            <>
              <button className={common.prevBtn} onClick={() => navigate(-1)}>
                취소
              </button>
              <button
                className={common.nextBtn}
                disabled={!isNextActive}
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
                disabled={!isNextActive}
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
