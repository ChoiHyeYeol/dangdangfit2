import React from "react";
import { Link } from "react-router-dom";
import "./maintrans.css";
import { HiChevronRight } from "react-icons/hi";

export default function MainTrans({
  sectionTitle, // 카드 위 제목
  icon,
  subText, // 보조 텍스트
  mainText, // 대표 텍스트
  to = "/",
  state = {},
}) {
  return (
    <div className="main-trans-wrapper">
      <div className="main-trans-section-title">{sectionTitle}</div>
      <Link to={to} className="main-trans-card">
        {icon && <img className="main-trans-icon" src={icon} alt="" />}
        <div className="main-trans-texts">
          <div className="main-trans-sub">{subText}</div>
          <div className="main-trans-main">{mainText}</div>
        </div>
        <span className="main-trans-chevron">
          <HiChevronRight size={24} /> {/* 크기만 커짐, 두께 일정 */}
        </span>
      </Link>
    </div>
  );
}
