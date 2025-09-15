import React, { useState, useRef, useEffect } from "react";
import styles from "./Onboarding.module.css";
import { useNavigate } from "react-router-dom";
import {
  bg,
  action1,
  action2,
  action3,
  action4,
  action5,
} from "./onboarding_Images/Onboarding_images";

/* 1) 슬라이드 이미지/텍스트 */
const actionImg_list = [action1, action2, action3, action4, action5];
const slideText_list = [
  { title: "혈당 관리부터\n식단까지 한 번에! \n 당당핏!", highlight: "" },
  { title: "혈당 상태를\n쉽게 기록하고 관리!", highlight: "" },
  { title: "혈당과 설문을 통한\n맞춤형 식단 추천!", highlight: "" },
  { title: "일반적인 레시피를\n저당으로 변환해 건강하게!", highlight: "" },
  { title: "당당핏\n함께 시작해요!", highlight: "" },
];

/* 2) 마지막 화면에 회원가입 버튼까지 보일지 */
const showSignup_last = true;

export default function Onboarding({ onLogin }) {
  const [currentSlide_idx, setCurrentSlide_idx] = useState(0);
  const max_idx = actionImg_list.length - 1;
  const isLast_slide = currentSlide_idx === max_idx;
  const navigate = useNavigate();

  /* 스와이프 */
  const swipeStartX = useRef(null);
  const THRESH = 40;

  const goNext = () => setCurrentSlide_idx((i) => Math.min(i + 1, max_idx));
  const goPrev = () => setCurrentSlide_idx((i) => Math.max(i - 1, 0));
  const jumpTo = (idx) => setCurrentSlide_idx(idx);

  const onTouchStart = (e) => (swipeStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (swipeStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    if (dx <= -THRESH) goNext();
    else if (dx >= THRESH) goPrev();
    swipeStartX.current = null;
  };
  useEffect(() => {
    // 모든 슬라이드 이미지 미리 로딩
    actionImg_list.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (isLast_slide) return; // 마지막 페이지면 자동 넘김 종료

    const AUTO_MS = 2500;
    const timer = setInterval(() => {
      setCurrentSlide_idx((i) => (i < max_idx ? i + 1 : i));
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [isLast_slide, max_idx]);

  /* CTA 공통 */
  const goLogin = () => {
    try {
      localStorage.setItem("seenOnboarding", "1");
    } catch {}
    navigate("/signin"); // ✅ 로그인 라우트로 이동
  };

  const goSignup = () => {
    try {
      localStorage.setItem("seenOnboarding", "1");
    } catch {}
    navigate("/signupstep1"); // ✅ 회원가입 라우트로 이동
  };

  const { title, highlight } = slideText_list[currentSlide_idx];

  return (
    <div className="app-wrap">
      <div className="app">
        <div className={styles.obRoot}>
          {/* 1) 도트 */}
          <div className={styles.obDots}>
            {actionImg_list.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${
                  i === currentSlide_idx ? styles.active : ""
                }`}
                onClick={() => jumpTo(i)}
              />
            ))}
          </div>

          {/* 2) 아트 */}
          <div
            className={styles.obArt}
            onClick={() => !isLast_slide && goNext()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img className={styles.obBg} src={bg} alt="" />
            {/* <img
              className={styles.obAction}
              src={actionImg_list[currentSlide_idx]}
              alt="onboarding visual"
            /> */}
            {/* <img
              key={currentSlide_idx} // ✅ key 추가
              className={`${styles.obAction} ${styles.fade}`}
              src={actionImg_list[currentSlide_idx]}
              alt="onboarding visual"
            /> */}
            <img
              key={currentSlide_idx} // ✅ key 추가
              className={`${styles.obAction} ${styles.fade}`}
              src={actionImg_list[currentSlide_idx]}
              alt="onboarding visual"
              loading="eager" // 👈 브라우저가 지연 로딩하지 않도록 강제
              decoding="sync" // 👈 디코딩을 바로 하도록 강제
            />
          </div>

          {/* 3) 텍스트 */}
          <div className={styles.obCopy}>
            <p
              key={currentSlide_idx} // ✅ key 추가
              className={`${styles.obTitle} ${styles.fade}`}
            >
              {title}
            </p>
            {highlight && <p className={styles.obHighlight}>{highlight}</p>}

            {/* 4) '건너뛰기' */}
            {!isLast_slide && (
              <button
                className={styles.obSkipCenter}
                onClick={() => setCurrentSlide_idx(max_idx)} // 👈 마지막 슬라이드로 이동
              >
                건너뛰기
              </button>
            )}
          </div>

          {/* 5) 하단 버튼 */}
          <div
            className={`${styles.obNav} ${
              isLast_slide && showSignup_last
                ? styles.obNavTwo
                : styles.obNavSingle
            }`}
          >
            {isLast_slide && showSignup_last ? (
              <>
                <button className={styles.obSignup} onClick={goSignup}>
                  회원 가입
                </button>
                <button className={styles.obLogin} onClick={goLogin}>
                  로그인
                </button>
              </>
            ) : (
              isLast_slide && (
                <button className={styles.obLogin} onClick={goLogin}>
                  로그인 하기
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
