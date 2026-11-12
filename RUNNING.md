# Run Claro and fix the visa assistant

The React page needs two services to answer questions: the Claro Express server and Ollama running on the machine that hosts Express. The browser talks to Express; it does not need an API key or a local Ollama installation.

## 1. Open the project folder

Open Terminal and run:

```bash
cd /Users/abdumalik/Desktop/Claro
```

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

Use Node.js 18 or newer.

## 2. Install the app packages

Run this once after downloading or updating the project:

```bash
npm install
```

## 3. Start Ollama on the Claro server

For local development, install and open the Ollama app on this computer. On a deployed site, Ollama must run on the backend host or on a private machine reachable by the backend.

Pull the two models used by the default configuration:

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

Confirm that Ollama sees both models:

```bash
ollama list
```

The Ollama service must remain running while the assistant is in use. On macOS, opening the Ollama app normally starts it. If its API is not responding, start it in a separate Terminal window:

```bash
ollama serve
```

Check that Ollama is responding and has the models:

```bash
curl http://localhost:11434/api/tags
```

The JSON response should list `qwen2.5:3b` and `nomic-embed-text`.

## 4. Check the shared visa PDF

The assistant uses the same guide for every client. The supplied guide is already included here:

```bash
ls -lh server/data/visa-guide.pdf
```

Clients cannot upload, replace, or choose a PDF. If you replace the shared guide later, put the new PDF at the same path. The index rebuilds automatically when the PDF's size or modification time changes.

## 5. Configure the backend

The defaults already match the local setup. If you want them written in a `.env` file, copy the example once:

```bash
cp .env.example .env
```

The important defaults are:

```dotenv
RAG_KNOWLEDGE_PDF=server/data/visa-guide.pdf
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_OPENAI_BASE_URL=http://localhost:11434/v1
OLLAMA_CHAT_MODEL=qwen2.5:3b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

If Express runs in Docker or on a different host from Ollama, `localhost` points to the Express container/machine. Change both Ollama URLs to the private address the Express server can reach. Keep Ollama off the public internet.

## 6. Start Express and React

From the project folder, run:

```bash
npm run dev:full
```

This starts both services. Leave this Terminal window open. You should see messages similar to:

```text
Claro API listening on http://localhost:3001
VITE ... Local: http://localhost:5173/
```

Open `http://localhost:5173` in your browser. Stop both services with **Control+C** in that Terminal window.

## 7. Sign in as a client

Use the demo client account:

```text
Email:    alex@example.com
Password: demo123
```

The Visa Assistant is only shown for client accounts. If the app server was restarted, sign out and sign in again so the in-memory demo account is recognized by Express. Consultant accounts cannot use the assistant.

## 8. Check assistant status

In the client portal, open **Visa assistant**. The guide card should say **Visa guide ready**. You can also check the backend directly from another Terminal window:

```bash
curl 'http://localhost:3001/api/rag/status?userId=u1'
```

The response should contain `"ready":true`. You can also check through Vite's API proxy:

```bash
curl 'http://localhost:5173/api/rag/status?userId=u1'
```

## 9. Ask the first question

Try a question covered by the guide, such as:

```text
What documents are commonly needed for a visa application?
```

On the first question, Express extracts the PDF pages, creates Ollama embeddings, and saves a shared index under `server/data/rag/`. This first request can take longer than later questions. Answers include the guide filename and page citations.

## Troubleshooting

### Visa assistant says “temporarily unavailable”

1. Make sure `npm run dev:full` is still running.
2. Make sure the Ollama app is open, or run `ollama serve` in another Terminal window.
3. Run `curl http://localhost:11434/api/tags` and confirm both models are listed.
4. Reopen **Visa assistant** or use **Check again**.

### Status says “Assistant is being prepared”

Install the exact model names configured in `.env` or `.env.example`:

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

If you use different models, update `OLLAMA_CHAT_MODEL` and `OLLAMA_EMBEDDING_MODEL` to match `ollama list`, then restart `npm run dev:full`.

### Status says “Visa guide being prepared”

Confirm `server/data/visa-guide.pdf` exists, or update `RAG_KNOWLEDGE_PDF` to the correct server-side path. Restart Express after changing `.env`.

### `curl` to port 3001 fails

The Express server is stopped or port 3001 is unavailable. Start it with `npm run dev:full`; if Vite and Express are in separate terminals, start Express with `npm run server` and Vite with `npm run dev`.

### The page says the assistant is only for clients

Sign in with the client demo account. Consultant accounts are deliberately blocked from the Visa Assistant API.

### The first question takes a while

The PDF is indexed on the first request and the local model needs memory to load. Keep Ollama running and wait for the first answer. Later questions reuse the shared index.

## How the request works

```text
Client browser → Claro React app → Express on port 3001 → Ollama on the backend host
                                      ↘ shared visa-guide.pdf
```

No client API key or client-side Ollama install is used. Chat history remains in that browser tab's `sessionStorage`.
