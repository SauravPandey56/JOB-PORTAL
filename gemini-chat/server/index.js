import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MODEL = (process.env.GEMINI_MODEL || "gemini-1.5-flash").trim();

const apiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, model: MODEL, configured: Boolean(genAI) });
});

/**
 * POST /chat
 * Body: { "message": "user text" }
 * Response: { "reply": "..." } or { "error": "..." } with 4xx/5xx
 */
app.post("/chat", async (req, res) => {
  const raw = req.body?.message;
  if (typeof raw !== "string" || !raw.trim()) {
    return res.status(400).json({
      error: "Message is required and must be a non-empty string.",
    });
  }

  if (!genAI) {
    return res.status(503).json({
      error:
        "AI service is not configured. Add GEMINI_API_KEY to server/.env and restart.",
    });
  }

  const message = raw.trim();

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    if (!text || !String(text).trim()) {
      return res.status(502).json({
        error: "The model returned an empty response. Try again or shorten your message.",
      });
    }

    return res.json({ reply: String(text).trim() });
  } catch (err) {
    const status = err?.status || err?.statusCode;
    const code = typeof status === "number" && status >= 400 && status < 600 ? status : 502;
    const messageText =
      err?.message ||
      err?.errorDetails?.[0]?.message ||
      "The AI service failed to process your request.";

    console.error("[/chat] Gemini error:", messageText);

    return res.status(code >= 400 && code < 600 ? code : 502).json({
      error: messageText,
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Chat API: http://localhost:${PORT}`);
  console.log(`POST /chat  (model: ${MODEL}, key: ${genAI ? "loaded" : "missing"})`);
});
