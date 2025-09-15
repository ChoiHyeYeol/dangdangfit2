import React, { useState } from "react";
import "./SignupStep1.css";
import kangarooLogo from "./kangaroo.png";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";

function SignStep1({}) {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;

    setAgreements((prev) => {
      const updated = { ...prev, [name]: checked };

      updated.all = updated.terms && updated.privacy && updated.marketing;

      return updated;
    });
  };

  const handleAllChange = (e) => {
    const { checked } = e.target;
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const isRequiredChecked = agreements.terms && agreements.privacy;

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title={"회원가입"} />
        <div className="signup-container">
          <div className="logo-section">
            <div className="circle-logo">
              <img
                src={kangarooLogo}
                alt="당당핏 로고"
                className="kangaroo-img"
              />
            </div>
            <h2>당당핏에 오신 것을</h2>
            <h2 className="welcome-text">환영합니다 :)</h2>
          </div>

          <ul className="agreement-list">
            <li>
              <label>
                <input
                  type="checkbox"
                  name="all"
                  checked={agreements.all}
                  onChange={handleAllChange}
                />
                전체 동의
              </label>
            </li>
            {/* <hr /> */}
            <li>
              <label>
                <input
                  type="checkbox"
                  name="terms"
                  checked={agreements.terms}
                  onChange={handleChange}
                />
                [필수] 서비스 이용 약관 동의
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  name="privacy"
                  checked={agreements.privacy}
                  onChange={handleChange}
                />
                [필수] 개인정보 처리방침 동의
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  name="marketing"
                  checked={agreements.marketing}
                  onChange={handleChange}
                />
                [선택] 마케팅 정보 수신 동의
              </label>
            </li>
          </ul>

          <button
            className="next-btn"
            onClick={() => navigate("/signupstep2")}
            disabled={!isRequiredChecked}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignStep1;
