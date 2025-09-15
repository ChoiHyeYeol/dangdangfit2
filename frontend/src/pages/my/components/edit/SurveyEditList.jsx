import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import "./surveyEditlist.css";

/** 사용자의 기존 설문 요약을 불러오는 헬퍼 (예시)
 *  - 실제 API 규격/경로에 맞게 바꾸세요.
 *  - 여기서는 1) localStorage → 2) 서버 GET 순으로 시도합니다.
 */
async function fetchSurveySnapshot() {
  // 1) localStorage 시도
  try {
    const raw = localStorage.getItem("survey_snapshot");
    if (raw) return JSON.parse(raw);
  } catch (_) {}

  // 2) 서버에서 불러오기 (예시 URL/필드명)
  try {
    const res = await fetch("/api/survey/me", { credentials: "include" });
    if (res.ok) {
      const json = await res.json();
      return json; // 예: { measure_method: 'none' | 'smbg' | 'cgm', ... }
    }
  } catch (_) {}

  return null;
}

/** 설문 라우트 템플릿 */
const ROUTES = {
  BASIC: "/survey/basic-info",
  FPG_KNOWN: "/survey/bstrend/fpg",
  FPG_UNKNOWN: "/survey/bstrend/unknown-fpg",
  PPG_KNOWN: "/survey/bstrend/ppg",
  PPG_UNKNOWN: "/survey/bstrend/unknown-ppg",
  DIET_COMPOSE: "/survey/diet/compose",
  HABITS: "/survey/habits",
  MEAL_PREF: "/survey/meal/preference",
  ALLERGY: "/survey/allergy",
};

const surveyQuestions = [
  "체중을 입력해주세요.", // 1
  "혈당 측정 방법을 골라 주세요.", // 2
  "공복 혈당 사례를 선택해주세요.", // 3
  "식후 혈당 사례를 선택해주세요.", // 4
  "식이 구성이 어떻게 되시나요?", // 5
  "동시 섭취 습관이 어떻게 되시나요?", // 6
  "최근 2주 간 체중 변화가 어떻게 되시나요?", // 7
  "최근 2주 간 식사량이 변화했거나 야식이 증가했나요?", // 8
  "인슐린을 투약하시나요? 투약하신다면 어떤 종류인가요?", // 9
  "어떤 식단을 선호하시나요?", // 10
  "알레르기가 있는 음식을 골라주세요.", // 11
];

/** 프레임(.app) 내부 모달: content-scroll만 잠그는 스크롤락 */
function useContentScrollLock(open) {
  useEffect(() => {
    const sc = document.querySelector(".content-scroll");
    if (!sc) return;
    if (open) sc.classList.add("is-locked");
    else sc.classList.remove("is-locked");
    return () => sc.classList.remove("is-locked");
  }, [open]);
}

