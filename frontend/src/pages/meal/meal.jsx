// src/pages/diet/Meal.jsx
import React, { useEffect, useState } from "react";
import Header from "../../../src/components/Header"; // 공통 Header 컴포넌트
import Calendar from "./components/calendar/Calendar";
import MealPlan from "./components/mealplan/MealPlan";
import DesertCard from "./components/desert/DesertCard";
// import MilkcakeImg from "../../../src/assets/milkcake.png";
import snack from "../../assets/category/snack.png";
import Footer from "../../components/Footer"; // 공통 Footer 컴포넌트
import "./meal.css";
import axios from "axios";
import { FaExclamationCircle } from "react-icons/fa";
import ReactDOM from "react-dom";
import InfoAccordion from "./components/mealplan/InfoAccodion";

// function Meal() {
//   const todayDesert = {
//     name: "우유 푸딩 케이크",
//     image: MilkcakeImg,
//     // link: "https://example.com/recipe/1"
//   };

function Meal() {
  const [mealData, setMealData] = useState(null);
  const [showNoMealPopup, setShowNoMealPopup] = useState(false);

  useEffect(() => {
    axios.get("/api/diet").then((res) => {
      setMealData(res.data);
      console.log(res.data);
    });
  }, []);

  // ✅ 날짜 포맷 함수 (UTC 영향 제거)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };

  // 날짜 클릭 시 호출
  const handleDateSelect = async (date) => {
    try {
      const formatted = formatDate(date);
      const res = await axios.post(
        "/api/diet",
        { date: formatted },
        { withCredentials: true }
      );

      const newData = {
        date: formatted,
        breakfastMeal: res.data[0],
        lunchMeal: res.data[1],
        dinnerMeal: res.data[2],
      };

      // 🔎 식단 없는 경우 팝업 띄우기
      const noMeal =
        (!newData.breakfastMeal || newData.breakfastMeal.length === 0) &&
        (!newData.lunchMeal || newData.lunchMeal.length === 0) &&
        (!newData.dinnerMeal || newData.dinnerMeal.length === 0);

      if (noMeal) {
        setShowNoMealPopup(true); // 팝업만 띄움
      } else {
        setMealData((prev) => ({ ...prev, ...newData })); // 정상 데이터만 반영
      }
    } catch (err) {
      console.error("날짜별 식단 불러오기 실패:", err);
    }
  };

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="식단" />
        <main className="content-scroll meal-page">
          <div className="meal-bg" />
          <div className="content-scroll meal-content">
            {mealData && (
              <Calendar
                onDateSelect={handleDateSelect}
                joinDate={(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // 오늘 00시
                  const jd = new Date(today);
                  jd.setDate(today.getDate() - mealData.dday);
                  return jd;
                })()}
              />
            )}
            {mealData && (
              <MealPlan mealData={mealData} setMealData={setMealData} />
            )}
            {/* {mealData?.dessertMeal?.length > 0 && (
              <DesertCard desert={mealData.dessertMeal[0]} />
            )} */}
            <DesertCard desert={mealData?.dessertMeal?.[0]} />{" "}
            {/* <div className="section-divider"></div> */}
            <InfoAccordion defaultOpen={true}>
              <ul className="info-list">
                <li>
                  식단은 일주일 단위로 추천되며, 매주 일요일 00시에 새로고침
                  됩니다.
                </li>
                <li>
                  식단이 마음에 들지 않을 경우, 오른쪽 상단의 새로고침 버튼을
                  누르면 식단이 변경됩니다.
                </li>
                <li>
                  다음 주 식단은 확인할 수 없으며 이전 식단은 해당 날짜를 누를
                  때 확인할 수 있습니다.
                </li>
                <li>간식은 하루 1회만 제공됩니다.</li>
              </ul>
            </InfoAccordion>
            {/* <p className="notice-text">
              매주 일요일 00시에 식단이 초기화됩니다.
            </p> */}
          </div>
        </main>
        <Footer />
      </div>
      {/* ⚠️ 팝업 모달 */}
      {showNoMealPopup &&
        ReactDOM.createPortal(
          <div className="no-meal-popup-backdrop">
            <div className="no-meal-popup">
              <FaExclamationCircle size={50} color="#ddddddff" />
              <p>식단 정보가 없습니다.</p>
              <button onClick={() => setShowNoMealPopup(false)}>닫기</button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Meal;
