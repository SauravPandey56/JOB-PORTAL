import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../utils/api.js";

const LS_KEY = "jp_chat_v2";

function Bubble({ who, text }) {
  const isUser = who === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-small leading-relaxed",
          isUser ? "bg-primary text-white shadow-sm" : "border border-slate-200 bg-white text-dark shadow-sm",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="Assistant is typing">
      <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-duration:0.9s]" />
        <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-duration:0.9s] [animation-delay:120ms]" />
        <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-duration:0.9s] [animation-delay:240ms]" />
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      return [
        {
          who: "bot",
          text: "Hello 👋 I'm the TalentOrbit help bot. I can assist with job searching, applying for jobs, uploading resumes, recruiter job postings, and tracking applications. How can I help you today?",
        },
      ];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) {
        return [
          {
            who: "bot",
            text: "Hello 👋 I'm the TalentOrbit help bot. I can assist with job searching, applying for jobs, uploading resumes, recruiter job postings, and tracking applications. How can I help you today?",
          },
        ];
      }
      const cleaned = parsed
        .filter((m) => m && (m.who === "user" || m.who === "bot") && typeof m.text === "string")
        .map((m) => ({ who: m.who, text: m.text.slice(0, 8000) }));
      if (!cleaned.length) {
        return [
          {
            who: "bot",
            text: "Hello 👋 I'm the TalentOrbit help bot. I can assist with job searching, applying for jobs, uploading resumes, recruiter job postings, and tracking applications. How can I help you today?",
          },
        ];
      }
      return cleaned;
    } catch {
      return [
        {
          who: "bot",
          text: "Hello 👋 I'm the TalentOrbit help bot. I can assist with job searching, applying for jobs, uploading resumes, recruiter job postings, and tracking applications. How can I help you today?",
        },
      ];
    }
  });

  const quick = useMemo(
    () => ["How do I search jobs?", "How do I apply?", "Tips for my resume", "Recruiter: post a job"],
    []
  );

  const listRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(messages.slice(-40)));
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    setMessages((m) => [...m, { who: "user", text: msg }]);
    setBusy(true);
    try {
      const res = await api.post("/chat", { message: msg });
      setMessages((m) => [...m, { who: "bot", text: res.data.reply }]);
    } catch (e) {
      const serverMsg = e?.response?.data?.message;
      setMessages((m) => [
        ...m,
        {
          who: "bot",
          text:
            serverMsg ||
            "Sorry — I couldn’t reach the server. Check that the API is running.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open ? (
        <div className="w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div>
              <div className="text-small font-semibold text-dark">TalentOrbit Assistant</div>
              <div className="text-[11px] text-slate-500">Job search, apply, resumes &amp; hiring help</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div ref={listRef} className="max-h-[min(52vh,360px)] space-y-2 overflow-y-auto bg-white px-4 py-3">
            {messages.map((m, idx) => (
              <Bubble key={idx} who={m.who} text={m.text} />
            ))}
            {busy ? <TypingIndicator /> : null}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  disabled={busy}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                className="input-field min-h-[2.5rem] flex-1 text-small"
                placeholder="Message… (Enter to send)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy}
                className="shrink-0 rounded-xl bg-primary px-4 py-2 text-small font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="chat-launcher-pulse rounded-2xl bg-primary px-5 py-3 text-small font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-blue-700 hover:shadow-card-hover active:scale-[0.98]"
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        {open ? "Hide" : "Chat"}
      </button>
    </div>
  );
}
