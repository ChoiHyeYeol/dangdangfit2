import "./SignupStep3.css";
import axios from "axios";
import checkIcon from "./check-icon.png";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import checkAnimation from "../../../assets/lottie/Approve.json"; // JSON 경로 맞춰서 수정

function SignupStep3() {
  const navigate = useNavigate();

  const goToSignin = () => {
    navigate("/signin"); // 로그인 페이지로 이동
  };

  return (
    <div className="app-wrap">
      <div className="app">
        <div className="signup-complete-container">
          <div className="complete-top">
            <div className="check-circle">
              {/* <img src={checkIcon} alt="체크 아이콘" className="check-icon" /> */}
              <Lottie
                animationData={checkAnimation}
                loop={false}
                autoplay={true}
                style={{ width: 240, height: 240 }}
              />
            </div>
            <h2 className="welcome-title">회원가입을 환영합니다!</h2>
            <p className="description">
              로그인한 뒤 맞춤형 식단 추천을
              <br />
              받아보세요.
            </p>
          </div>

          <button className="donestart-btn" onClick={goToSignin}>
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupStep3;
