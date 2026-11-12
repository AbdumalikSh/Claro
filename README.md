# Claro visa portal

React and Express demo portal for clients and visa consultants. Demo accounts and application data are in memory. Uploaded RAG PDFs and their vector index are kept on the Express server under `server/data/rag/`.

## Start the app

```bash
npm install
npm run dev:full
```

Open `http://localhost:5173`. Demo client: `alex@example.com` / `demo123`. Demo consultant: `sofia@claro.com` / `demo123`.

## Client PDF assistant

The **Ask your PDFs** page is available to client accounts only. It supports PDF upload, per-file search selection, page-level source citations, multiple conversations, and session-scoped chat history. Chat history is stored in the browser's `sessionStorage`; PDFs and their index are stored locally by client account on the Express server. Scanned PDFs need OCR before upload.

The service has a built-in local token-vector fallback, so PDF extraction, indexing, and retrieval work without Python or a database. For semantic embeddings and generated answers, copy `.env.example` to `.env` and configure a provider:

- **OpenAI-compatible API:** set `OPENAI_API_KEY`, `OPENAI_MODEL`, and optionally `OPENAI_BASE_URL`. Set `EMBEDDING_MODEL` too to use provider embeddings; otherwise indexing uses the built-in local vectorizer.
- **Ollama:** run `ollama pull qwen2.5:3b` and `ollama pull nomic-embed-text`, set `OLLAMA_CHAT_MODEL=qwen2.5:3b`, and set `RAG_EMBEDDING_PROVIDER=ollama`.

With no chat model configured, the assistant returns the most relevant PDF passages and their citations rather than inventing a generated answer.

When an external embedding provider is configured, extracted PDF text is sent to it to create vectors. When an external chat model is configured, the question, recent conversation turns, and retrieved passages are sent to it to generate the answer. Original PDF files and the index remain on the Express server. Ollama can keep model processing on the local machine.

PDF API routes are mounted at `/api/rag`: `GET /documents`, `POST /upload`, and `POST /ask`. The other demo API endpoints remain under `/api`.
