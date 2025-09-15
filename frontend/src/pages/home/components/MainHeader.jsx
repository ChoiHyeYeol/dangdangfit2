import React from "react";
import "./MainHeader.css"; // 스타일 분리
import profile from "../../../assets/blood-drop.png";
import bell from "../../../assets/bell.png";

function Header({ nickname, pregweek }) {
  return (
    <header className="header">
      {/* 상단 로고 + 종 */}
      <div className="header-top">
        <div className="brand">당당핏</div>
        {/* <img className="bell" alt="bell" src={bell} /> */}
      </div>

      <div className="header-left">
        <div className="header-icon">
          <div className="icon-circle">
            <img className="profile" alt="profile" src={profile} />
          </div>
        </div>
        <div className="header-text">
          <p>
            <strong className="nicksyle">{nickname}</strong> 님 안녕하세요!
          </p>
          {/* <p>
            오늘의 혈당 수치는 어떤가요?
            <span className="highlight">{statusHighlight}</span>
          </p> */}
          <p className="pregweek-text">
            이번주는 임신{" "}
            <span className="pregweek-highlight">{pregweek}주차</span>입니다
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
