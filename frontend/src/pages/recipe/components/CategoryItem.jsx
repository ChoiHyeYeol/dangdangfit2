import React from "react";
import "./CategoryItem.css";

const CategoryItem = ({ image, name }) => {
  return (
    <div className="category-item-container">
      <div className="category-image">
        <img src={image} alt={name} />
      </div>
      <p className="category-name">{name}</p>
    </div>
  );
};

export default CategoryItem;
