// RecipeCarousel.jsx
import React, { useRef, useEffect } from "react";
import RecipeCard from "../../../components/RecipeCard";
import "./RecipeCarousel.css";

const RecipeCarousel = ({ recipes }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    let isDown = false;
    let startX, scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      el.classList.add("active");
      startX = e.pageX;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove("active");
    };

    const onMouseUp = () => {
      isDown = false;
      el.classList.remove("active");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 1.2; // 드래그 민감도
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="carousel-container">
      <h3 className="top5text">
        인기 레시피 <strong style={{ color: "#007a5a" }}>TOP 5</strong>
      </h3>
      <div className="carousel-wrapper" ref={wrapperRef}>
        {recipes.map((recipe, idx) => (
          <RecipeCard
            key={recipe.rcpId}
            recipe={recipe}
            rank={idx + 1 <= 3 ? idx + 1 : null} // 👉 3위까지만 rank 전달
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;
