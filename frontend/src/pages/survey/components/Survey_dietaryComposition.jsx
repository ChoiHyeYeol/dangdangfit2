// src/features/survey/Survey_dietaryComposition.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/**
 * 4. 식이 관련 통합 페이지
 * - Q4: 식이 구성 (중복 선택)
 * - Q5: 동시 섭취 습관 (Likert 1~5 단일 선택)
 * - Q6: 최근 2주 체중 변화 (단일 선택)
 */
export default function Survey_dietaryComposition({
  prev = "/survey/bstrend/unknown-ppg",
  next = "/survey/habits",
  pageIndex = 4,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // 수정 모드 여부: ?from=edit 또는 state.from === "edit"
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // Q4. 식이 구성 (중복)
  const [dietTags_dietCompose, setDietTags] = useState([]); // ✅ 제네릭 제거
  const dietOptions = [
    "흰쌀/흰빵",
    "면류",
    "잡곡/현미",
    "과일 잦음",
    "유제품 잦음",
    "디저트·당음료",
  ];

  const toggleDiet = (label) => {
    // ✅ 타입 표기 제거
    setDietTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  // Q5. 동시 섭취 습관 (Likert 단일)
  const [eatingHabit_dietCompose, setEatingHabit] = useState("");
  const likert = [
    { value: "1", label: "전혀 그렇지 않다" },
    { value: "2", label: "그렇지 않다" },
    { value: "3", label: "보통" },
    { value: "4", label: "그렇다" },
    { value: "5", label: "매우 그렇다" },
  ];

  // Q6. 최근 2주 체중 변화 (단일)
  const [weightChange_dietCompose, setWeightChange] = useState("");
  const weightOptions = [
    "감소/변동없음",
    "0.5kg",
    "0.6 ~ 1kg",
    "1 ~ 1.5kg",
    "1.6kg 이상",
  ];

  // === 매핑 함수 (문자열 → 숫자) ===
  const mapDiet = (opt) => {
    switch (opt) {
      case "흰쌀/흰빵":
        return 39;
      case "면류":
        return 40;
      case "잡곡/현미":
        return 41;
      case "과일 잦음":
        return 42;
      case "유제품 잦음":
        return 43;
      case "디저트·당음료":
        return 44;
      default:
        return 0;
    }
  };

  const mapWeight = (opt) => {
    switch (opt) {
      case "감소/변동없음":
        return 1;
      case "0.5kg":
        return 2;
      case "0.6 ~ 1kg":
        return 3;
      case "1 ~ 1.5kg":
        return 4;
      case "1.6kg 이상":
        return 5;
      default:
        return 0;
    }
  };

  // 다음/저장 버튼 활성
  const isNextEnabled = useMemo(
    () =>
      dietTags_dietCompose.length > 0 &&
      !!eatingHabit_dietCompose &&
      !!weightChange_dietCompose,
    [dietTags_dietCompose, eatingHabit_dietCompose, weightChange_dietCompose]
  );

  const goPrev = () => navigate(prev);
  // const goNext = () => {
  //   if (!isNextEnabled) return;
  //   navigate(next, {
  //     state: {
  //       diet_compose: dietTags_dietCompose,
  //       eating_habit_likert: eatingHabit_dietCompose,
  //       weight_change_2weeks: weightChange_dietCompose,
  //     },
  //   });
  // };

  // ✅ 서버 저장 후 다음 페이지
  const goNext = async () => {
    if (!isNextEnabled) return;

    const payload = {
      answer10: dietTags_dietCompose.map(mapDiet), // 배열
      answer11: Number(eatingHabit_dietCompose), // Likert
      answer12: mapWeight(weightChange_dietCompose),
    };

    try {
      await axios.post("/api/survey/diet/compose", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: {
          diet_compose: dietTags_dietCompose,
          eating_habit_likert: eatingHabit_dietCompose,
          weight_change_2weeks: weightChange_dietCompose,
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
      answer10: dietTags_dietCompose.map(mapDiet),
      answer11: Number(eatingHabit_dietCompose),
      answer12: mapWeight(weightChange_dietCompose),
    };

    try {
      await axios.post("/api/survey/diet/compose", payload, {
        withCredentials: true,
      });
      alert("식이 관련 항목이 저장되었습니다.");
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
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        {/* Q4. 식이 구성 */}
        <h3 className={common.title}>
          5. 식이 구성이 어떻게 되시나요?
          <br /> (중복선택가능)
        </h3>
        <section className={common.section}>
          <div className={common.optionsGrid}>
            {dietOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  dietTags_dietCompose.includes(opt) ? common.selected : ""
                }`}
                onClick={() => toggleDiet(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Q5. 동시 섭취 습관 */}
        <h3 className={common.title}>6. 동시 섭취 습관이 어떻게 되시나요?</h3>
        <p className={common.helperText}>
          한 끼에 여러 음식을 함께 섭취하는 경향이 있으신가요?
        </p>
        <p className={common.helperText}>
          (예: 주식+국/찜+면/탄수화물+단백질+지방을 한 번에)
        </p>
        <section className={common.section}>
          <div className={common.optionsGrid}>
            {likert.map((o) => (
              <button
                key={o.value}
                type="button"
                className={`${common.optionBtn} ${
                  eatingHabit_dietCompose === o.value ? common.selected : ""
                }`}
                onClick={() => setEatingHabit(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        {/* Q6. 최근 2주 체중 변화 */}
        <h3 className={common.title}>
          7. 최근 2주 간 체중 변화가 어떻게 되시나요?
        </h3>
        <section className={common.section}>
          <div className={common.optionsGrid}>
            {weightOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  weightChange_dietCompose === opt ? common.selected : ""
                }`}
                onClick={() => setWeightChange(opt)}
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
                disabled={!isNextEnabled}
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
