import React from "react";
import { useNavigate } from "react-router-dom";
import "./quicknav.css"; // ✅ 전역 CSS로 임포트

import recipeIcon from "../../../assets/re.png";
import editIcon from "../../../assets/Fork.png";

const DEFAULT_ITEMS = [
  {
    label: "나의 레시피",
    to: "/collection",
    icon: editIcon,
    bg: "#EAFBEF",
  },
  {
    label: "기본 정보 수정",
    to: "/my/edit",
    icon: recipeIcon,
    bg: "#E7ECFF",
  },
];

export default function QuickNav({ items = DEFAULT_ITEMS }) {
  const nav = useNavigate();
  return (
    <nav className="qnav" aria-label="바로가기">
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          className="qnav-row"
          onClick={() => nav(it.to)}
        >
          <span className="qnav-icon" style={{ background: it.bg }}>
            <img src={it.icon} alt="" aria-hidden="true" />
          </span>
          <span className="qnav-label">{it.label}</span>
          <span className="qnav-chev" aria-hidden="true">
            ›
          </span>
        </button>
      ))}
    </nav>
  );
}
