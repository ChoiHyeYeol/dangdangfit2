// src/features/survey/Survey.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 단계별 컴포넌트
import SurveyIntro from "./components/Survey_intro.jsx";
import Survey_basicInfo from "./components/Survey_basicInfo.jsx";

// (기계 있음) 분기
import SurveyBstrendFPG from "./components/Survey_bstrendFPG.jsx";
import SurveyBstrendPPG from "./components/Survey_bstrendPPG.jsx";

// (미측정) 분기
import SurveyUnknownBstrendFPG from "./components/Survey_unknownBstrendFPG.jsx";
import SurveyUnknownBstrendPPG from "./components/Survey_unknownBstrendPPG.jsx";

// 합류 이후 공통
import SurveyDietCompose from "./components/Survey_dietaryComposition.jsx"; // 식이 구성
import SurveyEatingHabits from "./components/Survey_eatingHabits.jsx"; // 식습관
import SurveyDietPreference from "./components/Survey_dietPreference.jsx"; // 식단 선호
import SurveyAllergySelection from "./components/Survey_allergySelection.jsx"; // 알레르기
import SurveyDone from "./components/Survey_done.jsx"; // 완료

// ✅ content-scroll 래퍼 제거: 내부 컴포넌트(surveyContainer)가 스크롤/푸터를 모두 관리
function SurveyLayout({ children }) {
  return (
    <div className="app-wrap">
      <div className="app">{children}</div>
    </div>
  );
}

export default function Survey() {
  return (
    <SurveyLayout>
      <Routes>
        {/* /survey → intro */}
        <Route index element={<Navigate to="intro" replace />} />

        {/* 1) 인트로 */}
        <Route
          path="intro"
          element={<SurveyIntro next="/survey/basic-info" />}
        />

        {/* 2) 기본 정보: '미측정' vs '기계 있음' */}
        <Route
          path="basic-info"
          element={
            <Survey_basicInfo
              nextUnknownFpg="/survey/bstrend/unknown-fpg"
              nextFpgKnown="/survey/bstrend/fpg"
            />
          }
        />

        {/* 3A) 기계 있음: FPG → PPG → 합류 */}
        <Route
          path="bstrend/fpg"
          element={
            <SurveyBstrendFPG
              prev="/survey/basic-info"
              next="/survey/bstrend/ppg"
            />
          }
        />
        <Route
          path="bstrend/ppg"
          element={
            <SurveyBstrendPPG
              prev="/survey/bstrend/fpg"
              next="/survey/diet/compose" // state: { fromFlow: "known" }
            />
          }
        />

        {/* 3B) 미측정: unknown-FPG → unknown-PPG → 합류 */}
        <Route
          path="bstrend/unknown-fpg"
          element={
            <SurveyUnknownBstrendFPG
              prev="/survey/basic-info"
              next="/survey/bstrend/unknown-ppg"
            />
          }
        />
        <Route
          path="bstrend/unknown-ppg"
          element={
            <SurveyUnknownBstrendPPG
              prev="/survey/bstrend/unknown-fpg"
              next="/survey/diet/compose" // state: { fromFlow: "unknown" }
            />
          }
        />

        {/* 4) 합류 이후 공통 단계 */}
        <Route
          path="diet/compose"
          element={<SurveyDietCompose next="/survey/habits" />}
        />
        <Route
          path="habits"
          element={
            <SurveyEatingHabits
              prev="/survey/diet/compose"
              next="/survey/meal/preference"
            />
          }
        />
        <Route
          path="meal/preference"
          element={
            <SurveyDietPreference
              prev="/survey/habits"
              next="/survey/allergy"
            />
          }
        />
        <Route
          path="allergy"
          element={
            <SurveyAllergySelection
              prev="/survey/meal/preference"
              next="/survey/done"
            />
          }
        />

        {/* 5) 완료 */}
        <Route path="done" element={<SurveyDone />} />

        {/* 안전망 */}
        {/* <Route path="*" element={<Navigate to="intro" replace />} /> */}
      </Routes>
    </SurveyLayout>
  );
}
