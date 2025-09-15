// src/pages/diet/components/CategoryList.jsx
import React from "react";
import { Link } from "react-router-dom"; // ✅ 추가
import CategoryItem from "./CategoryItem";
import "./CategoryList.css";

const CategoryList = ({ items, group = "method" }) => {
  // ✅ group prop 추가 (기본: 방식별)
  return (
    <div className="category-list-container">
      {items.map((item, index) => (
        <Link
          key={index}
          to={`/recipe/category/${encodeURIComponent(
            item.label
          )}?group=${group}`} // ✅ group 붙여서 전달
          className="category-link"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CategoryItem image={item.image} name={item.label} />
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
