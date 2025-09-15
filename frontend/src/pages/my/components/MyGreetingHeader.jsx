// src/pages/my/components/MyGreetingHeader.jsx
import React from "react";
import "./MyGreetingHeader.css";
import profile from "../../../assets/blood-drop.png";
// import bell from "../../../assets/bell.png";

export default function MyGreetingHeader({
  nickname = "당당",
  // pregweek = null,
  maxReading = null,
}) {
  // ✅ 닉네임 안전 처리 (null/undefined/빈문자 → "당당")
  const safeName = (nickname ?? "당당").toString().trim() || "당당";

  // ✅ 임신 주차 숫자 변환 (문자 "22"도 OK), 숫자 아니면 '주차 정보 없음'
  // const weekNum = Number(pregweek);
  // const weekText = Number.isFinite(weekNum)
  //   ? `${weekNum}주차`
  //   : "주차 정보 없음";

  return (
    <header className="mh-header">
      <div className="mh-top">{/* 알림 아이콘 등 필요시 */}</div>

      <div className="mh-row">
        {/* 👈 텍스트를 왼쪽에 */}
        <div className="mh-texts">
          <p className="mh-greet">
            <strong className="nicksyle">{safeName}</strong>님
            {/* <span className="mh-message">님, 오늘 혈당은 재셨나요?</span> */}
          </p>
          {maxReading ? (
            <p className="pregweek-text">
              이번 주 최고 혈당은{" "}
              <span className="pregweek-highlight">
                {maxReading.value}mg/dL
              </span>{" "}
              입니다.
              {/* ({maxReading.day} · {maxReading.type})입니다. */}
            </p>
          ) : (
            <p className="pregweek-text">아직 혈당 기록이 없습니다</p>
          )}
        </div>

        {/* 👉 아이콘을 오른쪽에 */}
        <div className="mh-icon">
          <div className="mh-icon-circle">
            <img className="mh-profile" alt="profile" src={profile} />
          </div>
        </div>
      </div>
    </header>
  );
}
