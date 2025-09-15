import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/footer.css";
/* react-icons */
// import { FaHome, FaUser, FaClipboardList, FaUtensils } from "react-icons/fa";
// import { GiCookingPot, GiCook } from "react-icons/gi";
// import { MdOutlineRestaurantMenu } from "react-icons/md";
/* 비활성/활성 아이콘 */
// import home from "../assets/home.svg";
// import homeActive from "../assets/home-active.svg";
// import recipe from "../assets/recipe.svg";
// import recipeActive from "../assets/recipe-active.svg";
// import meal from "../assets/meal.svg";
// import mealActive from "../assets/meal-active.svg";
// import my from "../assets/my.svg";
// import myActive from "../assets/my-active.svg";
import centerIcon from "../assets/group.png"; // 중앙(FAB)

import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { LuChefHat } from "react-icons/lu";
import { HiOutlineClipboardList } from "react-icons/hi";

const navItems = [
  { label: "홈", path: "/main", icon: <AiOutlineHome /> },
  { label: "레시피", path: "/recipe", icon: <LuChefHat /> },
  { label: "", center: true, icon: <img src={centerIcon} alt="챗봇" /> },
  { label: "식단", path: "/meal", icon: <HiOutlineClipboardList /> },
  { label: "마이", path: "/my", icon: <AiOutlineUser /> },
];
export default function Footer() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const isActive = (item) => {
    if (item.center) return false; // 중앙은 활성 처리 X
    if (item.path === "/") return pathname === "/";
    return pathname.startsWith(item.path);
  };

  const handleCenterClick = () => {
    // 전역 이벤트로 챗봇 열기 신호 발행
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  const handleGo = (item) => {
    if (item.center) handleCenterClick();
    else if (item.path) nav(item.path);
  };

  return (
    <nav className="footer" aria-label="하단 내비게이션">
      {navItems.map((item, idx) => {
        const active = isActive(item);
        const iconSrc = active && item.iconActive ? item.iconActive : item.icon;

        const a11y = item.center
          ? {
              role: "button",
              "aria-haspopup": "dialog",
              "aria-label": "챗봇 열기",
            }
          : { role: "link", "aria-current": active ? "page" : undefined };

        return (
          <div
            key={idx}
            tabIndex={0}
            className={`footer-item ${item.center ? "footer-center" : ""} ${
              active ? "is-active" : ""
            }`}
            onClick={() => handleGo(item)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleGo(item)
            }
            {...a11y}
          >
            {item.center ? (
              item.icon
            ) : (
              <div
                className="footer-icon"
                style={{ color: active ? "#008a69" : "#6b7280" }}
              >
                {item.icon}
              </div>
            )}
            {item.label && <span className="footer-label">{item.label}</span>}
          </div>
        );
      })}
    </nav>
  );
}
