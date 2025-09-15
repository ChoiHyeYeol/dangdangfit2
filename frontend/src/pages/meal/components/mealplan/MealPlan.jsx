// src/pages/diet/components/mealplan/MealPlan.jsx

import React from "react";
import MealHeaderInfo from "./MealHeaderInfo";
import MealSection from "./MealSection";
import "./MealPlan.css"; // 스타일 필요하면 여기에

function MealPlan({ mealData, setMealData }) {
  return (
    <section className="meal-plan">
      <MealHeaderInfo
        nickName={mealData.nickName}
        dDay={mealData.dday}
        selectedDate={mealData.date}
      />
      <MealSection mealData={mealData} setMealData={setMealData} />
    </section>
  );
}

export default MealPlan;
