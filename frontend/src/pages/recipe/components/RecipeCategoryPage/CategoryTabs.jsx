// src/pages/recipe/components/CategorySlider.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./CategoryTabs.css";

// const METHOD_TABS = [
//   "채식",
//   "구이",
//   "국물",
//   "무침",
//   "볶음",
//   "면/밥",
//   "디저트",
//   "기타",
// ];
const METHOD_TABS = [
  { label: "채식", value: "양념" }, // 서버는 여전히 "양념"으로 인식
  { label: "구이", value: "구이" },
  { label: "국물", value: "국물" },
  { label: "무침", value: "무침" },
  { label: "볶음", value: "절임" }, // 프론트엔 볶음, 서버엔 절임
  { label: "면/밥", value: "면/밥" },
  { label: "디저트", value: "제과제빵" },
  { label: "기타", value: "기타" },
];

const TIME_TABS = ["아침", "점심", "저녁", "간식"];

export default function CategorySlider({ active }) {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const railRef = useRef(null);

  // group: 쿼리 우선, 없으면 active로 추론
  let group = searchParams.get("group");
  if (!group) group = TIME_TABS.includes(active) ? "time" : "method";

  // 현재 모드의 탭 목록
  const tabs = useMemo(
    () => (group === "time" ? TIME_TABS : METHOD_TABS),
    [group]
  );

  const isShort = tabs.length <= 4; // ✅ 4개 이하면 균등 배치 모드

  // 활성 버튼 중앙 정렬
  useEffect(() => {
    const btn = railRef.current?.querySelector(`[data-tab="${active}"]`);
    btn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  // ===== Drag to scroll (네 기존 코드 유지) =====
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const onDown = (e) => {
    const el = railRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.classList.add("dragging");
  };
  const onMove = (e) => {
    const el = railRef.current;
    if (!el || !isDown.current) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft;
    const walk = (x - startX.current) * 1.1;
    el.scrollLeft = scrollLeft.current - walk;
  };
  const onUp = () => {
    isDown.current = false;
    railRef.current?.classList.remove("dragging");
  };

  // ✅ 탭 클릭: 현재 group 유지해서 이동
  // const handleClick = (name) => {
  //   nav(`/recipe/category/${encodeURIComponent(name)}?group=${group}`, {
  //     replace: true,
  //   });
  // };
  const handleClick = (tab) => {
    nav(`/recipe/category/${encodeURIComponent(tab.label)}?group=${group}`, {
      replace: true,
    });
  };

  return (
    <div className="cat-rail-wrap">
      <div
        className={`cat-rail ${isShort ? "is-short" : ""}`} // ✅ 클래스 토글
        ref={railRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseLeave={onUp}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        {/* {tabs.map((name) => (
          <button
            key={name}
            data-tab={name}
            className={`cat-pill ${name === active ? "is-active" : ""}`}
            onClick={() => handleClick(name)}
          >
            {name}
          </button>
        ))} */}
        {group === "time"
          ? // 시간별 탭은 문자열 배열
            tabs.map((name) => (
              <button
                key={name}
                data-tab={name}
                className={`cat-pill ${name === active ? "is-active" : ""}`}
                onClick={() =>
                  nav(
                    `/recipe/category/${encodeURIComponent(
                      name
                    )}?group=${group}`,
                    { replace: true }
                  )
                }
              >
                {name}
              </button>
            ))
          : // 방식별 탭은 객체 배열
            tabs.map((tab) => (
              <button
                key={tab.value}
                data-tab={tab.label}
                className={`cat-pill ${
                  tab.label === active ? "is-active" : ""
                }`}
                onClick={() =>
                  nav(
                    `/recipe/category/${encodeURIComponent(
                      tab.label
                    )}?group=${group}`,
                    { replace: true }
                  )
                }
              >
                {tab.label}
              </button>
            ))}
      </div>
      <div className="fade left" />
      <div className="fade right" />
    </div>
  );
}
