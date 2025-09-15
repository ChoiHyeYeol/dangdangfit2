import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StatusCard from "./components/statusCard/StatusCard";
import MainMeal from "./components/mainmeal/MainMeal";
import MainTrans from "./components/maintrans/MainTrans";
import BottomSheet from "../../components/BottomSheet";
import HospitalPlan from "./components/statusCard/HospitalPlan";
import BloodPop from "./components/statusCard/BloodPop";
import Footer from "../../components/Footer";
import MainHeader from "./components/MainHeader";

import tanImg from "../../assets/tantan.png";
import lunchImg from "../../assets/lunchImg.png";
import dinnerImg from "../../assets/dinnerImg.png";
// import kangarooImg from "../../assets/kangarooImg.png";
import transImg from "../../assets/maintrans.png";
import { FaSpinner } from "react-icons/fa";
import "./mainpage.css";

export default function MainPage() {
  const nav = useNavigate();
  const [openHospital, setOpenHospital] = useState(false);
  const [openBlood, setOpenBlood] = useState(false);

  const [mainData, setMainData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const [visitInfo, setVisitInfo] = useState(() => {
  //   try {
  //     return JSON.parse(localStorage.getItem("visitInfo")) || null;
  //   } catch {
  //     return null;
  //   }
  // });

  // const handleSavedHospital = () => {
  //   try {
  //     setVisitInfo(JSON.parse(localStorage.getItem("visitInfo")) || null);
  //   } catch {
  //     setVisitInfo(null);
  //   }
  //   setOpenHospital(false);
  // };

  // ✅ 메인 데이터 가져오기
  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const res = await axios.get("/api/main", { withCredentials: true });
        setMainData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("메인 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMainData();
  }, []);

  // MainPage.jsx
  const handleSavedHospital = (payload) => {
    // 기존 팝업 닫기
    setOpenHospital(false);

    if (payload) {
      setMainData((prev) => (prev ? { ...prev, dday: payload.dday } : prev));
    }
  };

  // ✅ 혈당은 StatusCard가 glucoseLogs만 보고 반영하도록 함 (prop 제거)
  const handleSavedBlood = () => {
    // BloodPop이 저장 + 이벤트 발행까지 하고 옴
    setOpenBlood(false);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          fontWeight: "600",
          color: "#16a34a",
          gap: "10px",
        }}
      >
        <FaSpinner className="spin" />
        로딩중...
      </div>
    );
  if (!mainData) {
    return (
      <div className="empty-state">
        <div className="empty-box">
          <p className="empty-title">데이터를 불러올 수 없습니다</p>
          <p className="empty-sub">
            로그인이 만료되었거나, <br />
            서버에 문제가 있을 수 있어요.
          </p>
          <button className="empty-btn" onClick={() => nav("/signin")}>
            로그인 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrap">
      <div className="app">
        <div className="content-scroll main-scroll">
          {/* 이 영역 안에서만 모달/시트를 띄우기 위한 포털 루트 */}
          <div id="app-portal" className="app-portal" />

          <div className="home has-footer">
            <MainHeader
              nickname={mainData.nickname}
              pregweek={mainData.pregweek}
            />
            <div className="main-content">
              <div className="home-inner">
                {/* ✅ slot prop 미지정: 오늘 최신 입력 슬롯 > 현재 시간 슬롯 순으로 표시 */}
                <StatusCard
                  pregweek={mainData.pregweek}
                  dday={fixDday(mainData.dday)}
                  glucose={mainData.glucose}
                  onOpenHospital={() => setOpenHospital(true)}
                  onOpenBlood={() => setOpenBlood(true)}
                />

                {/* <div className="section-divider"></div> */}

                <MainMeal
                  sectionTitle="오늘의 식단"
                  items={mainData.rcp} // 서버에서 아침/점심/저녁 내려준 배열
                  onLinkClick={() => nav("/meal")}
                />

                {/* <div className="mainpage-divider"></div> */}

                <MainTrans
                  sectionTitle="AI 레시피 분석"
                  icon={transImg}
                  subText="혈당 걱정 없는"
                  mainText="저당 레시피로 변환하기"
                  to="/transrecipe"
                  state={{ from: "/main" }}
                />

                {/* <div className="mainpage-divider"></div> */}
              </div>
            </div>
            {/* 바텀시트 (포털을 content-scroll 내부로 지정) */}
            <BottomSheet
              containerId="app-portal"
              open={openHospital}
              title="병원 방문 계획"
              onClose={() => setOpenHospital(false)}
              maxHeight="80vh" // 🔥 svh → vh
              minHeight="450px" // 🔥 px 단위로 안정적인 최소 높이 보장
              className="custom-bottomsheet" // 🔥 커스텀 클래스 추가
            >
              <HospitalPlan onSaved={handleSavedHospital} />
            </BottomSheet>
            <BottomSheet
              containerId="app-portal"
              open={openBlood}
              title="공복/식후 혈당 입력"
              onClose={() => setOpenBlood(false)}
              maxHeight="80vh" // 🔥 svh → vh
              minHeight="450px" // 🔥 px 단위로 안정적인 최소 높이 보장
              className="custom-bottomsheet" // 🔥 커스텀 클래스 추가
            >
              {/* BloodPop 저장 후 메인 갱신 */}
              <BloodPop
                onSaved={(slot, updated) => {
                  setOpenBlood(false);
                  if (!slot || updated == null) return;

                  // 현재 슬롯과 맞으면 mainData 갱신
                  const currentSlot = getCurrentSlot();
                  if (slot === currentSlot) {
                    setMainData((prev) =>
                      prev ? { ...prev, glucose: updated } : prev
                    );
                  }
                }}
              />
            </BottomSheet>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

// dday 보정 함수
function fixDday(raw) {
  if (raw === null || raw === undefined) return null;
  if (raw === -2147483648) return null; // 🚨 서버 기본값 방어
  if (isNaN(raw)) return null;

  // 서버가 반대로 보내니까 부호를 뒤집음
  return -raw;
}

// ✅ 현재 시간대 슬롯 구하는 함수 (BloodPop과 통일)
function getCurrentSlot() {
  const h = new Date().getHours();
  if (h >= 0 && h < 8) return "fasting";
  if (h >= 8 && h < 11) return "breakfastPost"; // 아침
  if (h >= 11 && h < 16) return "lunchPost"; // 점심
  if (h >= 16 && h < 24) return "dinnerPost"; // 저녁
  return "fasting";
}
