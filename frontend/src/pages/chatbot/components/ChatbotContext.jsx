import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ChatbotCtx = createContext(null);

export function ChatbotProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openChatbot = useCallback(() => setOpen(true), []);
  const closeChatbot = useCallback(() => setOpen(false), []);
  const toggleChatbot = useCallback(() => setOpen((v) => !v), []);

  // (선택) 앱 프레임 스크롤 잠금
  useEffect(() => {
    const sc = document.querySelector(".app-content");
    if (!sc) return;
    open ? sc.classList.add("is-locked") : sc.classList.remove("is-locked");
    return () => sc.classList.remove("is-locked");
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ChatbotCtx.Provider
      value={{ open, openChatbot, closeChatbot, toggleChatbot }}
    >
      {children}
    </ChatbotCtx.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotCtx);
  if (!ctx) throw new Error("useChatbot must be used within <ChatbotProvider>");
  return ctx;
}
