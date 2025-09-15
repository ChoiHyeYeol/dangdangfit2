// src/pages/profile/ProfileEdit.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./profileEdit.css";
import Header from "../../../../components/Header";

export default function ProfileEdit() {
  const nav = useNavigate();

  return (
    <div className="app-wrap">
      <div className="app">
        <div className="content-scroll">
          <Header title="기본 정보 수정" />
          <div className="p-wrap">
            {/* 두 가지 수정 경로 카드 */}
            <section className="p-grid">
              <button
                type="button"
                className="p-card"
                onClick={() => nav("/my/edit/info")}
              >
                <div className="p-card-title">개인정보 수정</div>
                <p className="p-card-desc">
                  닉네임, 비밀번호 등 개인 정보를 변경합니다.
                </p>
                <div className="p-card-chev">›</div>
              </button>

              <button
                type="button"
                className="p-card"
                onClick={() => nav("/my/edit/update")}
              >
                <div className="p-card-title">설문조사 수정</div>
                <p className="p-card-desc">
                  식습관, 알레르기 등 설문조사의 답변을 변경합니다.
                  <br />
                  변경된 답변을 바탕으로 식단이 재구성됩니다.
                </p>
                <div className="p-card-chev">›</div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
