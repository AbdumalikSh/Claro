import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Check, ChevronDown, FileText, MessageCircle, Plus, Sparkles, Trash2, Wifi, WifiOff } from "lucide-react";
import { toast } from "react-hot-toast";

const historyKey = (userId) => `claro-visa-guide-chats:${userId}`;
function readHistory(userId) {
  try { return JSON.parse(sessionStorage.getItem(historyKey(userId)) || "[]"); }
  catch { return []; }
}

export default function RagAssistantPage({ user }) {
  const [status, setStatus] = useState(null);
  const [chats, setChats] = useState(() => readHistory(user.id));
  const [activeId, setActiveId] = useState(() => readHistory(user.id)[0]?.id || null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const bottomRef = useRef(null);
  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeId) || null, [chats, activeId]);

  useEffect(() => { sessionStorage.setItem(historyKey(user.id), JSON.stringify(chats)); }, [chats, user.id]);
  const refreshStatus = async () => {
    setCheckingStatus(true);
    try {
      if (window.location.protocol === "file:") {
        throw new Error("Open Claro from http://localhost:5173. Do not open dist/index.html directly.");
      }
      const response = await fetch(`/api/rag/status?userId=${encodeURIComponent(user.id)}`);
      let data;
      try { data = await response.json(); }
      catch { throw new Error(`The Claro API returned an invalid response (HTTP ${response.status}). Start it with npm run dev:full.`); }
      if (!response.ok) throw new Error(data.error || "Could not connect to the Claro visa assistant.");
      setStatus(data);
    } catch (error) {
      setStatus({ ready: false, reason: "server-unavailable" });
      const message = String(error.message || "");
      if (/string did not match the expected pattern/i.test(message)) {
        toast.error("Open Claro at http://localhost:5173. The app cannot reach its API when opened as a local file.");
      } else {
        toast.error(message.includes("fetch") ? "The Claro assistant server is unavailable. Start it with npm run dev:full." : (message || "Could not check assistant status."));
      }
    } finally { setCheckingStatus(false); }
  };
  useEffect(() => { refreshStatus(); }, [user.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [activeChat?.messages?.length, loading]);

  const createChat = () => {
    const chat = { id: crypto.randomUUID(), title: "New conversation", createdAt: new Date().toISOString(), messages: [] };
    setChats((current) => [chat, ...current]);
    setActiveId(chat.id);
    setQuestion("");
  };

  const sendQuestion = async (event) => {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    if (!status?.ready) { toast.error("The shared visa guide is not ready yet. Please try again later."); return; }
    const chatId = activeId || crypto.randomUUID();
    const isNew = !activeId;
    const userMessage = { id: crypto.randomUUID(), role: "user", content: value, createdAt: new Date().toISOString() };
    const priorMessages = isNew ? [] : (activeChat?.messages || []);
    if (isNew) setActiveId(chatId);
    setChats((current) => {
      const existing = current.find((chat) => chat.id === chatId);
      const base = existing || { id: chatId, title: value.slice(0, 48), createdAt: new Date().toISOString(), messages: [] };
      const updated = { ...base, title: base.messages.length ? base.title : value.slice(0, 48), messages: [...base.messages, userMessage], updatedAt: new Date().toISOString() };
      return [updated, ...current.filter((chat) => chat.id !== chatId)];
    });
    setQuestion(""); setLoading(true);
    try {
      const response = await fetch("/api/rag/ask", {
        method: "POST", headers: { "Content-Type": "application/json", "x-claro-user": user.id },
        body: JSON.stringify({ userId: user.id, question: value, history: priorMessages.filter((message) => ["user", "assistant"].includes(message.role)).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not answer from the visa guide.");
      const assistantMessage = { id: crypto.randomUUID(), role: "assistant", content: data.answer, sources: data.sources || [], createdAt: new Date().toISOString() };
      setChats((current) => current.map((chat) => chat.id === chatId ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date().toISOString() } : chat));
    } catch (error) {
      toast.error(error.message || "Could not answer from the visa guide.");
      setChats((current) => current.map((chat) => chat.id === chatId ? { ...chat, messages: chat.messages.filter((message) => message.id !== userMessage.id) } : chat));
      setQuestion(value);
      refreshStatus();
    } finally { setLoading(false); }
  };

  const deleteChat = (id) => {
    setChats((current) => current.filter((chat) => chat.id !== id));
    if (activeId === id) setActiveId(chats.find((chat) => chat.id !== id)?.id || null);
  };

  const statusText = checkingStatus ? "Connecting to assistant…" : status?.ready ? "Visa guide ready" : status?.reason === "guide-missing" ? "Visa guide being prepared" : status?.reason === "models-missing" ? "Assistant is being prepared" : status?.reason === "server-unavailable" ? "Express server unavailable" : "Assistant temporarily unavailable";
  const statusDetail = status?.reason === "guide-missing" ? "Claro’s shared visa guide is being prepared. You’ll be able to ask questions here once it’s ready." : status?.ready ? `${status.filename} · Shared with Claro clients` : status?.reason === "server-unavailable" ? "Start Express and open Claro at http://localhost:5173. Run npm run dev:full in the project folder." : "The assistant runs on Claro’s server. You don’t need to install a model or provide an API key.";

  return <div className="page-content rag-page">
    <div className="rag-page-heading"><div><span className="eyebrow"><span/> CLIENT VISA ASSISTANT</span><h1>Ask the visa guide</h1><p>Get answers about the visa process from Claro’s shared guide, with page citations.</p></div><button className="primary-btn rag-new-chat" onClick={createChat}><Plus size={16}/> New chat</button></div>
    <div className="rag-workspace">
      <aside className="rag-library">
        <div className="rag-library-heading"><div><b>Claro’s visa guide</b><span>Shared</span></div><button className="rag-refresh" onClick={refreshStatus} disabled={checkingStatus} aria-label="Refresh guide status">↻</button></div>
        <div className={`rag-guide-card ${status?.ready ? "ready" : "pending"}`}><span className="rag-guide-icon"><FileText size={18}/></span><span className="rag-guide-info"><b>{status?.filename || "Visa application guide"}</b><small>{status?.ready ? `${status.pages ? `${status.pages} pages · ` : ""}Ready to search` : status?.reason === "guide-missing" ? "Guide will be added by Claro" : "Connecting to Claro’s server"}</small></span>{status?.ready ? <Check className="rag-guide-check" size={15}/> : <span className="rag-guide-dot"/>}</div>
        <div className="rag-sidebar-label">ASSISTANT STATUS</div>
        <div className={`rag-status-card ${status?.ready ? "online" : "offline"}`}><span>{status?.ready ? <Wifi size={15}/> : <WifiOff size={15}/>}</span><div><b>{statusText}</b><small>{statusDetail}</small></div></div>
        <div className="rag-history-heading"><b>Recent chats</b><span>{chats.length}</span></div>
        <div className="rag-chat-history">{chats.length ? chats.map((chat) => <div className={`rag-history-row ${activeId === chat.id ? "active" : ""}`} key={chat.id}><button onClick={() => setActiveId(chat.id)}><MessageCircle size={14}/><span>{chat.title}</span></button><button className="rag-delete-chat" aria-label="Delete chat" onClick={() => deleteChat(chat.id)}><Trash2 size={13}/></button></div>) : <p className="rag-no-history">Your conversations in this tab will show here.</p>}</div>
        <div className="rag-private-note"><Sparkles size={14}/><span>One shared visa PDF is indexed on Claro’s server. You can’t add or change guide documents.</span></div>
      </aside>
      <section className="rag-chat-panel">
        <div className="rag-chat-topline"><div className="rag-bot-avatar"><Bot size={18}/></div><div><b>Claro visa assistant</b><span><i className={status?.ready ? "" : "offline"}/>{status?.ready ? "Grounded in the shared visa guide" : statusText}</span></div><div className="rag-selection-pill"><FileText size={13}/>Visa guide<ChevronDown size={13}/></div></div>
        <div className="rag-messages">
          {!activeChat?.messages?.length ? <div className="rag-welcome"><span className="rag-welcome-icon"><Sparkles size={22}/></span><h2>What would you like to know?</h2><p>{status?.ready ? "Ask about the visa application process. I’ll search Claro’s shared guide and show the page behind each answer." : statusDetail}</p>{status?.ready ? <div className="rag-suggestions">{["What documents are needed for a visa application?","How do I prepare for my visa consultation?","What should I check before submitting my application?"].map((suggestion) => <button key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}<span>↗</span></button>)}</div> : <button className="rag-empty-upload" onClick={refreshStatus} disabled={checkingStatus}>{checkingStatus ? "Checking assistant…" : "Check again"}</button>}</div> : activeChat.messages.map((message) => <ChatMessage key={message.id} message={message}/>)}
          {loading && <div className="rag-message assistant"><div className="rag-message-avatar"><Bot size={16}/></div><div className="rag-message-body"><div className="rag-typing"><i/><i/><i/></div><small>Searching the visa guide…</small></div></div>}
          <div ref={bottomRef}/>
        </div>
        <form className="rag-composer" onSubmit={sendQuestion}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendQuestion(); } }} placeholder={status?.ready ? "Ask a question about the visa application process…" : "The visa assistant is not ready yet"} rows={1} disabled={!status?.ready || loading}/><button className="rag-send-btn" type="submit" aria-label="Send question" disabled={!question.trim() || loading || !status?.ready}><Bot size={18}/></button><span className="rag-composer-hint">Answers cite the shared guide by page · Enter to send</span></form>
      </section>
    </div>
  </div>;
}

function ChatMessage({ message }) {
  const assistant = message.role === "assistant";
  return <article className={`rag-message ${assistant ? "assistant" : "user"}`}><div className="rag-message-avatar">{assistant ? <Bot size={16}/> : <span>You</span>}</div><div className="rag-message-body"><div className="rag-message-content">{message.content}</div>{assistant && message.sources?.length > 0 && <div className="rag-sources"><b>Visa guide sources</b><div>{message.sources.map((source, index) => <details className="rag-source" key={`${source.page}-${index}`}><summary><FileText size={13}/><span>{source.filename}</span><em>p. {source.page}</em><ChevronDown size={13}/></summary><p>{source.excerpt}</p></details>)}</div></div>}<small>{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</small></div></article>;
}
