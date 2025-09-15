// src/features/survey/Survey_allergySelection.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import common from "./Survey_common.module.css";
import styles from "./Survey_allergySelection.module.css";

import {
  searchIcon,
  search_activeIcon,
  warnIcon,
} from "../survey_images/Survey_images";

import {
  allergyCategories,
  buildAllergyIndex,
  normalize,
  allergyIdMap,
} from "./Survey_allergyData";

export default function Survey_allergySelection({
  prev = "/survey/meal/preference",
  next = "/survey/done",
  pageIndex = 7,
  totalPages = 7,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 수정 모드 여부
  const params = new URLSearchParams(location.search);
  const isEditMode =
    params.get("from") === "edit" || location.state?.from === "edit";

  const [selected, setSelected] = useState(new Set());
  const [others, setOthers] = useState([]);
  const [etcInput, setEtcInput] = useState("");
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEtcFocused, setIsEtcFocused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ✅ 중복제출 방지

  // 전체 인덱스
  const allItems = useMemo(() => buildAllergyIndex(allergyCategories), []);

  // 검색 제안
  const suggestions = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return [];
    return allItems.filter((it) => it.norm.includes(q));
  }, [search, allItems]);

  const noResult = search.trim().length > 0 && suggestions.length === 0;

  // 선택 토글
  const toggleItem = (name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  // 검색에서 추가(=토글) 후 닫기
  const addFromSearch = (name) => {
    toggleItem(name);
    setSearch("");
    setIsSearchFocused(false);
  };

  // 기타(쉼표 구분) 추가
  const addOthers = () => {
    const tokens = etcInput
      .split(/,|，/g)
      .map((t) => t.trim())
      .filter(Boolean);
    if (!tokens.length) return;

    setOthers((prev) => {
      const merged = [...prev];
      tokens.forEach((t) => {
        if (!merged.includes(t)) merged.push(t);
      });
      return merged;
    });
    setEtcInput("");
  };

  // 이동/제출
  const goPrev = () => navigate(prev);
  const openConfirm = () => setShowConfirm(true);

  const handleSubmit = async () => {
    if (submitting) return;
    setShowConfirm(false);

    // ✅ label → id 변환
    const selectedIds = Array.from(selected)
      .map((label) => allergyIdMap[label])
      .filter(Boolean);

    const payload = {
      answer16: selectedIds, // 서버 DTO: List<Integer> answer16
      // 필요 시 기타 항목 서버 스키마에 맞춰 추가: e.g. answer16Etc: others
    };

    try {
      setSubmitting(true);
      await axios.post("/api/survey/allergy", payload, {
        withCredentials: true,
      });

      if (isEditMode) {
        // ✅ 수정 모드: 저장 후 "이전 페이지"로 복귀
        navigate(-1);
      } else {
        // 일반 모드: 다음 단계로
        navigate(next);
      }
    } catch (err) {
      console.error("알레르기 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 스크림 열림 조건
  const isDropdownOpen = search.trim().length > 0;
  const isSearchActive = (isSearchFocused || isDropdownOpen) && !isEtcFocused;

  return (
    <div className={common.surveyContainer}>
      {/* 헤더 자리 */}
      <div className={common.headerPlaceholder} />

      {/* 본문 */}
      <div className={common.contentWrap}>
        {/* 페이지 인디케이터 (수정 모드에서는 숨김) */}
        {!isEditMode && (
          <div className={common.pageIndicator}>
            {pageIndex} / {totalPages}
          </div>
        )}

        <h3 className={common.title}>11. 알레르기가 있는 음식을 골라주세요.</h3>

        {/* 검색 */}
        <div
          className={`${styles.searchWrap} ${
            isDropdownOpen ? styles.searchWrapOpen : ""
          }`}
        >
          <input
            className={styles.searchInput}
            type="text"
            placeholder="키워드"
            value={search}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions[0]) {
                addFromSearch(suggestions[0].name);
              }
            }}
          />
          <button
            className={styles.searchBtn}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // blur 방지
            onClick={() => {
              if (suggestions[0]) addFromSearch(suggestions[0].name);
            }}
            aria-label="검색"
          >
            <img
              src={isSearchFocused ? search_activeIcon : searchIcon}
              alt="검색"
              className={styles.iconImg}
            />
          </button>

          {isDropdownOpen && (
            <div className={styles.searchDropdown}>
              {noResult ? (
                <div className={styles.noResultBox}>
                  <img
                    src={warnIcon}
                    alt="경고"
                    className={styles.noResultIconImg}
                  />
                  <div className={styles.noResultText}>
                    검색 결과가 없습니다.
                    <br />
                    직접 기타에 적고 ‘추가’를 눌러주세요.
                  </div>
                </div>
              ) : (
                <ul className={styles.suggestionList}>
                  {suggestions.map((s) => (
                    <li key={`${s.catKey}-${s.name}`}>
                      <button
                        type="button"
                        className={styles.suggestionItem}
                        onMouseDown={(e) => e.preventDefault()} // blur 방지
                        onClick={() => addFromSearch(s.name)}
                      >
                        <span className={styles.suggestionName}>{s.name}</span>
                        <span className={styles.suggestionCat}>
                          {s.catLabel}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/*  스크림(검색 집중 모드) */}
        {isSearchActive && (
          <div
            className={styles.scrim}
            onClick={() => {
              setSearch("");
              setIsSearchFocused(false);
            }}
          />
        )}

        {/* 카테고리 카드 */}
        <div className={styles.categoryStack}>
          {allergyCategories.map((cat) => (
            <section className={styles.categoryCard} key={cat.key}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryBadge}>{cat.label}</span>
              </div>
              <div className={styles.pillGrid}>
                {cat.items.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.pillBtn} ${
                      selected.has(label) ? styles.pillSelected : ""
                    }`}
                    onClick={() => toggleItem(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 기타: 하단 고정 */}
      <section className={styles.etcSection}>
        <div className={styles.etcInner}>
          <div className={styles.etcHeader}>기타</div>
          <div className={styles.etcRow}>
            <input
              className={styles.etcInput}
              type="text"
              placeholder="예: 자몽, 양배추 (쉼표로 구분)"
              value={etcInput}
              onFocus={() => setIsEtcFocused(true)}
              onBlur={() => setIsEtcFocused(false)}
              onChange={(e) => setEtcInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addOthers();
              }}
            />
            <button
              type="button"
              className={styles.etcAddBtn}
              onClick={addOthers}
            >
              추가
            </button>
          </div>

          {others.length > 0 && (
            <div className={styles.othersChips}>
              {others.map((o) => (
                <span key={o} className={styles.otherChip}>
                  {o}
                  <button
                    className={styles.otherChipX}
                    onClick={() =>
                      setOthers((prev) => prev.filter((x) => x !== o))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 하단 네비 */}
      <div className={common.bottomBar}>
        <div className={common.bottomInner}>
          {isEditMode ? (
            <>
              <button
                type="button"
                className={common.prevBtn}
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                취소
              </button>
              <button
                type="button"
                className={common.nextBtn}
                onClick={openConfirm}
                disabled={submitting}
              >
                저장 후 돌아가기
              </button>
            </>
          ) : (
            <>
              <button type="button" className={common.prevBtn} onClick={goPrev}>
                이전
              </button>
              <button
                type="button"
                className={common.nextBtn}
                onClick={openConfirm}
              >
                제출
              </button>
            </>
          )}
        </div>
      </div>

      {/* 제출 확인 모달 */}
      {showConfirm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h4 className={styles.modalTitle}>
              {isEditMode ? "저장 전에 확인해주세요" : "제출 전에 확인해주세요"}
            </h4>

            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>선택된 알레르기</div>
              {Array.from(selected).length === 0 ? (
                <div className={styles.modalEmpty}>선택한 항목이 없습니다.</div>
              ) : (
                <div className={styles.modalList}>
                  {Array.from(selected).map((s) => (
                    <span key={s} className={styles.modalPill}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>기타</div>
              {others.length === 0 ? (
                <div className={styles.modalEmpty}>기타 입력 없음</div>
              ) : (
                <div className={styles.modalList}>
                  {others.map((o) => (
                    <span key={o} className={styles.modalPill}>
                      {o}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                돌아가기
              </button>
              <button
                type="button"
                className={styles.modalSubmit}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {isEditMode ? "저장하기" : "제출하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
