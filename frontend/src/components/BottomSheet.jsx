import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/bottomsheet.css";

/**
 * props
 * - open, title, onClose, children
 * - maxHeight: "92svh" 등 (기본 80dvh)
 * - minHeight: "56svh" 등 (기본 0px)
 */
export default function BottomSheet({
  open,
  title,
  onClose,
  children,
  maxHeight = "80dvh",
  minHeight = "56svh",
}) {
  const hostRef = useRef(null);
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const lastFocusRef = useRef(null);

  // ESC 닫기 + 포커스 복귀
  useEffect(() => {
    if (!open) return;
    lastFocusRef.current = document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey, { capture: true });
    // 포커스 이동하되 배경 스크롤 유발 금지
    requestAnimationFrame(() =>
      sheetRef.current?.focus({ preventScroll: true })
    );

    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      lastFocusRef.current && lastFocusRef.current.focus?.();
    };
  }, [open, onClose]);

  // ✅ 배경 스크롤 차단: wheel/touchmove/키보드 이벤트를 전역 캡처로 막기
  useEffect(() => {
    if (!open) return;

    const allowInside = (target) =>
      sheetRef.current && sheetRef.current.contains(target);

    const stopWheel = (e) => {
      if (!allowInside(e.target)) e.preventDefault();
    };
    const stopTouch = (e) => {
      if (!allowInside(e.target)) e.preventDefault();
    };
    const stopKeys = (e) => {
      // 스크롤 유발 키
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (keys.includes(e.key) && !allowInside(e.target)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", stopWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchmove", stopTouch, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", stopKeys, { capture: true });

    return () => {
      window.removeEventListener("wheel", stopWheel, { capture: true });
      window.removeEventListener("touchmove", stopTouch, { capture: true });
      window.removeEventListener("keydown", stopKeys, { capture: true });
    };
  }, [open]);

  // 열림 애니메이션 트리거 (host/backdrop, sheet)
  useEffect(() => {
    if (!open) return;
    const host = hostRef.current;
    const sheet = sheetRef.current;
    requestAnimationFrame(() => {
      host?.classList.add("open");
      sheet?.classList.add("open");
    });
    return () => {
      host?.classList.remove("open");
      sheet?.classList.remove("open");
    };
  }, [open]);

  if (!open) return null;

  // 프레임 내부 포털 (없으면 body)
  const mount = document.getElementById("app-portal") || document.body;

  return createPortal(
    <div className="sheet-host" ref={hostRef}>
      <div
        className="sheet-backdrop"
        ref={backdropRef}
        onClick={onClose}
        role="presentation"
      >
        <div
          className="sheet"
          ref={sheetRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          style={{ "--sheet-max-h": maxHeight, "--sheet-min-h": minHeight }}
        >
          <div className="sheet-handle" />
          <div className="sheet-header">
            <h3 className="sheet-title">{title}</h3>
            <button className="sheet-close" onClick={onClose} aria-label="닫기">
              ✕
            </button>
          </div>
          <div className="sheet-body">{children}</div>
        </div>
      </div>
    </div>,
    mount
  );
}
