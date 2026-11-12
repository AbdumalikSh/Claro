import React, { useState } from "react";
import { ArrowRight, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, FileCheck2, FileText, Globe2, LayoutDashboard, LogOut, Menu, MessageCircle, Search, Settings2, Sparkles, Users, X } from "lucide-react";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PortalPage from "./pages/PortalPage.jsx";
import RagAssistantPage from "./pages/RagAssistantPage.jsx";
import Modal from "./components/Modal.jsx";
import { Toaster, toast } from "react-hot-toast";
import { initials } from "./utils/format.js";
import { useAuth } from "./hooks/useAuth.js";
import { usePortalData } from "./hooks/usePortalData.js";
export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [section, setSection] = useState("Overview");
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState("");
  const { user, signIn, signOut, updateProfile } = useAuth({ authMode, setAuthMode, setNotice, setSection });
  const { apps, setApps, consultations, addConsultation } = usePortalData();
  if (!user)
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        onSubmit={signIn}
        notice={notice}
      />
    );
  const consultant = user.role === "consultant";
  const nav = consultant
    ? ["Overview", "Clients", "Documents", "Calendar", "Consultations", "Messages"]
    : ["Overview", "My application", "Documents", "Calendar", "Consultations", "Visa assistant", "Requirements"];
  const navIcons = {
    Overview: <LayoutDashboard />, Clients: <Users />, "My application": <FileText />,
    Documents: <FileCheck2 />, Calendar: <CalendarDays />, Consultations: <CalendarDays />,
    Messages: <MessageCircle />, Requirements: <CircleHelp />, "Visa assistant": <Bot />,
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Globe2 size={21} />
          </span>
          <span>
            claro<span className="brand-period">.</span>
          </span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map((item, i) => (
            <button
              key={item}
              className={`nav-item ${section === item ? "active" : ""} ${item === "Visa assistant" ? "rag-nav" : ""}`}
              onClick={() => {
                setSection(item);
                setMenuOpen(false);
              }}
            >
              {navIcons[item]}
              <span>{item}</span>
              {item === "Documents" && <span className="nav-count">2</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box">
            <div className="help-icon">
              <Sparkles size={16} />
            </div>
            <strong>Need a hand?</strong>
            <p>Your consultant is one message away.</p>
            <button onClick={() => setSection("Messages")}>
              Get support <ArrowRight size={14} />
            </button>
          </div>
          <button
            className={`nav-item settings ${section === "Settings" ? "active" : ""}`}
            onClick={() => setSection("Settings")}
          >
            <Settings2 />
            <span>Settings</span>
          </button>
          <button className="user-mini" onClick={signOut}>
            <div className="avatar small">{initials(user.name)}</div>
            <div className="mini-text">
              <b>{user.name}</b>
              <span>{consultant ? "Visa consultant" : "Client account"}</span>
            </div>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      {menuOpen && (
        <div className="mobile-scrim" onClick={() => setMenuOpen(false)} />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={19} />
          </button>
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <b>{section}</b>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search anything..." />
            </div>
            <button
              className="icon-btn notification"
              onClick={() => toast.success("You’re all caught up!")}
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-divider" />
            <div className="profile-chip">
              <div className="avatar">{initials(user.name)}</div>
              <div>
                <b>{user.name.split(" ")[0]}</b>
                <span>{consultant ? "Consultant" : "Client"}</span>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>
        {section === "Overview" ? (
          <DashboardPage
            user={user}
            consultant={consultant}
            apps={apps}
            setModal={setModal}
            setSection={setSection}
          />
        ) : section === "Visa assistant" && !consultant ? (
          <RagAssistantPage key={user.id} user={user} />
        ) : (
          <PortalPage
            section={section}
            consultant={consultant}
            apps={apps}
            setApps={setApps}
            setModal={setModal}
            consultations={consultations}
            onBook={addConsultation}
            user={user}
            onUpdateProfile={updateProfile}
          />
        )}
        <footer className="footer">
          <span>© 2026 Claro Immigration</span>
          <span>
            Made for your next chapter <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {modal && (
        <Modal
          kind={modal}
          close={() => setModal("")}
          user={user}
          setApps={setApps}
          onBook={addConsultation}
        />
      )}
      {!consultant && section !== "Visa assistant" && <button className="rag-launcher" onClick={() => setSection("Visa assistant")} aria-label="Open Visa assistant"><Bot size={22}/><span>Ask about visas</span></button>}
      <Toaster position="top-right" toastOptions={{ duration: 3200, style: { fontFamily: "DM Sans, sans-serif", fontSize: "14px", borderRadius: "12px" } }} />
    </div>
  );
}


