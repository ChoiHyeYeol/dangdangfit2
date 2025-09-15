import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./InfoAccodion.css";

export default function InfoAccordion({
  title = "꼭! 알아두세요",
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="info-accordion">
      <button className="info-header" onClick={() => setOpen((prev) => !prev)}>
        <span>{title}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {open && <div className="info-body">{children}</div>}
    </div>
  );
}
