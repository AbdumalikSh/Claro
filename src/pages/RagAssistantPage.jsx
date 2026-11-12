import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Check, ChevronDown, FileText, MessageCircle, Paperclip, Plus, Search, Send, Sparkles, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "react-hot-toast";

const historyKey = (userId) => `claro-rag-chats:${userId}`;

function readHistory(userId) {
  try { return JSON.parse(sessionStorage.getItem(historyKey(userId)) || "[]"); }
  catch { return []; }
}

export default function RagAssistantPage({ user }) {
  const [documents, setDocuments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [chats, setChats] = useState(() => readHistory(user.id));
  const [activeId, setActiveId] = useState(() => readHistory(user.id)[0]?.id || null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const fileInput = useRef(null);
  const bottomRef = useRef(null);
  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeId) || null, [chats, activeId]);

  useEffect(() => {
    sessionStorage.setItem(historyKey(user.id), JSON.stringify(chats));
  }, [chats, user.id]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/rag/documents?userId=${encodeURIComponent(user.id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load your PDF library.");
        setDocuments(data.documents || []);
        setSelectedIds((current) => current.length ? current : (data.documents || []).map((doc) => doc.id));
      } catch (error) {
        toast.error(error.message?.includes("fetch") ? "Start the Express server to use PDF search." : error.message);
      }
    };
    load();
  }, [user.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [activeChat?.messages?.length, loading]);

  const createChat = () => {
    const chat = { id: crypto.randomUUID(), title: "New conversation", createdAt: new Date().toISOString(), messages: [] };
    setChats((current) => [chat, ...current]);
    setActiveId(chat.id);
    setQuestion("");
  };

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (files.some((file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please choose PDF files only."); event.target.value = ""; return;
    }
    setUploading(true);
    const body = new FormData();
    body.append("userId", user.id);
    files.forEach((file) => body.append("files", file));
    try {
      const response = await fetch("/api/rag/upload", { method: "POST", headers: { "x-claro-user": user.id }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "PDF upload failed.");
      setDocuments((current) => [...data.documents, ...current]);
      setSelectedIds((current) => [...new Set([...current, ...data.documents.map((doc) => doc.id)])]);
      toast.success(`${data.documents.length} PDF${data.documents.length === 1 ? "" : "s"} indexed and ready to search`);
    } catch (error) { toast.error(error.message || "PDF upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const sendQuestion = async (event) => {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    if (!documents.length) { toast.error("Upload a PDF before asking a question."); return; }
    if (!selectedIds.length) { toast.error("Select at least one PDF to search."); return; }
    const chatId = activeId || crypto.randomUUID();
    const isNew = !activeId;
    const userMessage = { id: crypto.randomUUID(), role: "user", content: value, createdAt: new Date().toISOString() };
    const priorMessages = isNew ? [] : (activeChat?.messages || []);
    if (isNew) setActiveId(chatId);
    setChats((current) => {
      const exists = current.some((chat) => chat.id === chatId);
      const chat = exists ? current.find((item) => item.id === chatId) : { id: chatId, title: value.slice(0, 48), createdAt: new Date().toISOString(), messages: [] };
      const updated = { ...chat, title: chat.messages.length ? chat.title : value.slice(0, 48), messages: [...chat.messages, userMessage], updatedAt: new Date().toISOString() };
      return [updated, ...current.filter((item) => item.id !== chatId)];
    });
    setQuestion(""); setLoading(true);
    try {
      const response = await fetch("/api/rag/ask", {
        method: "POST", headers: { "Content-Type": "application/json", "x-claro-user": user.id },
        body: JSON.stringify({ userId: user.id, question: value, documentIds: selectedIds, history: priorMessages.filter((item) => item.role === "user" || item.role === "assistant").map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not answer from your PDFs.");
      const assistantMessage = { id: crypto.randomUUID(), role: "assistant", content: data.answer, sources: data.sources || [], mode: data.mode, createdAt: new Date().toISOString() };
      setChats((current) => current.map((chat) => chat.id === chatId ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date().toISOString() } : chat));
    } catch (error) {
      toast.error(error.message || "Could not answer from your PDFs.");
      setChats((current) => current.map((chat) => chat.id === chatId ? { ...chat, messages: chat.messages.filter((item) => item.id !== userMessage.id) } : chat));
      setQuestion(value);
    } finally { setLoading(false); }
  };

  const deleteChat = (id) => {
    setChats((current) => current.filter((chat) => chat.id !== id));
    if (activeId === id) setActiveId(chats.find((chat) => chat.id !== id)?.id || null);
  };
  const filteredDocuments = documents.filter((doc) => doc.filename.toLowerCase().includes(filter.toLowerCase()));
  const toggleDocument = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return <div className="page-content rag-page">
    <div className="rag-page-heading"><div><span className="eyebrow"><span/> CLIENT KNOWLEDGE ASSISTANT</span><h1>Ask your documents</h1><p>Get clear answers from your visa PDFs, with page citations you can check.</p></div><button className="primary-btn rag-new-chat" onClick={createChat}><Plus size={16}/> New chat</button></div>
    <div className="rag-workspace">
      <aside className="rag-library">
        <div className="rag-library-heading"><div><b>Your library</b><span>{documents.length} PDF{documents.length === 1 ? "" : "s"}</span></div><button className="icon-btn" aria-label="Upload PDFs" onClick={() => fileInput.current?.click()}><Plus size={17}/></button></div>
        <button className="rag-upload-button" onClick={() => fileInput.current?.click()} disabled={uploading}><UploadCloud size={18}/><span><b>{uploading ? "Indexing PDFs…" : "Add PDF documents"}</b><small>PDF · up to 20 MB each</small></span></button>
        <input ref={fileInput} type="file" accept="application/pdf,.pdf" multiple hidden onChange={uploadFiles}/>
        {documents.length > 0 && <><div className="rag-sidebar-label">SEARCH IN</div><div className="rag-doc-filter"><Search size={14}/><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find a document"/></div><div className="rag-doc-list">{filteredDocuments.map((doc) => <label className="rag-doc-option" key={doc.id}><input type="checkbox" checked={selectedIds.includes(doc.id)} onChange={() => toggleDocument(doc.id)}/><span className="rag-pdf-icon"><FileText size={15}/></span><span className="rag-doc-info"><b title={doc.filename}>{doc.filename}</b><small>{doc.pages} pages · indexed</small></span><Check className="rag-selected-check" size={14}/></label>)}</div></>}
        <div className="rag-history-heading"><b>Recent chats</b><span>{chats.length}</span></div>
        <div className="rag-chat-history">{chats.length ? chats.map((chat) => <div className={`rag-history-row ${activeId === chat.id ? "active" : ""}`} key={chat.id}><button onClick={() => setActiveId(chat.id)}><MessageCircle size={14}/><span>{chat.title}</span></button><button className="rag-delete-chat" aria-label="Delete chat" onClick={() => deleteChat(chat.id)}><Trash2 size={13}/></button></div>) : <p className="rag-no-history">Your conversations in this tab will show here.</p>}</div>
        <div className="rag-private-note"><Sparkles size={14}/><span>PDFs stay on this server. Extracted text may be sent to your configured AI provider.</span></div>
      </aside>
      <section className="rag-chat-panel">
        <div className="rag-chat-topline"><div className="rag-bot-avatar"><Bot size={18}/></div><div><b>Claro document assistant</b><span><i/> Answers grounded in selected PDFs</span></div><div className="rag-selection-pill"><FileText size={13}/>{selectedIds.length} selected<ChevronDown size={13}/></div></div>
        <div className="rag-messages">
          {!activeChat?.messages?.length ? <div className="rag-welcome"><span className="rag-welcome-icon"><Sparkles size={22}/></span><h2>What would you like to know?</h2><p>Ask a question about your visa documents. I’ll look through your selected PDFs and show the page behind each answer.</p>{!documents.length ? <button className="rag-empty-upload" onClick={() => fileInput.current?.click()}><UploadCloud size={17}/> Upload a PDF to get started</button> : <div className="rag-suggestions">{["Which documents mention proof of funds?","Summarize the key requirements in my PDFs","What deadlines or dates should I know about?"].map((suggestion) => <button key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}<span>↗</span></button>)}</div>}</div> : activeChat.messages.map((message) => <ChatMessage key={message.id} message={message}/>)}
          {loading && <div className="rag-message assistant"><div className="rag-message-avatar"><Bot size={16}/></div><div className="rag-message-body"><div className="rag-typing"><i/><i/><i/></div><small>Searching your PDFs…</small></div></div>}
          <div ref={bottomRef}/>
        </div>
        <form className="rag-composer" onSubmit={sendQuestion}><button className="rag-attach-btn" type="button" aria-label="Add PDFs" onClick={() => fileInput.current?.click()}><Paperclip size={17}/></button><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendQuestion(); } }} placeholder={documents.length ? "Ask a question about your visa documents…" : "Upload a PDF first to ask questions"} rows={1} disabled={!documents.length || loading}/><button className="rag-send-btn" type="submit" aria-label="Send question" disabled={!question.trim() || loading || !documents.length}><Send size={17}/></button><span className="rag-composer-hint">Answers include document and page citations · Enter to send</span></form>
      </section>
    </div>
  </div>;
}

function ChatMessage({ message }) {
  const assistant = message.role === "assistant";
  return <article className={`rag-message ${assistant ? "assistant" : "user"}`}><div className="rag-message-avatar">{assistant ? <Bot size={16}/> : <span>{message.role === "user" ? "You" : "AI"}</span>}</div><div className="rag-message-body"><div className="rag-message-content">{message.content}</div>{assistant && message.sources?.length > 0 && <div className="rag-sources"><b>Sources</b><div>{message.sources.map((source, index) => <details className="rag-source" key={`${source.documentId}-${source.page}-${index}`}><summary><FileText size={13}/><span>{source.filename}</span><em>p. {source.page}</em><ChevronDown size={13}/></summary><p>{source.excerpt}</p></details>)}</div></div>}<small>{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</small></div></article>;
}
