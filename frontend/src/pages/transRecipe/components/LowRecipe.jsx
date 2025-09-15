// src/pages/main/components/trans/LowRecipe.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./lowrecipe.css";
// import iconSave from "../../../assets/bookmark.png";
// import iconSaveFilled from "../../../assets/bookmark-filled.png";
// import Toast from "../../../components/Toast";
// import axios from "axios";

export default function LowRecipe() {
  const nav = useNavigate();
  // const [isSaved, setIsSaved] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  // const [previewImage, setPreviewImage] = useState(null); // ✅ 업로드된 이미지

  const location = useLocation();
  // const { rcpNm } = useParams();
  const recipe = location.state?.recipe;
  // const [isSaved, setIsSaved] = useState(false); // 저장 버튼 눌렀는지 여부
  // const [showToast, setShowToast] = useState(false);

  // 페이지 벗어날 때 → 저장 안 했으면 삭제
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (!isSaved && recipe?.rcpId) {
  //       axios
  //         .post("/api/recipe/delete", { rcp_Id: recipe.rcpId })
  //         .then(() => console.log("레시피 삭제됨"))
  //         .catch((err) => console.error("삭제 실패:", err));
  //     }
  //   };

  //   // 컴포넌트 언마운트 시에만 실행
  //   return () => {
  //     handleBeforeUnload();
  //   };
  //   // 🚨 빈 배열로 두면 mount/unmount에서만 실행 → 업데이트에는 안 돎
  // }, []);

  // const recipe = incomingRecipe || {
  //   title: "오트밀 리조또",
  //   likedPercent: "당이 10% 줄었어요!",
  //   ingredientsLeft: [
  //     { name: "오트밀", amount: "100g" },
  //     { name: "양파", amount: "1/4" },
  //     { name: "양송이버섯", amount: "1개" },
  //     { name: "팽이버섯", amount: "1개" },
  //     { name: "쪽파", amount: "1T" },
  //   ],
  //   ingredientsRight: [
  //     { name: "올리브유", amount: "1T" },
  //     { name: "아몬드 우유", amount: "250ml", changed: true },
  //     { name: "파마산치즈", amount: "100g" },
  //     { name: "후추", amount: "1/2T" },
  //   ],
  //   swaps: [
  //     { from: "우유", to: "아몬드 우유 250ml" },
  //     { from: "버터", to: "올리브유 1T" },
  //   ],
  //   steps: [
  //     "양파 1/4개를 잘게 다진다.",
  //     "오트밀과 아몬드 우유를 넣고 저어가며 끓인다.",
  //     "양송이버섯을 넣고 졸인다.",
  //     "소금으로 간하여 마무리한다.",
  //   ],
  // };

  if (!recipe) {
    return (
      <div className="app-wrap">
        <div className="app">
          <p>레시피 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const hasIngredients =
    (recipe.ingredients && recipe.ingredients.length > 0) ||
    (recipe.sauces && recipe.sauces.length > 0);

  const hasSteps = recipe.steps && recipe.steps.length > 0;

  // const handleClickSave = () => {
  //   if (!isSaved) {
  //     // 처음 저장할 때만 토스트 보여줌
  //     setIsSaved(true);
  //     setShowToast(true);
  //   } else {
  //     // 이미 저장된 상태면 취소만 하고 토스트는 안 보여줌
  //     setIsSaved(false);
  //   }
  // };

  // ✅ 업로드 핸들러
  // const handleUploadImage = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => setPreviewImage(reader.result);
  //   reader.readAsDataURL(file);
  // };

  return (
    <div className="app-wrap">
      <div className="app lowrecipe-wrap">
        <article className="lr-card">
          <div className="content-scroll">
            {/* 상단: 이미지 + 메타 */}
            <header className="lr-head">
              <img
                className="lr-thumb"
                src={recipe.mainImg}
                alt={recipe.rcpNm}
              />
              <div className="lr-meta">
                <span className="lr-badge">
                  {recipe.time || "시간 정보 없음"} ·{" "}
                  {recipe.portion || "인분 정보 없음"} ·{" "}
                  {recipe.level || "난이도 없음"}
                </span>
                <h1 className="lr-title">
                  {recipe.rcpNm || "레시피 제목 없음"}
                </h1>
              </div>
              {/* <button
                className={`lr-save ${isSaved ? "saved" : ""}`}
                onClick={handleClickSave}
              >
                <img
                  src={isSaved ? iconSaveFilled : iconSave}
                  alt="레시피 저장"
                />
              </button> */}
            </header>

            <hr className="lr-divider" />

            {/* 재료 */}
            <section className="lr-section">
              <h2 className="lr-sec-title">재료</h2>
              {hasIngredients ? (
                <div className="lr-ingredients-grid">
                  <ul className="lr-ingredients">
                    {(recipe.ingredients || []).map((it, i) => (
                      <li key={`ing${i}`} className="lr-ing">
                        <span className="name">
                          {it.ingrName?.startsWith("(대체)") ? (
                            <>
                              <span className="substitute-label">(대체)</span>
                              {it.ingrName.replace("(대체)", "")}
                            </>
                          ) : (
                            it.ingrName
                          )}
                        </span>
                        <span className="amt">{it.ingrCnt}</span>
                      </li>
                    ))}
                    {(recipe.sauces || []).map((it, i) => (
                      <li key={`sauce${i}`} className="lr-ing">
                        <span className="name">
                          {it.sauceName?.startsWith("(대체)") ? (
                            <>
                              <span className="substitute-label">(대체)</span>
                              {it.sauceName.replace("(대체)", "")}
                            </>
                          ) : (
                            it.sauceName
                          )}
                        </span>
                        <span className="amt">{it.sauceCnt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="lr-empty">등록된 재료가 없습니다.</p>
              )}
            </section>

            <hr className="lr-divider" />

            {/* 조리순서 */}
            <section className="lr-section">
              <h2 className="lr-sec-title">조리순서</h2>
              {hasSteps ? (
                <ol className="lr-steps">
                  {recipe.steps.map((s, i) => (
                    <li key={i} className="lr-step-item">
                      <div className="step-text">
                        <span className="num">{s.stepOrd}.</span>
                        <span className="text">{s.stepCont}</span>
                      </div>
                      {s.stepImg && (
                        <img
                          className="step-img"
                          src={s.stepImg}
                          alt={`step${s.stepOrd}`}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="lr-empty">조리 단계가 없습니다.</p>
              )}
            </section>
          </div>
        </article>

        {/* 하단 버튼 */}
        <div className="lr-actions">
          <button
            className="btn ghost"
            onClick={() => nav("/collection/trans")}
          >
            변환 레시피 목록
          </button>
          <button className="btn primary" onClick={() => nav("/transrecipe")}>
            한 번 더 변환하기
          </button>
        </div>
        {/* <Toast
          message="변환 레시피를 저장했어요"
          show={showToast}
          onClose={() => setShowToast(false)}
          navigateTo="/collection/trans"
        /> */}
      </div>
    </div>
  );
}
