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
