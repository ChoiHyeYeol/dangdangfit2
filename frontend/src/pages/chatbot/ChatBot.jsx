import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./chatbot.css";
import axios from "axios";

/* 챗봇 아이콘 (상단 히어로에만 사용) */
import botPng from "../../assets/group.png";

// 날짜/시간 포맷터 (년도 제외)
function formatDateTime(dt) {
  const d = new Date(dt);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${m}-${day} ${h}:${min}`;
}

export default function ChatbotOverlay() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("app-portal") ||
        document.querySelector("#app-portal, .app-portal, .app-potal") ||
        document.body
      : null;

  const inputRef = useRef(null);
  const endRef = useRef(null);

  /* 챗봇 열기 이벤트 */
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-chatbot", onOpen);
    return () => window.removeEventListener("open-chatbot", onOpen);
  }, []);

  /* ESC 닫기 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  // 스크롤 잠금
  useEffect(() => {
    const sc =
      document.querySelector(".content-scroll") ||
      document.querySelector(".app-content");
    if (!sc) return;
    open ? sc.classList.add("is-locked") : sc.classList.remove("is-locked");
    return () => sc.classList.remove("is-locked");
  }, [open]);

  // 새 메시지 도착 시 맨 아래로
  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, loading]);
  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({
        behavior: messages.length > 1 ? "smooth" : "auto",
      });
    }
  }, [messages, loading, open]);

  // if (!open || !portalRoot) return null;

  const close = () => setOpen(false);

  // 실제 질문 입력 연동 지점
  // const callChatAPI = async (history, userText) => {
  //   const res = await fetch("/api/chat", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       messages: history.map(({ role, text }) => ({ role, content: text })),
  //       user: userText,
  //     }),
  //   });
  //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //   const data = await res.json();
  //   return data.reply || "네, 도와드릴게요!";
  // };
  const callChatAsk = async (userText) => {
    const res = await axios.post(
      "/api/model/chat/ask",
      { message: userText }, // 서버 DTO(ChatReq)에 맞게 key 조정
      { withCredentials: true }
    );
    return res.data; // String 반환
  };

  // ✅ 메시지 전송
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // 유저 메시지 추가
    const userMsg = {
      id: Date.now() + "-u",
      role: "user",
      text,
      time: formatDateTime(new Date()), // 현재 시간 넣어줌
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await callChatAsk(text);
      const botMsg = {
        id: Date.now() + "-b",
        role: "bot",
        text: reply,
        time: formatDateTime(new Date()), //  답변 받은 시각 넣어줌
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("챗봇 오류:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-err",
          role: "bot",
          text: "죄송합니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (!open) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/chat", { withCredentials: true });
        const logs = res.data || [];

        // 기본 메시지 시간 결정
        const baseTime =
          logs.length > 0 ? logs[0][2] : new Date().toISOString();

        const initMsg = {
          id: "init",
          role: "bot",
          text: "안녕하세요! 드시고 싶은 음식이 있나요?",
          time: formatDateTime(baseTime),
        };

        const mapped = logs.flatMap(([input, output, dt], idx) => [
          {
            id: `u-${idx}`,
            role: "user",
            text: input,
            time: formatDateTime(dt),
          },
          {
            id: `b-${idx}`,
            role: "bot",
            text: output,
            time: formatDateTime(dt),
          },
        ]);

        setMessages([initMsg, ...mapped]);
      } catch (err) {
        console.error("히스토리 불러오기 실패:", err);
        setMessages([
          {
            id: "init",
            role: "bot",
            text: "안녕하세요! 드시고 싶은 음식이 있나요?",
            time: formatDateTime(new Date()),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open]);

  if (!open || !portalRoot) return null;
  // const close = () => setOpen(false);

  return createPortal(
    <div
      className="cb-root"
      role="dialog"
      aria-modal="true"
      aria-label="Chatbot"
    >
      <div className="cb-backdrop" onClick={close} />
      <div className="cb-panel" role="document">
        {/* 상단 히어로 (이미지 + 곡선) */}
        <div className="cb-hero">
          {/* <button className="cb-back2" onClick={close} aria-label="닫기">
            <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
              <path
                d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                fill="currentColor"
              />
            </svg>
          </button> */}
          <img className="cb-hero-img" src={botPng} alt="Bot" />
          {/* 🔥 오른쪽 상단 X 버튼 추가 */}
          <button className="cb-close" onClick={close} aria-label="닫기">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 메시지 */}
        <div className="cb-body">
          <div className="cb-messages">
            {messages.map((m) => (
              <div key={m.id} className={`cb-row ${m.role}`}>
                {/* <div className={`cb-bubble ${m.role}`}>
                  <div>{m.text}</div>
                  <div className="cb-time">{m.time}</div>
                </div> */}
                <div className={`cb-bubble ${m.role}`}>
                  {m.role === "bot" ? (
                    m.id === "init" || m.id.endsWith("-err") ? ( // ✅ init + error는 일반 텍스트
                      <div>{m.text}</div>
                    ) : (
                      (() => {
                        const text = m.text;
                        const legalIdx = text.indexOf("법적 고지:");
                        const mainText =
                          legalIdx > -1 ? text.slice(0, legalIdx).trim() : text;
                        const legalText =
                          legalIdx > -1 ? text.slice(legalIdx).trim() : null;

                        return (
                          <>
                            <ul style={{ margin: 0, paddingLeft: "18px" }}>
                              {mainText
                                .split(/-\s+/)
                                .filter(Boolean)
                                .map((line, idx) => (
                                  <li key={idx}>{line}</li>
                                ))}
                            </ul>

                            {legalText && (
                              <div
                                style={{
                                  marginTop: "12px",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  lineHeight: "1.4",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {legalText}
                              </div>
                            )}
                          </>
                        );
                      })()
                    )
                  ) : (
                    <div>{m.text}</div>
                  )}

                  <div className="cb-time">{m.time}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="cb-row bot">
                <div className="cb-bubble bot">답변 생성중…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* 입력 바 */}
        <form className="cb-inputbar" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="cb-input"
            placeholder="질문을 작성하세요."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            className="cb-send-circle"
            type="submit"
            disabled={loading}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M2 21l20-9L2 3v7l14 2-14 2v7z" fill="currentColor" />
            </svg>
          </button>
        </form>
      </div>
    </div>,
    portalRoot
  );
}
