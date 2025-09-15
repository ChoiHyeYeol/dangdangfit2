import React, { useState, useEffect } from "react";
import MealSectionHeader from "./MealSectionHeader";
import MealItemList from "./MealItemList";
import MealRefreshModal from "./MealRefreshModal";
import "./MealSection.css";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import axios from "axios";

function MealSection({ mealData, setMealData }) {
  const mealTypes = [
    { label: "아침", key: "breakfastMeal", icon: "☀️", oneTime: 0 },
    { label: "점심", key: "lunchMeal", icon: "🌤️", oneTime: 1 },
    { label: "저녁", key: "dinnerMeal", icon: "🌙", oneTime: 2 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMeal = mealTypes[currentIndex];

  // 새로고침 모달 상태
  const [showModal, setShowModal] = useState(false);
  // 새로고침 로딩 상태
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 날짜 바뀌면 아침부터 시작
  useEffect(() => {
    if (mealData?.date) {
      setCurrentIndex(0);
    }
  }, [mealData?.date]);

  const handleNext = () => {
    if (currentIndex < mealTypes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRefreshClick = () => {
    setShowModal(true);
  };

  const handleConfirmRefresh = async () => {
    setShowModal(false);
    setIsRefreshing(true);
    try {
      const res = await axios.post(
        "/api/model/diet/one",
        {
          date: mealData.date,
          oneTime: currentMeal.oneTime,
        },
        { withCredentials: true }
      );
      console.log("새로고침 응답:", res.data);

      setMealData((prev) => ({
        ...prev,
        [currentMeal.key]: res.data,
      }));
    } catch (err) {
      console.error("식단 새로고침 실패:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="meal-section-slider">
      <div className="slider-wrapper">
        <div
          className="cards-track"
          style={{ transform: `translateX(-${currentIndex * 85}%)` }}
        >
          {mealTypes.map((meal, idx) => (
            <div
              key={meal.key}
              className={`meal-card ${meal.key} ${
                idx === currentIndex ? "active" : "inactive"
              }`}
            >
              <MealSectionHeader
                label={meal.label}
                icon={meal.icon}
                onRefresh={handleRefreshClick}
              />

              <div
                className={`meal-items-area ${
                  (mealData[meal.key]?.length || 0) <= 3
                    ? "center-mode"
                    : "scroll-mode"
                }`}
              >
                <MealItemList
                  items={mealData[meal.key]}
                  loading={isRefreshing && idx === currentIndex}
                />
              </div>

              <MealRefreshModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmRefresh}
              />
            </div>
          ))}
        </div>

        {currentIndex > 0 && (
          <button className="nav-btn left" onClick={handlePrev}>
            <FaChevronLeft />
          </button>
        )}
        {currentIndex < mealTypes.length - 1 && (
          <button className="nav-btn right" onClick={handleNext}>
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default MealSection;
