import React, { useRef } from "react";
import "./mainmeal.css";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi"; // 깔끔한 얇은 화살표

export default function MainMeal({
  sectionTitle = "오늘의 식단",
  onLinkClick,
  items = [],
}) {
  const nav = useNavigate();
  const slides = Array.isArray(items) ? items : [];

  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("active");
  };

  const handleMouseLeave = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // 드래그 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="tm-wrap main-meal">
      <div className="tm-header">
        <h3 className="tm-title">{sectionTitle}</h3>
        {onLinkClick && (
          <button className="tm-link" onClick={onLinkClick}>
            {/* <span aria-hidden>›</span> */}
            <FiChevronRight className="tm-arrow-icon" />
          </button>
        )}
      </div>

      <div
        className="tmc-scroll"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {slides.map((s, i) => (
          <div key={i} className="tmc-slide-card">
            <MealCard
              {...s}
              index={i}
              onTipClick={
                s.rcpId
                  ? () =>
                      nav(`/recipe/detail/${encodeURIComponent(s.rcpNm)}`, {
                        state: { rcpId: s.rcpId },
                      })
                  : null
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MealCard({
  rcpNm,
  mainImg,
  time,
  portion,
  level,
  // tipButtonLabel,
  onTipClick,
  index,
}) {
  const labels = ["아침", "점심", "저녁"];
  const prefix = labels[index] || "";

  const clickable = typeof onTipClick === "function";

  return (
    <article className={`tm-card ${clickable ? "clickable" : "disabled"}`}>
      <div
        className="tm-media-wide"
        onClick={clickable ? onTipClick : undefined}
        style={{ cursor: clickable ? "pointer" : "not-allowed" }}
      >
        {mainImg ? (
          <img src={mainImg} alt={rcpNm} draggable={false} />
        ) : (
          <div className="tm-placeholder">이미지 준비중...</div>
        )}
      </div>
      <div className="tm-body">
        <h4 className="tm-name">
          {prefix && <span className="tm-prefix">{prefix}</span>}
          <span className="tm-title-recipe">{rcpNm}</span>
        </h4>

        <p className="tm-sub">
          {time && `${time} · `}
          {portion && `${portion} · `}
          {level && level}
        </p>
      </div>
    </article>
  );
}
