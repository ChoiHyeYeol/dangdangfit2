import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./transbanner.css";
import axios from "axios";
import Lottie from "lottie-react";
import sandyLoadingAnim from "../../../assets/Sandy Loading.json";

export default function TransBanner() {
  const nav = useNavigate();
  const location = useLocation();
  const url = location.state?.url;
  const [loading, setLoading] = useState(true);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!url) {
      nav("/transrecipe");
      return;
    }

    const fetchRecipe = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        const res = await axios.post("/api/model/recipe/convert_recipe", {
          url,
        });
        setLoading(false);
        nav(`/transrecipe/result/${encodeURIComponent(res.data.rcpId)}`, {
          state: { recipe: res.data },
        });
      } catch (err) {
        console.error(err);
        alert("레시피 변환에 실패했어요!");
        nav("/transrecipe");
      }
    };

    fetchRecipe();
  }, [nav, url]);

  return (
    <div className="app-wrap">
      <div className="app">
        <div className="tb-screen" role="status" aria-live="polite">
          {/* ✅ JSON 애니메이션 */}
          {loading && (
            <Lottie
              animationData={sandyLoadingAnim}
              loop={true}
              className="lottie-container"
            />
          )}

          {/* ✅ 굵고 큰 텍스트 */}
          <p className="loading-text">
            건강한 재료로
            <br /> 대체하는 중이에요
          </p>
        </div>
      </div>
    </div>
  );
}
