/**
 * Backend URL — key never appears here; only your local API.
 * Change port if you set PORT in server/.env
 */
const API_BASE = "http://localhost:3001";

const messagesEl = document.getElementById("messages");
const typingEl = document.getElementById("typing");
const formEl = document.getElementById("composer");
const inputEl = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

function appendBubble(text, role) {
  const row = document.createElement("div");
  row.className = `row row--${role === "user" ? "user" : "ai"}`;
  const bubble = document.createElement("div");
  bubble.className = `bubble bubble--${role === "user" ? "user" : "ai"}`;
  bubble.textContent = text;
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendError(text) {
  const row = document.createElement("div");
  row.className = "row row--ai";
  const bubble = document.createElement("div");
  bubble.className = "bubble bubble--ai bubble--error";
  bubble.textContent = text;
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setTyping(on) {
  typingEl.classList.toggle("typing--hidden", !on);
  typingEl.setAttribute("aria-hidden", on ? "false" : "true");
}

function setBusy(busy) {
  sendBtn.disabled = busy;
  inputEl.disabled = busy;
}

async function sendMessage(text) {
  setTyping(true);
  setBusy(true);
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg =
        typeof data.error === "string"
          ? data.error
          : `Request failed (${res.status})`;
      appendError(errMsg);
      return;
    }

    if (typeof data.reply !== "string" || !data.reply.trim()) {
      appendError("No reply from the server.");
      return;
    }

    appendBubble(data.reply.trim(), "ai");
  } catch (e) {
    appendError(
      e?.message?.includes("fetch")
        ? "Cannot reach the server. Is it running on " + API_BASE + "?"
        : e?.message || "Something went wrong."
    );
  } finally {
    setTyping(false);
    setBusy(false);
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  appendBubble(text, "user");
  inputEl.value = "";
  inputEl.style.height = "auto";
  sendMessage(text);
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 8 * 24)}px`;
});
