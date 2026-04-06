import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../utils/api.js";
import GlassCard from "./GlassCard.jsx";

const LS_KEY = "jp_chat_v1";

function Bubble({ who, text }) {
  const isUser = who === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-sky-500 text-slate-950"
            : "border border-white/10 bg-white/5 text-slate-100",
        ].join(" ")}
      >
        {text}
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
          text: "Hi! I’m TalentOrbit assistant. Ask me about jobs, applying, resume upload, recruiter posting, or the admin panel.",
        },
      ];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : [];
    } catch {
      return [];
    }
  });

  const quick = useMemo(
    () => ["How to apply?", "How to upload resume?", "How many jobs are there?", "Admin panel?"],
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
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { who: "user", text: msg }]);
    setBusy(true);
    try {
      const res = await api.post("/chatbot/message", { message: msg });
      setMessages((m) => [...m, { who: "bot", text: res.data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { who: "bot", text: "Sorry — I couldn’t respond right now. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <GlassCard className="w-[340px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">TalentOrbit Assistant</div>
              <div className="text-[11px] text-slate-300">Local helper (no external AI)</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div ref={listRef} className="max-h-[360px] space-y-2 overflow-auto px-4 py-3">
            {messages.map((m, idx) => (
              <Bubble key={idx} who={m.who} text={m.text} />
            ))}
            {busy ? <div className="text-xs text-slate-300">Typing…</div> : null}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
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
                className="w-full rounded-xl bg-slate-900/60 border-white/10 text-sm"
                placeholder="Ask something…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                disabled={busy}
                className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </GlassCard>
      ) : null}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.25)] hover:bg-sky-400"
        >
          Chat
        </button>
      ) : null}
    </div>
  );
}

