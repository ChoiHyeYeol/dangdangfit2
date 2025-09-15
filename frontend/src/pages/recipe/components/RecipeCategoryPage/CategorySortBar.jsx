import React, { useState } from "react";
import "./CategorySortBar.css";
import { FiChevronDown } from "react-icons/fi"; // 깔끔한 화살표 아이콘

export default function CategorySortBar({
  options = ["추천순", "최신순"],
  selected = "추천순",
  onChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cat-sortbar">
      <button className="cat-sortbar__btn" onClick={() => setOpen(!open)}>
        <span>{selected}</span>
        {/* <span className="cat-sortbar__arrow">▼</span> */}
        <FiChevronDown className="cat-sortbar__arrow" />
      </button>

      {open && (
        <div className="cat-sortbar__menu">
          {options.map((opt) => (
            <button
              key={opt}
              className={`cat-sortbar__item ${
                opt === selected ? "is-active" : ""
              }`}
              onClick={() => {
                onChange?.(opt);
                setOpen(false);
              }}
            >
              {opt}
              {opt === selected && (
                <span className="cat-sortbar__check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
