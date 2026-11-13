# Claro visa portal

React and Express demo portal for visa clients and consultants. Demo accounts and application data are in memory. The client Visa Assistant uses one shared visa guide PDF; clients cannot upload or replace it.

## Start the app

```bash
npm install
npm run dev:full
```

Open `http://localhost:5173`. Demo client: `alex@example.com` / `demo123`. Demo consultant: `sofia@claro.com` / `demo123`.

For the complete step-by-step startup and chatbot troubleshooting guide, see [RUNNING.md](./RUNNING.md).

## Set up the shared visa assistant

Claro's shared guide is included at `server/data/visa-guide.pdf`. For deployment, keep that file with the Express server, or set `RAG_KNOWLEDGE_PDF` in `.env` to its server-side path. The app indexes and searches this one PDF for every client. There is no client PDF upload route or document picker. If the guide isn't present on a deployment, clients see a setup message and can return later.

The assistant runs both embedding and answer generation through Ollama on the Claro backend host. Clients do not need Ollama, a model, or an API key. Install Ollama on the machine running Express, then pull the models there:

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

Copy `.env.example` to `.env` if you need different paths, model names, or an Ollama URL. The default Ollama URL is `http://localhost:11434`. Keep the Ollama service running on the backend host. On a deployed site, deploy Express on a server that has enough CPU/GPU memory for the models; if Ollama runs on a separate machine, point `OLLAMA_BASE_URL` and `OLLAMA_OPENAI_BASE_URL` to that private service. Do not expose Ollama directly to the public internet.

The Node/Express service extracts PDF text, chunks it by page, creates local embeddings with Ollama, stores one shared vector index on the server, retrieves relevant passages, and asks the chat model for a cited answer. Citations include the original PDF filename and page. Scanned PDFs need OCR before they can be searched. Chat history is saved in the browser tab's `sessionStorage`.

When the configured Ollama models are not running, the assistant reports that it is temporarily unavailable. No third-party API key or Python service is used.

RAG routes: `GET /api/rag/status` and `POST /api/rag/ask`. Other demo API endpoints remain under `/api`.

## Deploy to Vercel

The repository is configured for Vercel: Vite builds to `dist`, `/api/*` is handled by an Express function, and the client-side routes fall back to `index.html`. The shared `server/data/visa-guide.pdf` is bundled with that function. The generated vector index is cached in `/tmp`; Vercel functions have read-only filesystems outside that scratch directory, and the cache can be cleared when an instance restarts.

1. Push this repository to GitHub and import it from the Vercel dashboard. Keep the project root at the repository root; Vercel uses the `vercel.json` build settings.
2. Add `OLLAMA_BASE_URL` in **Project Settings → Environment Variables**. It must be a URL reachable from the deployed function and point to an Ollama server with `qwen2.5:3b` and `nomic-embed-text` installed. Set `OLLAMA_OPENAI_BASE_URL` too if that server's OpenAI-compatible endpoint is not `${OLLAMA_BASE_URL}/v1`.
3. Deploy the project, then open `/api/health` on its Vercel domain and use **Check again** in the Visa Assistant.

Vercel cannot reach Ollama at `http://localhost:11434` on your computer. Keep the Ollama endpoint private and reachable from Vercel (for example through a private network connection); do not expose Ollama directly to the public internet. If you do not have a reachable Ollama host yet, the portal can be deployed, but the Visa Assistant will remain unavailable until one is configured.

This remains a demo deployment without a database: user accounts and server demo data are kept in memory and may reset when the function restarts. Do not use it for real client records until persistent storage and production authentication are added.
