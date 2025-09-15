// src/Signin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./user.css";
import kangarooLogo from "./components/kangaroo.png";
import Header from "../../components/Header";

// ✅ 공통 API 인스턴스: 같은 오리진(/api)로 호출
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 세션 쿠키 왕복
  headers: { "Content-Type": "application/json" },
});

function Signin() {
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setSubmitting(true);

    // 서버 DTO에 맞춰 필드명 구성 (필요시 키 이름 맞추세요)
    const payload = {
      userID: form.id,
      userPassword: form.password,
    };

    try {
      const res = await api.post("/userauth/login", payload);

      // 서버 응답 구조에 맞춰 분기 (예: { success: true, surveyCompleted: true })
      if (res.status === 200 && res.data?.success) {
        alert("로그인 되었습니다");
        if (res.data.surveyCompleted) {
          navigate("/main");
        } else {
          navigate("/survey");
        }
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      // 401/403 등 메시지 노출
      if (err.response?.status === 401) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 요청 중 오류가 발생했습니다.");
      }
    } finally {
      // ✅ 실패 시 버튼이 영구 비활성 되는 문제 방지
      setSubmitting(false);
    }
  };

  return (
    <div className="app-wrap">
      <div className="app">
        <Header title={"로그인"} />
        <div className="login-container">
          <div className="loginlogo-section">
            <div className="circle-logo">
              <img
                src={kangarooLogo}
                alt="당당핏 로고"
                className="kangaroo-img"
              />
            </div>
          </div>

          <div className="login-section">
            <p className="login-title">
              <strong>
                안녕하세요
                <br />
                당당핏입니다.
              </strong>
            </p>
            <p className="welcome-sub">
              회원 서비스 이용을 위해 로그인 해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={form.id}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="error-msg" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? "로그인 중..." : "로그인하기"}
            </button>
          </form>

          <div className="options">
            <Link to="/signupstep1" className="signup-link">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
