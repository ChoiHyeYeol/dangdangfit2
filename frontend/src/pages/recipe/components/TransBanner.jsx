import React from "react";
import "./TransBanner.css";
// import BANNER_IMAGE from "../../../assets/bannerfood.png";
// import BANNER_IMAGE from "../../../assets/bannertrans.png";
// import BANNER_IMAGE from "../../../assets/Banner2.png";
// import BANNER_IMAGE from "../../../assets/Banner3.png";
import BANNER_IMAGE from "../../../assets/Banner4.png";
import { useNavigate } from "react-router-dom";

const TransBanner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 원하는 경로로 이동
    navigate("/transrecipe"); // 👉 이 부분을 실제 가야할 페이지 경로로 변경하세요
  };

  return (
    <div className="banner-card" onClick={handleClick}>
      <div className="banner-content">
        <p className="banner-title">클린 푸드 레시피.</p>
        <p className="banner-title">한 번의 터치로!</p>
        <p className="banner-sub">설탕, 버터 대신 건강한 재료로</p>
      </div>
      <div className="banner-image-wrap">
        <img src={BANNER_IMAGE} alt="배너 이미지" className="banner-img" />
      </div>
    </div>
  );
};

export default TransBanner;
