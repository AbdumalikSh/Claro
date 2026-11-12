import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, FileCheck2, FileText, Globe2, LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, UploadCloud, Users, X, ArrowDownLeft, Home } from "lucide-react";
export default function Auth({ mode, setMode, onSubmit, notice }) {
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(
      e.target.email.value,
      e.target.password.value,
      e.target.name?.value,
      role,
    );
    setLoading(false);
  };
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-brand brand">
          <span className="brand-mark">
            <Globe2 size={21} />
          </span>
          <span>
            claro<span className="brand-period">.</span>
          </span>
        </div>
        <div className="visual-copy">
          <span className="eyebrow light">
            <span /> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>
            A clearer path
            <br />
            to <em>anywhere.</em>
          </h1>
          <p>
            Expert guidance, every document, and every milestone — all in one
            place.
          </p>
          <div className="visual-stats">
            <div>
              <b>
                4.9<span>★</span>
              </b>
              <small>Client rating</small>
            </div>
            <i />
            <div>
              <b>12k+</b>
              <small>Journeys supported</small>
            </div>
          </div>
        </div>
        <div className="visual-bottom">
          <span>01 — 03</span>
          <div className="visual-progress">
            <i />
          </div>
          <span>Every step, together</span>
        </div>
        <div className="visual-orb orb-a" />
        <div className="visual-orb orb-b" />
      </div>
      <div className="auth-panel">
        <div className="auth-top-note">
          {signup ? "Already have an account?" : "New to Claro?"}{" "}
          <button
            onClick={() => {
              setMode(signup ? "login" : "signup");
            }}
          >
            {signup ? "Sign in" : "Create account"} <ArrowRight size={14} />
          </button>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand brand">
            <span className="brand-mark">
              <Globe2 size={21} />
            </span>
            <span>
              claro<span className="brand-period">.</span>
            </span>
          </div>
          <span className="eyebrow">
            <span /> SECURE CLIENT PORTAL
          </span>
          <h2>{signup ? "Start your journey" : "Welcome back"}</h2>
          <p className="form-intro">
            {signup
              ? "Create your account and take the first step."
              : "Sign in to pick up where you left off."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <>
                <label>Full name</label>
                <input name="name" placeholder="e.g. Alex Morgan" required />
                <label className="label-gap">I’m joining as</label>
                <div className="role-select">
                  <button
                    type="button"
                    className={role === "client" ? "chosen" : ""}
                    onClick={() => setRole("client")}
                  >
                    <span className="role-icon">
                      <Users size={17} />
                    </span>
                    <span>
                      <b>Client</b>
                      <small>I'm applying for a visa</small>
                    </span>
                    {role === "client" && <Check size={15} />}
                  </button>
                  <button
                    type="button"
                    className={role === "consultant" ? "chosen" : ""}
                    onClick={() => setRole("consultant")}
                  >
                    <span className="role-icon">
                      <ShieldCheck size={17} />
                    </span>
                    <span>
                      <b>Consultant</b>
                      <small>I guide visa applicants</small>
                    </span>
                    {role === "consultant" && <Check size={15} />}
                  </button>
                </div>
              </>
            )}
            <label>Email address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={signup ? "" : undefined}
              required
            />
            <label className="label-gap">Password</label>
            <input
              name="password"
              type="password"
              placeholder="At least 8 characters"
              required
            />
            <div className="form-extra">
              <label className="check-label">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-button">
                Forgot password?
              </button>
            </div>
            {notice && <div className="form-error">{notice}</div>}
            <button className="primary-btn auth-submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : signup
                  ? "Create account"
                  : "Sign in"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="demo-hint">
            <Sparkles size={15} />
            <span>
              <b>Try the demo</b> · alex@example.com / demo123
              <br />
              <span>Consultant: sofia@claro.com / demo123</span>
            </span>
          </div>
          <div className="auth-legal">
            By continuing, you agree to our <a>Terms</a> and{" "}
            <a>Privacy Policy</a>.
          </div>
        </div>
        <div className="auth-footer">
          <span>© 2026 Claro Immigration</span>
          <span>
            <span className="secure-dot" /> Your data is encrypted and secure
          </span>
        </div>
      </div>
    </div>
  );
}