/** 경로 확인 모달 (앱 프레임 안에서 헤더 포함 중앙) */
function ConfirmRouteModal({ open, onClose, onPick, kind, method }) {
  const isFPG = kind === "fpg";
  const title = isFPG ? "공복 혈당 수정 경로" : "식후 혈당 수정 경로";
  const isUnknown = method === "none";
  const currentRouteLabel = isUnknown
    ? "미측정(모름) 경로"
    : method
    ? "자가혈당기/CGM 경로"
    : "미확인";
  const currentMethodLabel =
    method === "none"
      ? "미측정"
      : method === "smbg"
      ? "자가혈당기"
      : method === "cgm"
      ? "CGM"
      : "미확인";

  // 프레임 내부 스크롤락
  useContentScrollLock(open);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 포커스 관리
  const firstBtnRef = useRef(null);
  useEffect(() => {
    if (open && firstBtnRef.current) firstBtnRef.current.focus();
  }, [open]);

  if (!open) return null;

  const defaultRoute = isUnknown
    ? isFPG
      ? ROUTES.FPG_UNKNOWN
      : ROUTES.PPG_UNKNOWN
    : isFPG
    ? ROUTES.FPG_KNOWN
    : ROUTES.PPG_KNOWN;

  const onOverlayClick = (e) => {
    if (e.target.classList.contains("branch-modal-overlay--frame")) onClose();
  };

  return (
    <div
      className="branch-modal-overlay--frame"
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-modal-title"
      onMouseDown={onOverlayClick}
    >
      <div
        className="branch-modal-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h4 id="branch-modal-title" className="branch-modal-title">
          {title}
        </h4>

        <p className="branch-modal-desc">
          현재 저장된 혈당 측정 방법: <strong>{currentMethodLabel}</strong>
          <br />
          기본 이동 경로: <strong>{currentRouteLabel}</strong>
        </p>

        <div className="branch-modal-actions">
          <button
            ref={firstBtnRef}
            className="branch-btn ghost"
            onClick={() =>
              onPick(isFPG ? ROUTES.FPG_UNKNOWN : ROUTES.PPG_UNKNOWN)
            }
          >
            미측정(모름) 경로로
          </button>
          <button
            className="branch-btn primary"
            onClick={() => onPick(isFPG ? ROUTES.FPG_KNOWN : ROUTES.PPG_KNOWN)}
          >
            자가혈당기/CGM 경로로
          </button>
        </div>

        <div className="branch-modal-sep" />

        <div className="branch-modal-actions">
          <button
            className="branch-btn outline"
            onClick={() => onPick(defaultRoute)}
          >
            기본 경로로 이동
          </button>
          <button className="branch-btn text" onClick={onClose}>
            취소
          </button>
        </div>

        <button
          className="branch-modal-close"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function SurveyEditList() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(null);

  // 팝업 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmKind, setConfirmKind] = useState(null); // 'fpg' | 'ppg'
  const [confirmMethod, setConfirmMethod] = useState(null); // 'none' | 'smbg' | 'cgm' | null
  const [pendingIndex, setPendingIndex] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await fetchSurveySnapshot();
      setSnapshot(s);
      setLoading(false);
    })();
  }, []);

  const pushWithEdit = useCallback(
    (target, index) => {
      nav(`${target}?from=edit&q=${index + 1}`, {
        state: { from: "edit", questionId: index + 1 },
      });
    },
    [nav]
  );

  const handleConfirmPick = useCallback(
    (route) => {
      setConfirmOpen(false);
      if (route && pendingIndex != null) {
        pushWithEdit(route, pendingIndex);
        setPendingIndex(null);
        setConfirmKind(null);
        setConfirmMethod(null);
      }
    },
    [pendingIndex, pushWithEdit]
  );

  const handleSelect = useCallback(
    (index) => {
      if (loading) return;

      switch (index) {
        // 1. 체중, 2. 측정방법 → 기본정보
        case 0:
        case 1:
          return pushWithEdit(ROUTES.BASIC, index);

        // 3. 공복 혈당 → 팝업
        case 2: {
          const mm = snapshot?.measure_method ?? null; // 'none' | 'smbg' | 'cgm' | null
          setPendingIndex(index);
          setConfirmKind("fpg");
          setConfirmMethod(mm);
          setConfirmOpen(true);
          return;
        }

        // 4. 식후 혈당 → 팝업
        case 3: {
          const mm = snapshot?.measure_method ?? null;
          setPendingIndex(index);
          setConfirmKind("ppg");
          setConfirmMethod(mm);
          setConfirmOpen(true);
          return;
        }

        // 5~7 → 식이 구성(통합)
        case 4:
        case 5:
        case 6:
          return pushWithEdit(ROUTES.DIET_COMPOSE, index);

        // 8~9 → 식습관
        case 7:
        case 8:
          return pushWithEdit(ROUTES.HABITS, index);

        // 10 → 식단 선호
        case 9:
          return pushWithEdit(ROUTES.MEAL_PREF, index);

        // 11 → 알레르기
        case 10:
          return pushWithEdit(ROUTES.ALLERGY, index);

        default:
          return nav("/survey");
      }
    },
    [loading, nav, pushWithEdit, snapshot]
  );

  return (
    <div className="app-wrap">
      <div className="app">
        {/* .app는 position: relative 여야 함 */}
        <Header title="설문조사 수정" />

        {/* ✅ 모달을 .app 바로 아래(헤더 포함)에서 렌더 */}
        <ConfirmRouteModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onPick={handleConfirmPick}
          kind={confirmKind}
          method={confirmMethod}
        />

        <div className="content-scroll">
          <div className="survey-edit-wrap">
            {loading ? (
              <div
                className="survey-edit-loading"
                role="status"
                aria-live="polite"
              >
                설문 정보를 불러오는 중...
              </div>
            ) : (
              <>
                <header className="survey-edit-header">
                  <p className="survey-edit-sub">
                    수정할 문항 하나를 선택해 주세요.
                  </p>
                </header>

                <ul className="survey-edit-list">
                  {surveyQuestions.map((q, idx) => (
                    <li key={idx} className="survey-edit-item">
                      <button
                        type="button"
                        className="survey-edit-button"
                        onClick={() => handleSelect(idx)}
                        aria-label={`${idx + 1}번 문항 수정: ${q}`}
                      >
                        <span className="survey-edit-number" aria-hidden="true">
                          {idx + 1}
                        </span>
                        <span className="survey-edit-question">{q}</span>
                        <span
                          className="survey-edit-chevron"
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="survey-edit-help">
                  <p>
                    선택한 문항의 <strong>원래 설문 페이지</strong>로 이동해
                    수정합니다.
                    <br />
                    공복/식후 혈당 문항은 저장된 <em>혈당 측정 방법</em>에 따라
                    경로를 선택할 수 있어요.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
