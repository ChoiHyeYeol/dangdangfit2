import { useState } from "react";
import "./SignupStep2.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ 아이콘 추가
import "react-datepicker/dist/react-datepicker.css";

// ✅ 절대주소 금지! 배포/개발 공통으로 동작하도록 상대경로 사용
const JOIN_URL = "/api/userauth/join";

function SignupStep2() {
  const navigate = useNavigate();
  const [birth, setBirth] = useState(null);

  const [form, setForm] = useState({
    id: "",
    password: "",
    username: "",
    nickname: "",
    birth: "",
    week: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁 눈 아이콘 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.id.trim() &&
    form.password.trim() &&
    form.username.trim() &&
    form.nickname.trim() &&
    form.birth.trim() &&
    form.week.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const week = Number(form.week);
    if (week < 1 || week > 40) {
      alert("임신 주차는 1~40 사이여야 합니다.");
      return;
    }

    const payload = {
      userID: form.id,
      userPassword: form.password,
      userName: form.username,
      nickName: form.nickname,
      birthDate: form.birth,
      pregWeek: week,
    };

    try {
      const res = await axios.post(JOIN_URL, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // 세션/쿠키 기반이면 유지 권장(아니면 있어도 무해)
      });

      // 백엔드 구현에 따라 200/201/204 중 하나가 올 수 있음
      if ([200, 201, 204].includes(res.status)) {
        navigate("/signupstep3");
      } else {
        alert("회원가입 처리 결과를 확인하세요.");
      }
    } catch (err) {
      console.error(err);
      alert("회원가입 실패!");
    }
  };

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title={"회원가입"} />
        <div className="signup-form-container">
          <p className="form-intro">회원가입을 위한 정보를 입력해주세요.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                이름 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                아이디 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
              />
            </div>

            <div className="form-group password-field">
              <label>
                비밀번호 <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                닉네임 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                생년월일 <span className="required">*</span>
              </label>
              <input
                type="date"
                name="birth"
                placeholder="YYYY-MM-DD"
                value={form.birth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                임신 주차 <span className="required">*</span>
              </label>
              <input
                type="number"
                name="week"
                placeholder="0 ~ 40까지의 수만 입력하세요"
                value={form.week}
                min={0}
                max={40}
                onChange={(e) => {
                  let value = e.target.value;

                  // 빈칸 허용
                  if (value === "") {
                    setForm((prev) => ({ ...prev, week: "" }));
                    return;
                  }

                  let num = Number(value);

                  // 0~40 범위에서만 허용
                  if (num >= 0 && num <= 40) {
                    setForm((prev) => ({ ...prev, week: value }));
                  }
                }}
                onKeyDown={(e) => {
                  // 허용할 키만 통과
                  if (
                    [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                    ].includes(e.key)
                  ) {
                    return;
                  }

                  // 숫자만 입력 허용
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid}
            >
              가입 완료
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupStep2;
