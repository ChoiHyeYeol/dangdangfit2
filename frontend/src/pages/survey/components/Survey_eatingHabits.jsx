// src/features/survey/Survey_eatingHabits.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/**
 * 5. 식습관 관련 질문
 * - Q7: 최근 2주 식사량/야식 변화
 * - Q8: 인슐린 투약 여부 및 종류/투약 시간대
 */
export default function Survey_eatingHabits({
  prev = "/survey/diet/compose",
  next = "/survey/meal/preference",
  pageIndex = 5,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 수정 모드 여부: ?from=edit 또는 state.from === "edit"
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  // Q7. 최근 2주 식사량/야식 변화
  const [mealChange_habits, setMealChange] = useState("");
  const mealChangeOptions = ["매우 감소", "감소", "보통", "증가", "매우 증가"];

  // Q8. 인슐린 투약 여부 및 종류
  const [insulinType_habits, setInsulinType] = useState("");
  const [insulinTime_habits, setInsulinTime] = useState("");

  const insulinOptions = ["없음", "인슐린", "경구약", "둘다"];

  // 버튼 활성 조건
  const isNextEnabled = useMemo(() => {
    if (!mealChange_habits) return false;
    if (insulinType_habits === "없음") return true;
    if (insulinType_habits) return insulinTime_habits.trim() !== "";
    return false;
  }, [mealChange_habits, insulinType_habits, insulinTime_habits]);

  const goPrev = () => navigate(prev);

  // === 매핑 함수 ===
  const mapMealChange = (opt) => {
    switch (opt) {
      case "매우 감소":
        return 1;
      case "감소":
        return 2;
      case "보통":
        return 3;
      case "증가":
        return 4;
      case "매우 증가":
        return 5;
      default:
        return 0;
    }
  };

  const mapInsulinType = (opt) => {
    switch (opt) {
      case "없음":
        return 1;
      case "인슐린":
        return 2;
      case "경구약":
        return 3;
      case "둘다":
        return 4;
      default:
        return 0;
    }
  };

  // const goNext = () => {
  //   if (!isNextEnabled) return;
  //   navigate(next, {
  //     state: {
  //       meal_change_2weeks: mealChange_habits,
  //       insulin_type: insulinType_habits,
  //       insulin_time: insulinTime_habits,
  //     },
  //   });
  // };

  // ✅ 서버 저장 + 다음 페이지 이동
  const goNext = async () => {
    if (!isNextEnabled) return;

    const payload = {
      answer13: mapMealChange(mealChange_habits),
      answer14: mapInsulinType(insulinType_habits),
    };

    try {
      await axios.post("/api/survey/habits", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: {
          meal_change_2weeks: mealChange_habits,
          insulin_type: insulinType_habits,
          insulin_time: insulinTime_habits, // DB에 없지만 state 유지
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
      answer13: mapMealChange(mealChange_habits),
      answer14: mapInsulinType(insulinType_habits),
    };

    try {
      await axios.post("/api/survey/habits", payload, {
        withCredentials: true,
      });
      alert("식습관 관련 항목이 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

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

        {/* ===== Q7 ===== */}
        <h3 className={common.title}>
          8. 최근 2주 간 식사량이 변화했거나 야식이 증가했나요?
        </h3>
        <section className={common.section}>
          <div className={common.optionsGrid}>
            {mealChangeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  mealChange_habits === opt ? common.selected : ""
                }`}
                onClick={() => setMealChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* ===== Q8 ===== */}
        <h3 className={common.title}>
          9. 인슐린을 투약하시나요? <br />
          투약하신다면 어떤 종류인가요?
        </h3>
        <section className={common.section}>
          <div className={common.optionsGrid}>
            {insulinOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  insulinType_habits === opt ? common.selected : ""
                }`}
                onClick={() => setInsulinType(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* 인슐린/경구약 선택 시만 시간대 입력 */}
          {insulinType_habits !== "" && insulinType_habits !== "없음" && (
            <div style={{ marginTop: "12px" }}>
              <label className={common.helperText}>
                투약 시간대를 입력해주세요.
              </label>
              <input
                type="text"
                value={insulinTime_habits}
                onChange={(e) => setInsulinTime(e.target.value)}
                placeholder="예: 아침 식전, 저녁 식후"
                className={common.inputField}
              />
            </div>
          )}
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
