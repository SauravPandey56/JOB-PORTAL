# Gemini Chat (secure local demo)

Small **server** + **client** app: the browser talks only to your Express API; the **Gemini API key stays in `server/.env`** and is never sent to the frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ recommended
- A [Google AI Studio](https://aistudio.google.com/) API key

## 1. Backend setup

```bash
cd gemini-chat/server
npm install
```

Copy the environment template and add your key:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit `server/.env`:

- `GEMINI_API_KEY` — your secret key (required)
- `PORT` — optional, default `3001`
- `GEMINI_MODEL` — optional, default `gemini-1.5-flash`

Start the API:

```bash
npm start
```

For auto-restart on file changes (Node 18+):

```bash
npm run dev
```

You should see: `Chat API: http://localhost:3001`

Health check: open `http://localhost:3001/health` in the browser.

## 2. Frontend setup

The client is static HTML/CSS/JS. Serve the `client` folder with any static server so `fetch` and CORS behave predictably.

**Option A — VS Code “Live Server”**  
Open `client/index.html` with Live Server (or similar).

**Option B — `npx` static server** (from repo root):

```bash
npx --yes serve gemini-chat/client -l 5500
```

Then open the URL it prints (e.g. `http://localhost:5500`).

**Option C — Python**

```bash
cd gemini-chat/client
python -m http.server 5500
```

If you change the API port, edit `API_BASE` at the top of `client/app.js` to match (e.g. `http://localhost:3001`).

## API

### `POST /chat`

**Request** (`Content-Type: application/json`):

```json
{ "message": "Hello!" }
```

**Success** (`200`):

```json
{ "reply": "…" }
```

**Errors**: JSON body with `{ "error": "…" }` and an appropriate status (400, 502, 503, etc.).

## Security notes

- Never commit `server/.env`. This repo includes `gemini-chat/.gitignore` to ignore it.
- Do not put the API key in `client/` or in any frontend bundle.
- If a key was ever pasted into chat or committed, **rotate it** in Google AI Studio.

## Project layout

```
gemini-chat/
├── server/
│   ├── index.js          # Express + @google/generative-ai
│   ├── package.json
│   ├── .env              # local only (gitignored)
│   └── .env.example
├── client/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .gitignore
└── README.md
```
