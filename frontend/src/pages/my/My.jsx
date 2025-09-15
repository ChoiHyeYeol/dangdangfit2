// src/pages/my/My.jsx
import React, { useState, useEffect } from "react";
import "./my.css";
import axios from "axios";
import Header from "../../components/Header";
import WeeklyGlucoseSlider from "./components/WeeklyGlucoseSlider";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import MyGreetingHeader from "./components/MyGreetingHeader"; // ✅ 인사 컴포넌트

// (선택) 상단 인사 배지 이미지가 있으면 경로 맞춰서 쓰면 됨
// import BadgeImg from "../../assets/blood-drop.png";

function normalizeWeekData(list) {
  const base = Array.isArray(list) ? list.slice(-7) : [];
  const pad = {
    fasting: null,
    breakfastPost: null,
    lunchPost: null,
    dinnerPost: null,
  };
  while (base.length < 7) base.unshift({ ...pad });
  return base;
}

export default function My() {
  const [mode, setMode] = useState("post"); // 'post' | 'fasting'
  const [weekData, setWeekData] = useState([]);
  const [profile, setProfile] = useState({ nickname: "당당", pregweek: null });
  const nav = useNavigate();

  // ✅ 프로필(닉네임/임신주차) 불러오기 — 키 변형/문자 숫자 변환/래핑(data)까지 케어
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.get("/api/user/profile", {
  //         withCredentials: true,
  //       });

  //       // 응답이 { data: {...} } 래핑일 수도 있음
  //       const payload =
  //         res?.data && typeof res.data === "object" ? res.data : {};
  //       const p =
  //         payload?.data && typeof payload.data === "object"
  //           ? payload.data
  //           : payload;

  //       // 닉네임 여러 키 대응
  //       const rawName =
  //         p.nickname ??
  //         p.nickName ??
  //         p.name ??
  //         p.username ??
  //         localStorage.getItem("nickname");

  //       const safeName = (rawName ?? "당당").toString().trim() || "당당";

  //       // 임신 주차 여러 키 + 문자열 숫자 대응
  //       const rawWeek =
  //         p.pregWeek ??
  //         p.pregweek ??
  //         p.pregnancyWeek ??
  //         p.week ??
  //         localStorage.getItem("pregWeek") ??
  //         localStorage.getItem("pregweek");

  //       const weekNum = Number(rawWeek);
  //       const safeWeek = Number.isFinite(weekNum) ? weekNum : null;

  //       setProfile({ nickname: safeName, pregweek: safeWeek });
  //     } catch {
  //       // 폴백: 로컬스토리지
  //       try {
  //         const name =
  //           (localStorage.getItem("nickname") ?? "당당").toString().trim() ||
  //           "당당";
  //         const w = Number(
  //           localStorage.getItem("pregWeek") ?? localStorage.getItem("pregweek")
  //         );
  //         setProfile({
  //           nickname: name,
  //           pregweek: Number.isFinite(w) ? w : null,
  //         });
  //       } catch {
  //         setProfile({ nickname: "당당", pregweek: null });
  //       }
  //     }
  //   })();
  // }, []);
  // My.jsx
  useEffect(() => {
    (async () => {
      try {
        // MainPage처럼 /api/main 호출
        const res = await axios.get("/api/main", { withCredentials: true });

        const safeName =
          (res?.data?.nickname ?? localStorage.getItem("nickname") ?? "당당")
            .toString()
            .trim() || "당당";

        setProfile({ nickname: safeName });
      } catch (err) {
        console.error("닉네임 불러오기 실패:", err);
        // 폴백
        const name =
          (localStorage.getItem("nickname") ?? "당당").toString().trim() ||
          "당당";
        setProfile({ nickname: name });
      }
    })();
  }, []);

  // ✅ 서버에서 7일간 혈당 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/my", { withCredentials: true });
        // res.data: [[F, M, A, E], ... 7일]  (-1 → null)
        const mapped = (res.data || []).map((arr) => ({
          fasting: arr[0] === -1 ? null : arr[0],
          breakfastPost: arr[1] === -1 ? null : arr[1],
          lunchPost: arr[2] === -1 ? null : arr[2],
          dinnerPost: arr[3] === -1 ? null : arr[3],
        }));
        setWeekData(normalizeWeekData(mapped));
      } catch (err) {
        console.error("혈당 데이터 불러오기 실패:", err);
        setWeekData(normalizeWeekData([]));
      }
    };
    fetchData();
  }, []);

  // ✅ 모드별 데이터 비어있는지 확인
  const isPostEmpty =
    weekData.length > 0 &&
    weekData.every(
      (d) =>
        d.breakfastPost === null &&
        d.lunchPost === null &&
        d.dinnerPost === null
    );

  const isFastingEmpty =
    weekData.length > 0 && weekData.every((d) => d.fasting === null);

  // My.jsx 안 return 위쪽
  const maxReading = (() => {
    let max = -Infinity;
    let maxDayIdx = null;
    let maxType = null;

    weekData.forEach((d, idx) => {
      ["fasting", "breakfastPost", "lunchPost", "dinnerPost"].forEach((key) => {
        if (d[key] != null && d[key] > max) {
          max = d[key];
          maxDayIdx = idx;
          maxType = key;
        }
      });
    });

    if (max === -Infinity) return null;

    // 날짜 계산 (오늘 기준으로 weekData는 최근 7일이므로)
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - maxDayIdx));

    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    const typeLabel = {
      fasting: "공복",
      breakfastPost: "아침 식후",
      lunchPost: "점심 식후",
      dinnerPost: "저녁 식후",
    }[maxType];

    return {
      value: max,
      day: `${dayLabel}(${weekday})`,
      type: typeLabel,
    };
  })();

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title="마이페이지" />

        <div className="content-scroll my-content-scroll">
          {/* ===== 인사 헤더 영역 ===== */}
          <MyGreetingHeader
            nickname={profile.nickname}
            // pregweek={profile.pregweek}
            maxReading={maxReading}
          />
          {/* ===== 그래프 카드 ===== */}
          <section className="m-card" aria-labelledby="m-graph-title">
            <div className="m-card-head">
              <h3 id="m-graph-title" className="m-card-title">
                최근 7일 간 혈당 추이
              </h3>

              <div
                className="m-tabs"
                role="tablist"
                aria-label="혈당 종류 선택"
              >
                <button
                  className={`m-tab ${mode === "post" ? "is-active" : ""}`}
                  onClick={() => setMode("post")}
                  type="button"
                  role="tab"
                  aria-selected={mode === "post"}
                >
                  주간 식후
                </button>
                <button
                  className={`m-tab ${mode === "fasting" ? "is-active" : ""}`}
                  onClick={() => setMode("fasting")}
                  type="button"
                  role="tab"
                  aria-selected={mode === "fasting"}
                >
                  주간 공복
                </button>
              </div>
            </div>

            {/* 안쪽 흰 영역 + 점선 상단 라인 */}
            <div className="m-graph-outer">
              <div
                className="m-graph-inner"
                role="region"
                aria-label="주간 혈당 그래프"
              >
                {mode === "post" && isPostEmpty ? (
                  <div className="m-empty">
                    <p className="m-empty-title">
                      최근 식후 혈당 기록이 없어요
                    </p>
                    <p className="m-empty-sub">
                      메인화면에서 혈당을 입력한 뒤 {"\n"}
                      그래프를 확인해보세요
                    </p>
                    <button className="m-add-btn" onClick={() => nav("/main")}>
                      + 입력하러 가기
                    </button>
                  </div>
                ) : mode === "fasting" && isFastingEmpty ? (
                  <div className="m-empty">
                    <p className="m-empty-title">
                      최근 공복 혈당 기록이 없어요
                    </p>
                    <p className="m-empty-sub">
                      메인화면에서 혈당을 입력한 뒤 {"\n"}그래프를 확인해보세요
                    </p>
                    <button className="m-add-btn" onClick={() => nav("/main")}>
                      + 입력하러 가기
                    </button>
                  </div>
                ) : (
                  <WeeklyGlucoseSlider
                    weekData={weekData}
                    mode={mode}
                    height={380} // ⬅️ 그래프를 살짝 더 길게
                  />
                )}
              </div>
            </div>

            {/* 범례 */}
            {!(mode === "post" && isPostEmpty) &&
              !(mode === "fasting" && isFastingEmpty) && (
                <div className="m-legend" aria-hidden="true">
                  {mode === "post" ? (
                    <>
                      <span className="m-dot m-blue" /> 아침
                      <span className="m-dot m-green" /> 점심
                      <span className="m-dot m-pink" /> 저녁
                    </>
                  ) : (
                    <>
                      <span className="m-dot m-purple" /> 공복
                    </>
                  )}
                </div>
              )}
          </section>
          {/* ===== 찜목록 카드 ===== */}
          <section
            className="cta-card"
            role="button"
            tabIndex={0}
            onClick={() => nav("/collection")}
            onKeyDown={(e) => e.key === "Enter" && nav("/collection")}
          >
            <div className="cta-texts">
              <div className="cta-title">나의 찜목록 바로가기</div>
              <div className="cta-sub">저장된 레시피를 확인하기</div>
            </div>
            <div className="cta-chevron" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>
          {/* ===== 내 정보 관리 ===== */}
          <section className="my-info-section" aria-labelledby="my-info-title">
            <div className="my-info-divider" />
            <h4 id="my-info-title" className="my-info-title">
              내 정보 관리
            </h4>

            <ul className="my-info-list">
              <li
                className="my-info-item"
                role="button"
                tabIndex={0}
                onClick={() => nav("/my/edit/update")}
                onKeyDown={(e) => e.key === "Enter" && nav("/my/edit/update")}
              >
                <div className="my-info-left">
                  <div className="my-info-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 4h14v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4z"
                        stroke="#111"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 8h6M9 12h6M9 16h3"
                        stroke="#111"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="my-info-text">설문조사 수정</div>
                </div>
                <div className="my-info-right" aria-hidden="true">
                  〉
                </div>
              </li>

              <li
                className="my-info-item"
                role="button"
                tabIndex={0}
                onClick={() => nav("/my/edit/info")}
                onKeyDown={(e) => e.key === "Enter" && nav("/my/edit/info")}
              >
                <div className="my-info-left">
                  <div className="my-info-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
                        fill="#111"
                      />
                    </svg>
                  </div>
                  <div className="my-info-text">계정정보 수정</div>
                </div>
                <div className="my-info-right" aria-hidden="true">
                  〉
                </div>
              </li>
            </ul>
          </section>
        </div>

        <Footer active="my" />
      </div>
    </div>
  );
}
