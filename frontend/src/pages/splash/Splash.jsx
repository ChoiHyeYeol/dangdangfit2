// src/pages/splash/Splash.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "./userApi";

const CUT_AT = 5;

export default function Splash({ onFinish }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const cutDoneRef = useRef(false);

  // DB(또는 API) 결과를 보관할 곳
  const isRegisteredRef = useRef(null); // null(모름) | true | false

  // 앱 진입과 동시에 가입여부 비동기 조회 시작
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchMe();
        if (mounted) isRegisteredRef.current = !!me?.isRegistered;
      } catch {
        if (mounted) isRegisteredRef.current = null; // 실패 시 모름 → 안전 기본값 사용
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const goNext = () => {
    // 우선순위: API가 성공했다면 그 결과로 분기
    // 실패했거나 아직 모르면 안전 기본값으로 온보딩
    const isRegistered = isRegisteredRef.current;

    if (isRegistered === true) {
      navigate("/main");
    } else {
      navigate("/onboarding"); // 기본값: 미가입으로 간주
    }
    onFinish && onFinish(); // 스플래쉬 오버레이 닫기
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || cutDoneRef.current) return;
    if (v.currentTime >= CUT_AT) {
      cutDoneRef.current = true;
      v.pause();
      goNext();
    }
  };

  return (
    <div className="app-wrap">
      <div className="app">
        {/* content-scroll는 사용하지 않고, 비디오가 카드(.app) 전체를 덮도록 */}
        <video
          ref={videoRef}
          src="/videos/splash.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={goNext}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
