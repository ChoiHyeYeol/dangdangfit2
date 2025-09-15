// src/features/survey/Survey_bstrendPPG.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import common from "./Survey_common.module.css";
import axios from "axios";

/** 설문조사 - PPG(식후 1시간) "알 때" */
export default function Survey_bstrendPPG({
  prev = "/survey/bstrend/fpg",
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

  // 4-1. 최근 2주 식후 1시간 평균 구간
  const [rangePpg_bstrend, setRangePpg] = useState("");

  // 4-2. 끼니별 상승 패턴 (Likert 1~5)
  const [ppgFeel_morning, setPpgFeelMorning] = useState(null);
  const [ppgFeel_lunch, setPpgFeelLunch] = useState(null);
  const [ppgFeel_dinner, setPpgFeelDinner] = useState(null);

  // 다음 버튼 활성화 조건
  const isNextActive_ppg = useMemo(
    () =>
      Boolean(
        rangePpg_bstrend && ppgFeel_morning && ppgFeel_lunch && ppgFeel_dinner
      ),
    [rangePpg_bstrend, ppgFeel_morning, ppgFeel_lunch, ppgFeel_dinner]
  );

  const goPrev = () => navigate(prev);

  // === 매핑 함수 (문자열 옵션 → 숫자) ===
  const mapRange = (opt) => {
    switch (opt) {
      case "<T_PPG1H-20":
        return 1;
      case "T_PPG1H -20 ~ -1":
        return 2;
      case "T_PPG1H ~ +20":
        return 3;
      case "T_PPG1H +20 이상":
        return 4;
      case "모름":
        return 5;
      default:
        return 0;
    }
  };

  // const handleNext = () => {
  //   if (!isNextActive_ppg) return;
  //   navigate(next, {
  //     state: {
  //       ppg_known: true,
  //       rangePpg_bstrend,
  //       ppgFeel: {
  //         morning: ppgFeel_morning,
  //         lunch: ppgFeel_lunch,
  //         dinner: ppgFeel_dinner,
  //       },
  //     },
  //   });
  // };

  // ✅ 서버 저장 + 다음 이동
  const handleNext = async () => {
    if (!isNextActive_ppg) return;

    const payload = {
      answer6: mapRange(rangePpg_bstrend), // 평균 구간
      answer7: Number(ppgFeel_morning), // 아침 Likert
      answer8: Number(ppgFeel_lunch), // 점심 Likert
      answer9: Number(ppgFeel_dinner), // 저녁 Likert
    };

    try {
      await axios.post("/api/survey/bstrend/ppg", payload, {
        withCredentials: true,
      });

      navigate(next, {
        state: {
          ppg_known: true,
          rangePpg_bstrend,
          ppgFeel: {
            morning: ppgFeel_morning,
            lunch: ppgFeel_lunch,
            dinner: ppgFeel_dinner,
          },
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
      answer6: mapRange(rangePpg_bstrend),
      answer7: Number(ppgFeel_morning),
      answer8: Number(ppgFeel_lunch),
      answer9: Number(ppgFeel_dinner),
    };

    try {
      await axios.post("/api/survey/bstrend/ppg", payload, {
        withCredentials: true,
      });
      alert("식후 혈당 수정이 저장되었습니다.");
      navigate("/my/edit/update");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };
  // 구간 선택 옵션
  const ppgRanges = [
    "<T_PPG1H-20",
    "T_PPG1H -20 ~ -1",
    "T_PPG1H ~ +20",
    "T_PPG1H +20 이상",
    "모름",
  ];

  // Likert 공통 옵션
  const likert = [
    { value: 1, label: "전혀 그렇지 않다" },
    { value: 2, label: "그렇지 않다" },
    { value: 3, label: "보통" },
    { value: 4, label: "그렇다" },
    { value: 5, label: "매우 그렇다" },
  ];

  return (
    <div className={common.surveyContainer}>
      {/* 헤더 자리만 확보 */}
      <div className={common.headerPlaceholder} />

      {/* 본문 */}
      <div className={common.contentWrap}>
        {/* 페이지 인디케이터 (수정 모드에서는 숨김) */}
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        {/* 상위 문항(타이틀 급) + 설명(가깝게) */}
        <h3 className={common.title}>4. 식후 혈당 사례를 선택해주세요.</h3>
        <p className={common.desc}>(전체 식사 평균 기준)</p>

        {/* 4-1. 평균 구간 */}
        <section className={common.section}>
          <p className={common.question}>
            4 - 1. 최근 2주 간 식후 1시간 평균 구간
          </p>
          <div className={common.optionsGrid}>
            {ppgRanges.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${common.optionBtn} ${
                  rangePpg_bstrend === opt ? common.selected : ""
                }`}
                onClick={() => setRangePpg(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 4-2. 끼니별 상승 패턴 */}
        <section className={common.section}>
          <p className={common.question}>4 - 2. 끼니별 상승 패턴</p>

          <div>
            <p className={common.question}>
              아침 식후 1시간이 높다고 느끼시나요?
            </p>
            <div className={common.optionsGrid}>
              {likert.map((o) => (
                <button
                  key={`m-${o.value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeel_morning === o.value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelMorning(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={common.question}>
              점심 식후 1시간이 높다고 느끼시나요?
            </p>
            <div className={common.optionsGrid}>
              {likert.map((o) => (
                <button
                  key={`l-${o.value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeel_lunch === o.value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelLunch(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={common.question}>
              저녁 식후 1시간이 높다고 느끼시나요?
            </p>
            <div className={common.optionsGrid}>
              {likert.map((o) => (
                <button
                  key={`d-${o.value}`}
                  type="button"
                  className={`${common.optionBtn} ${
                    ppgFeel_dinner === o.value ? common.selected : ""
                  }`}
                  onClick={() => setPpgFeelDinner(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
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
                disabled={!isNextActive_ppg}
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
                disabled={!isNextActive_ppg}
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
