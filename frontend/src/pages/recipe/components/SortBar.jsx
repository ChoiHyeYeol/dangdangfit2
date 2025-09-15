// src/pages/diet/components/SortBar.jsx
import React, { useState } from "react";
import "./SortBar.css";
import { FiChevronDown } from "react-icons/fi"; // 깔끔한 화살표 아이콘

const SortBar = ({ onSelect, selected = "방식별" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((v) => !v);
  const handleSelect = (option) => {
    setIsOpen(false);
    onSelect?.(option); // 부모 상태만 변경
  };

  return (
    <div className="sort-bar-container">
      <div className="dropdown-button" onClick={handleToggle}>
        <span>{selected}</span> {/* ✅ 라벨 = 부모가 준 selected */}
        {/* <span className="arrow-icon">▼</span> */}
        <FiChevronDown className="arrow-icon" />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div
            className={`dropdown-main-item ${
              selected === "방식별" ? "selected" : ""
            }`}
            onClick={() => handleSelect("방식별")}
          >
            방식별
            <div className="item-description">요리 방식에 따라</div>
            {selected === "방식별" && <span className="check-mark">✓</span>}
          </div>

          <div
            className={`dropdown-main-item ${
              selected === "시간별" ? "selected" : ""
            }`}
            onClick={() => handleSelect("시간별")}
          >
            시간별
            <div className="item-description">먹는 시간에 따라</div>
            {selected === "시간별" && <span className="check-mark">✓</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortBar;
