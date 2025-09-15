// src/features/survey/Survey_basicInfo.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

const OPTIONS = [
  { value: "none", label: "미측정" },
  { value: "smbg", label: "자가 혈당기" },
  { value: "cgm", label: "CGM" },
];

export default function Survey_basicInfo({ currentPage = 1, totalPages = 7 }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 수정 모드 여부
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // 입력 상태
  const [weightBefore, setWeightBefore] = useState("");
  const [weightAfter, setWeightAfter] = useState("");
  const [measureMethod, setMeasureMethod] = useState(""); // "none" | "smbg" | "cgm"

  // 유효성 검사
  const isWeightBeforeValid =
    weightBefore.trim() !== "" && !isNaN(Number(weightBefore));
  const isWeightAfterValid =
    weightAfter.trim() !== "" && !isNaN(Number(weightAfter));

  // 버튼 활성 조건
  const isNextEnabled = useMemo(
    () => isWeightBeforeValid && isWeightAfterValid && !!measureMethod,
    [isWeightBeforeValid, isWeightAfterValid, measureMethod]
  );

  const handlePrev = () => navigate("/survey/intro");

  // 설문 응답 전송
  const handleNext = async () => {
    if (!isNextEnabled) return;

    let answer2 = 0;
    if (measureMethod === "none") answer2 = 1;
    if (measureMethod === "smbg") answer2 = 2;
    if (measureMethod === "cgm") answer2 = 3;

    try {
      await axios.post(
        "/api/survey/basic-info",
        { answer2 },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("설문 저장 실패:", err);
      return;
    }

    navigate(
      measureMethod === "none"
        ? "/survey/bstrend/unknown-fpg"
        : "/survey/bstrend/fpg"
    );
  };

  // 수정 모드 저장 처리(예시)
  const handleSaveAndBack = () => {
    alert("기본 정보가 저장되었습니다.");
    navigate("/my/edit/update");
  };

  return (
    <div className={common.surveyContainer}>
      {/* 헤더 자리 */}
      <div className={common.headerPlaceholder} />

      {/* 본문(가운데 행만 스크롤) */}
      <div className={common.contentWrap}>
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {currentPage} / {totalPages}
          </div>
        )}

        <h3 className={common.guideText}>
          맞춤 식단 추천을 위한 <br />
          설문조사를 시작할게요!
        </h3>

        {/* 체중 입력 */}
        <p className={common.title}>1. 체중을 입력해주세요. (숫자만 입력)</p>
        <div className={common.section}>
          <label>임신 전 체중 (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={weightBefore}
            onChange={(e) => setWeightBefore(e.target.value)}
            placeholder="00"
            step="any"
            className={[
              common.inputField,
              !isWeightBeforeValid && weightBefore ? common.invalid : "",
            ]
              .join(" ")
              .trim()}
          />
          {!isWeightBeforeValid && weightBefore && (
            <div className={common.error}>
              유효하지 않은 입력입니다. 숫자만 입력해주세요.
            </div>
          )}
        </div>

        <div className={common.section}>
          <label>임신 후 체중 (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={weightAfter}
            onChange={(e) => setWeightAfter(e.target.value)}
            placeholder="00"
            step="any"
            className={[
              common.inputField,
              !isWeightAfterValid && weightAfter ? common.invalid : "",
            ]
              .join(" ")
              .trim()}
          />
          {!isWeightAfterValid && weightAfter && (
            <div className={common.error}>
              유효하지 않은 입력입니다. 숫자만 입력해주세요.
            </div>
          )}
        </div>

        {/* 혈당 측정 방식 */}
        <p className={common.title}>2. 혈당 측정 방법을 골라 주세요.</p>
        <p className={common.helperText}>CGM은 연속 혈당 측정기를 말합니다.</p>
        <div className={common.optionsGrid}>
          {OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMeasureMethod(value)}
              aria-pressed={measureMethod === value}
              className={[
                common.optionBtn,
                measureMethod === value ? common.selected : "",
              ]
                .join(" ")
                .trim()}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 푸터(마지막 행: 카드 하단 고정, 스크롤에도 가만히) */}
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
              <button className={common.prevBtn} onClick={handlePrev}>
                이전
              </button>
              <button
                className={common.nextBtn}
                disabled={!isNextEnabled}
                onClick={handleNext}
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
