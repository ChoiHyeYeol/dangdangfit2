// src/pages/profile/ProfileInfoForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profileInfoForm.css";
import Header from "../../../../components/Header";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ProfileInfoForm() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nickname: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [currentNickname, setCurrentNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 닉네임 규칙
  const validateNickname = (nick) => {
    const trimmed = nick.trim();
    if (!trimmed) return "닉네임을 입력해 주세요.";
    if (trimmed.length < 2 || trimmed.length > 16)
      return "닉네임은 2~16자로 입력해 주세요.";
    if (!/^[가-힣a-zA-Z0-9]+$/.test(trimmed))
      return "닉네임은 한글, 영문, 숫자만 가능합니다.";
    return "";
  };

  // 비밀번호 규칙
  const validatePassword = (pw) => {
    if (!pw) return "";
    if (pw.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    const checks = [
      /[A-Za-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ];
    if (checks.filter(Boolean).length < 2) {
      return "영문, 숫자, 특수문자 중 2가지 이상 조합하세요.";
    }
    return "";
  };

  // 🔹 로그인 직후 닉네임 가져오기
  useEffect(() => {
    axios
      .get("/api/main", { withCredentials: true })
      .then((res) => setCurrentNickname(res.data.nickname || ""))
      .catch(() => setCurrentNickname(""));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    if (name === "nickname") {
      const err = validateNickname(value);
      if (err) {
        setNicknameMessage(err);
      } else if (value.trim() === currentNickname) {
        setNicknameMessage("현재 닉네임과 같습니다.");
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
      }
    }

    if (["newPassword", "confirmPassword"].includes(name)) {
      const newPw = name === "newPassword" ? value : form.newPassword;
      const confirmPw =
        name === "confirmPassword" ? value : form.confirmPassword;

      const pwErr = validatePassword(newPw);
      if (pwErr) {
        setPasswordMessage(pwErr);
      } else if (
        newPw &&
        form.currentPassword &&
        newPw === form.currentPassword
      ) {
        setPasswordMessage("현재 비밀번호와 동일합니다.");
      } else if (newPw && confirmPw && newPw === confirmPw) {
        setPasswordMessage("사용 가능한 비밀번호입니다.");
      } else if (newPw && confirmPw && newPw !== confirmPw) {
        setPasswordMessage("새 비밀번호와 확인값이 일치하지 않습니다.");
      } else {
        setPasswordMessage("");
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.nickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    if (form.nickname.trim() === currentNickname) {
      alert("현재 닉네임과 같습니다. 변경 후 저장하세요.");
      return;
    }
    if (nicknameMessage && !nicknameMessage.includes("사용 가능")) {
      alert(nicknameMessage);
      return;
    }
    if (passwordMessage && passwordMessage !== "사용 가능한 비밀번호입니다.") {
      alert(passwordMessage);
      return;
    }

    try {
      await axios.post(
        "/api/my/update/user",
        {
          nickName: form.nickname,
          userPassword: form.newPassword || form.currentPassword,
        },
        { withCredentials: true }
      );

      alert("계정 정보가 변경되었습니다.");
      nav(-1);
    } catch (err) {
      const errMsg = err.response?.data || "저장 중 오류 발생";
      alert(errMsg);
    }
  };

  /* ====== 👇 추가: 로그아웃/회원탈퇴 핸들러 ====== */
  const handleLogout = async () => {
    try {
      await axios.get("/api/userauth/logout", { withCredentials: true });
      alert("로그아웃 되었습니다.");
      nav("/signin");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleWithdraw = () => {
    if (window.confirm("정말 회원탈퇴 하시겠습니까?")) {
      alert("회원탈퇴 처리되었습니다.");
      // TODO: 실제 회원탈퇴 API 연결
    }
  };
  /* ============================================ */

  return (
    <div className="app-wrap">
      <div className="app">
        <div className="content-scroll">
          <Header title="개인 정보 수정" />
          <div className="p-wrap">
            <section className="p-card-box">
              <form className="p-form" onSubmit={onSubmit}>
                {/* 닉네임 */}
                <div className="p-field">
                  <label className="p-label" htmlFor="nickname">
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    value={form.nickname}
                    onChange={onChange}
                    className="p-input"
                    placeholder="예: 임당러버"
                  />
                  {nicknameMessage && (
                    <span
                      className={
                        nicknameMessage.includes("사용 가능")
                          ? "p-success"
                          : "p-error"
                      }
                    >
                      {nicknameMessage}
                    </span>
                  )}
                </div>

                {/* 현재 비밀번호 */}
                <div className="p-field">
                  <label className="p-label" htmlFor="currentPassword">
                    현재 비밀번호
                  </label>
                  <div className="p-input-wrap">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={form.currentPassword}
                      onChange={onChange}
                      className="p-input"
                      placeholder="현재 비밀번호"
                    />
                    <button
                      type="button"
                      className="p-eye"
                      onClick={() =>
                        setShowPassword((s) => ({ ...s, current: !s.current }))
                      }
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* 새 비밀번호 */}
                <div className="p-field">
                  <label className="p-label" htmlFor="newPassword">
                    새 비밀번호
                  </label>
                  <div className="p-input-wrap">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={form.newPassword}
                      onChange={onChange}
                      className="p-input"
                      placeholder="8자 이상, 영문/숫자/특수문자 조합"
                    />
                    <button
                      type="button"
                      className="p-eye"
                      onClick={() =>
                        setShowPassword((s) => ({ ...s, new: !s.new }))
                      }
                    >
                      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* 새 비밀번호 확인 */}
                <div className="p-field">
                  <label className="p-label" htmlFor="confirmPassword">
                    새 비밀번호 확인
                  </label>
                  <div className="p-input-wrap">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={onChange}
                      className="p-input"
                      placeholder="한 번 더 입력"
                    />
                    <button
                      type="button"
                      className="p-eye"
                      onClick={() =>
                        setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
                      }
                    >
                      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {passwordMessage && (
                  <div
                    className={
                      passwordMessage.includes("사용 가능")
                        ? "p-success"
                        : "p-error"
                    }
                    role="alert"
                  >
                    {passwordMessage}
                  </div>
                )}

                <div className="p-actions">
                  <button
                    type="button"
                    className="p-btn ghost"
                    onClick={() => nav(-1)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="p-btn primary"
                    disabled={!form.nickname.trim()}
                  >
                    변경
                  </button>
                </div>
              </form>
            </section>

            {/* ===== 👇 추가: 하단 로그아웃 & 회원탈퇴 바 ===== */}
            <div className="p-account-actions">
              <button type="button" onClick={handleLogout}>
                로그아웃
              </button>
              <span className="divider">|</span>
              <button type="button" className="danger" onClick={handleWithdraw}>
                회원탈퇴
              </button>
            </div>
            {/* ========================================== */}
          </div>
        </div>
      </div>
    </div>
  );
}
