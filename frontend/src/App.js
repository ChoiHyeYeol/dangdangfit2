// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import MainPage from "./pages/home/MainPage";

import TransRecipe from "./pages/transRecipe/components/TransRecipe";
import TransBanner from "./pages/transRecipe/components/TransBanner";
import LowRecipe from "./pages/transRecipe/components/LowRecipe";

import RecipeCategoryPage from "./pages/recipe/components/RecipeCategoryPage/RecipeCategoryPage";
import Recipe from "./pages/recipe/recipe";
import My from "./pages/my/My";
import Meal from "./pages/meal/meal";
import SearchResult from "./pages/recipe/components/SearchResult/SearchResult";
import CollecionPage from "./pages/collection/CollecionPage";
import RecipeDetailPage from "./pages/recipedetail/RecipeDetailPage";
import MealUpdatePopup from "./components/MealUpdatePopup";
import ChatBot from "./pages/chatbot/ChatBot";
import ProfileEdit from "./pages/my/components/edit/ProfileEdit";
import ProfileInfoForm from "./pages/my/components/edit/ProfileInfoForm";

// ➕ 새로 추가되는 페이지
import Splash from "./pages/splash/Splash";
import Onboarding from "./pages/onboarding/Onboarding";
import Survey from "./pages/survey/Survey";
import Signin from "./pages/signin/Signin";
import SignupStep1 from "./pages/signin/components/SignupStep1";
import SignupStep2 from "./pages/signin/components/SignupStep2";
import SignupStep3 from "./pages/signin/components/SignupStep3";
import SurveyEditList from "./pages/my/components/edit/SurveyEditList";

// 진행상태 플래그 키
const STORAGE_KEYS = {
  didOnboard: "ddf_did_onboard",
  didSurvey: "ddf_did_survey",
};

// 루트("/")에서 바로 분기 처리
// function RootRedirect() {
//   const didOnboard = localStorage.getItem(STORAGE_KEYS.didOnboard) === "1";
//   const didSurvey = localStorage.getItem(STORAGE_KEYS.didSurvey) === "1";

//   if (!didOnboard) {
//     return <Navigate to="/splash" replace />;
//   } else if (!didSurvey) {
//     return <Navigate to="/survey" replace />;
//   } else {
//     return <Navigate to="/main" replace />;
//   }
// }

export default function App() {
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   const checkPopup = () => {
  //     const now = new Date();
  //     const day = now.getDay();
  //     // if (day === 2) setShowPopup(true); // 테스트용
  //   };
  //   checkPopup();
  //   const h = setInterval(checkPopup, 60 * 1000);
  //   return () => clearInterval(h);
  // }, []);

  return (
    <>
      <Routes>
        {/* 루트에서 분기 */}
        {/* <Route path="/" element={<RootRedirect />} /> */}
        {/* 스플래시 → 온보딩 → 설문 플로우 */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signupstep1" element={<SignupStep1 />} />
        <Route path="/signupstep2" element={<SignupStep2 />} />
        <Route path="/signupstep3" element={<SignupStep3 />} />

        <Route path="/survey/*" element={<Survey />} />

        {/* 메인 앱 라우트 (주소를 /main 으로 잡음) */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/transrecipe" element={<TransRecipe />} />
        <Route path="/transrecipe/loading" element={<TransBanner />} />
        <Route path="/transrecipe/result/:rcpId" element={<LowRecipe />} />
        <Route path="/my" element={<My />} />
        <Route path="/meal" element={<Meal />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route
          path="/recipe/category/:categoryName"
          element={<RecipeCategoryPage />}
        />
        <Route path="/recipe/search" element={<SearchResult />} />
        <Route path="/collection" element={<CollecionPage />} />
        <Route path="/collection/recipe" element={<CollecionPage />} />
        <Route path="/collection/trans" element={<CollecionPage />} />
        <Route path="/recipe/detail/:name" element={<RecipeDetailPage />} />
        <Route
          path="/transrecipe/detail/:rcpId"
          element={<RecipeDetailPage />}
        />
        <Route path="/my/edit" element={<ProfileEdit />} />
        <Route path="/my/edit/info" element={<ProfileInfoForm />} />
        <Route path="/my/edit/update" element={<SurveyEditList />} />

        {/* 안전망 */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>

      <div id="app-portal" className="app-potal">
        <ChatBot />
      </div>
      {/* {showPopup && <MealUpdatePopup onClose={() => setShowPopup(false)} />} */}
    </>
  );
}
