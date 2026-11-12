import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, FileCheck2, FileText, Globe2, LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, UploadCloud, Users, X, ArrowDownLeft, Home } from "lucide-react";
import { initials, statusTone } from "../utils/format.js";
import { toast } from "react-hot-toast";
import { CardTitle, Stat } from "../components/PagePrimitives.jsx";
export default function SectionPage({ section, consultant, apps, setApps, setModal, consultations = [], onBook, user, onUpdateProfile }) {
  const [search, setSearch] = useState("");
  const titleMap = {
    "My application": "Your application",
    Clients: "Client directory",
    Documents: consultant ? "Document review" : "Your documents",
    Calendar: "Your calendar",
    Consultations: "Upcoming consultations",
    Requirements: "Visa requirements",
    Messages: "Messages",
    Settings: "Settings",
  };
  const subtitleMap = {
    "My application":
      "Track each stage of your Skilled Worker Visa application.",
    Clients: "Manage your active cases and keep every journey moving.",
    Documents: consultant
      ? "Review and approve documents submitted by your clients."
      : "Upload and manage documents for your application.",
    Calendar: "Keep every appointment and deadline in one place.",
    Consultations: "Your booked sessions with Claro consultants, all in one place.",
    Requirements: "A practical checklist tailored to your Canada visa journey.",
    Messages: "Stay connected with your Claro consultant.",
    Settings: "Manage your account and preferences.",
  };
  return (
    <div className="page-content section-page">
      <div className="section-page-head">
        <div>
          <span className="eyebrow">
            <span /> CLARO PORTAL
          </span>
          <h1>{titleMap[section] || section}</h1>
          <p>
            {subtitleMap[section] || "Manage your visa journey with Claro."}
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() =>
            setModal(
              section === "Calendar"
                ? "appointment"
                : section === "Documents"
                  ? "upload"
                  : section === "Consultations"
                    ? "consultation"
                  : "consultation",
            )
          }
        >
          <Plus size={16} />
          {section === "Calendar"
            ? "New appointment"
            : section === "Documents"
              ? "Upload document"
              : section === "Consultations"
                ? "Book a consultation"
              : "Get support"}
        </button>
      </div>
      {section === "My application" && (
        <>
          <div className="welcome-banner section-banner">
            <div className="banner-icon">
              <Globe2 />
            </div>
            <div className="banner-copy">
              <span className="banner-kicker">
                CANADA · SKILLED WORKER VISA
              </span>
              <h3>Your application is in a great place.</h3>
              <p>
                Case reference CL-2026-0418 · Last updated November 10, 2026
              </p>
            </div>
            <div className="banner-progress">
              <b>68%</b>
              <span>complete</span>
              <div className="progress-line">
                <i style={{ width: "68%" }} />
              </div>
            </div>
          </div>
          <div className="card wide-card">
            <CardTitle
              title="Application timeline"
              subtitle="We’ll keep you updated at every step"
            />
            <div className="full-timeline">
              {[
                [
                  "Profile completed",
                  "Your personal details are ready.",
                  "Oct 28, 2026",
                  "done",
                ],
                [
                  "Documents submitted",
                  "7 documents have been received.",
                  "Nov 04, 2026",
                  "done",
                ],
                [
                  "Application under review",
                  "Our team is reviewing your application.",
                  "In progress",
                  "current",
                ],
                [
                  "Ready for submission",
                  "We’ll prepare the final application package.",
                  "Upcoming",
                  "",
                ],
                [
                  "Visa decision",
                  "The immigration authority will review your case.",
                  "Upcoming",
                  "",
                ],
              ].map((m, i) => (
                <div className={`full-milestone ${m[3]}`} key={m[0]}>
                  <span className="timeline-bullet">
                    {m[3] === "done" ? (
                      <Check size={13} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <div>
                    <b>{m[0]}</b>
                    <p>{m[1]}</p>
                  </div>
                  <small>{m[2]}</small>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {section === "Clients" && (
        <>
          <div className="filter-row">
            <div className="search-box">
              <Search size={16} />
              <input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="filter-button">
              All cases <ChevronDown size={14} />
            </button>
            <button className="filter-button">
              Status <ChevronDown size={14} />
            </button>
          </div>
          <div className="card applications-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>VISA TYPE</th>
                    <th>STATUS</th>
                    <th>PROGRESS</th>
                    <th>NEXT DEADLINE</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {apps
                    .filter((a) =>
                      a.client.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((a) => (
                      <tr key={a.id}>
                        <td>
                          <div className="client-cell">
                            <div className="avatar table-avatar">
                              {initials(a.client)}
                            </div>
                            <b>{a.client}</b>
                          </div>
                        </td>
                        <td>
                          {a.type}
                          <small className="cell-sub">{a.country}</small>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${statusTone(a.status)}`}
                          >
                            <i />
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-progress">
                            <span>
                              <i style={{ width: a.progress + "%" }} />
                            </span>
                            {a.progress}%
                          </div>
                        </td>
                        <td>{a.due}, 2026</td>
                        <td>
                          <button
                            className="icon-btn dots"
                            onClick={() => setModal("appointment")}
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {section === "Documents" && (
        <>
          <div className="document-counters">
            <Stat
              icon={<FileCheck2 />}
              tone="green"
              label="Verified"
              value={consultant ? "18" : "7"}
              foot="Ready for your application"
            />
            <Stat
              icon={<Clock3 />}
              tone="purple"
              label="In review"
              value={consultant ? "6" : "0"}
              foot="Usually within 2 business days"
            />
            <Stat
              icon={<UploadCloud />}
              tone="orange"
              label="Needs attention"
              value={consultant ? "3" : "2"}
              foot="Action required"
            />
          </div>
          <div className="card upload-panel" onClick={() => setModal("upload")}>
            <div className="upload-symbol">
              <UploadCloud />
            </div>
            <h3>Drop your files here</h3>
            <p>
              or{" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModal("upload");
                }}
              >
                browse files
              </button>{" "}
              from your device
            </p>
            <small>PDF, JPG or PNG · up to 10 MB per file</small>
          </div>
          <div className="card applications-card">
            <CardTitle
              title={consultant ? "Submitted documents" : "Your documents"}
              subtitle="Files for your current application"
              action="Filter"
            />
            <div className="document-list">
              {[
                ["Passport scan", "Identity document", "Verified", "Nov 04"],
                ["Employment letter", "Work history", "Verified", "Nov 03"],
                [
                  "Proof of funds",
                  "Financial evidence",
                  consultant ? "In review" : "Needed",
                  consultant ? "Nov 11" : "—",
                ],
                ["Academic transcript", "Education", "Needs update", "Nov 08"],
              ].map((d, i) => (
                <div className="document-row" key={d[0]}>
                  <span className={`doc-icon doc-${i}`}>
                    <FileText size={17} />
                  </span>
                  <div className="document-name">
                    <b>{d[0]}</b>
                    <span>
                      {consultant ? "Alex Morgan · " : ""}
                      {d[1]}
                    </span>
                  </div>
                  <span
                    className={`status-pill ${d[2] === "Verified" ? "status-done" : d[2] === "Needed" ? "status-wait" : "status-review"}`}
                  >
                    <i />
                    {d[2]}
                  </span>
                  <span className="uploaded-date">{d[3]}</span>
                  <button className="icon-btn dots">
                    <MoreHorizontal size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {section === "Calendar" && (
        <CalendarPage onNew={() => setModal("consultation")} consultations={consultations} />
      )}
      {section === "Consultations" && (
        <ConsultationsPage consultations={consultations} onBook={() => setModal("consultation")} />
      )}
      {section === "Requirements" && (
        <div className="requirements-layout">
          <div className="card requirements-card">
            <CardTitle
              title="Your document checklist"
              subtitle="Skilled Worker Visa · Canada"
              action="7 of 9 complete"
            />
            <div className="checklist">
              {[
                [
                  "Valid passport",
                  "A clear scan of your passport photo page.",
                  "done",
                ],
                [
                  "Employment reference letters",
                  "Include role, salary, hours and dates.",
                  "done",
                ],
                [
                  "Language test results",
                  "IELTS, CELPIP or another approved test.",
                  "done",
                ],
                [
                  "Proof of funds",
                  "Recent bank statements showing settlement funds.",
                  "needed",
                ],
                [
                  "Education credentials",
                  "Degree certificate and credential assessment.",
                  "needed",
                ],
                [
                  "Police certificates",
                  "From every country you’ve lived in for 6+ months.",
                  "done",
                ],
                [
                  "Medical examination",
                  "Complete with an approved panel physician.",
                  "optional",
                ],
              ].map((x, i) => (
                <div className="checklist-row" key={x[0]}>
                  <span className={`checklist-check ${x[2]}`}>
                    {x[2] === "done" ? (
                      <Check size={14} />
                    ) : x[2] === "needed" ? (
                      <span />
                    ) : (
                      <span>·</span>
                    )}
                  </span>
                  <div>
                    <b>{x[0]}</b>
                    <p>{x[1]}</p>
                  </div>
                  <span className={`requirement-state ${x[2]}`}>
                    {x[2] === "done"
                      ? "Complete"
                      : x[2] === "needed"
                        ? "Needed"
                        : "Upcoming"}
                  </span>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </div>
          <div className="card tip-card">
            <span className="tip-spark">
              <Sparkles />
            </span>
            <span className="banner-kicker">A QUICK TIP</span>
            <h3>Make every page count.</h3>
            <p>
              Check that each scan is clear, in colour, and includes all four
              corners of the document.
            </p>
            <button className="subtle-link">
              Read our upload guide <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
      {section === "Messages" && (
        <div className="card messages-card">
          <div className="message-thread-head">
            <div className="advisor-avatar">SB</div>
            <div>
              <b>{consultant ? "Claro Support" : "Sofia Bennett"}</b>
              <span>
                <i /> Online · typically replies in a few minutes
              </span>
            </div>
            <button className="icon-btn">
              <MoreHorizontal />
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-day">TODAY · NOVEMBER 12</div>
            <div className="bubble received">
              Hi Alex! I’ve reviewed your application and everything is looking
              great. We just need your latest proof of funds to keep things
              moving.<small>9:42 AM</small>
            </div>
            <div className="bubble sent">
              Thanks Sofia! I’ll upload it this afternoon.
              <small>
                9:48 AM <Check size={12} />
              </small>
            </div>
            <div className="bubble received">
              Perfect — let me know if you need any help getting it ready.
              <small>9:49 AM</small>
            </div>
          </div>
          <div className="chat-input">
            <input placeholder="Write a message..." />
            <button className="primary-btn">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      {section === "Settings" && <SettingsPage user={user} onSave={onUpdateProfile} />}
    </div>
  );
}

function CalendarPage({ onNew, consultations = [] }) {
  const [day, setDay] = useState(12);
  const [monthDate, setMonthDate] = useState(new Date(2026, 10, 1));
  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthDays = new Date(year, month + 1, 0).getDate();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="calendar-layout">
      <div className="card calendar-card">
        <div className="calendar-header">
          <div>
            <h3>{monthDate.toLocaleDateString("en", { month: "long", year: "numeric" })}</h3>
            <p>Your schedule and deadlines</p>
          </div>
          <div className="calendar-nav">
            <button className="icon-btn" aria-label="Previous month" onClick={() => setMonthDate(new Date(year, month - 1, 1))}>
              <ChevronLeft />
            </button>
            <button className="icon-btn" aria-label="Next month" onClick={() => setMonthDate(new Date(year, month + 1, 1))}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {days.map((d) => (
            <b className="weekday" key={d}>
              {d}
            </b>
          ))}
          {Array.from({ length: 42 }, (_, i) => {
            const n = i - offset + 1;
            const isCurrentMonth = n > 0 && n <= monthDays;
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
            const hasConsultation = isCurrentMonth && consultations.some((item) => item.date === dateKey);
            const displayDay = n < 1 ? new Date(year, month, n).getDate() : n > monthDays ? n - monthDays : n;
            return (
              <button
                key={dateKey + i}
                className={`calendar-day ${!isCurrentMonth ? "muted" : ""} ${isCurrentMonth && n === day ? "selected" : ""} ${(year === 2026 && month === 10 && [18, 20, 22].includes(n)) || hasConsultation ? "has-event" : ""}`}
                onClick={() => isCurrentMonth && setDay(n)}
              >
                {displayDay}
                {((year === 2026 && month === 10 && [18, 20, 22].includes(n)) || hasConsultation) && <i />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="card selected-day-card">
        <div className="selected-day-heading">
          <div>
            <span className="eyebrow">
              <span /> {new Date(year, month, day).toLocaleDateString("en", { weekday: "long" }).toUpperCase()}
            </span>
            <h3>{monthDate.toLocaleDateString("en", { month: "long" })} {day}</h3>
          </div>
          <button className="icon-btn dots">
            <MoreHorizontal />
          </button>
        </div>
        {consultations.filter((item) => item.date === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`).length ? consultations.filter((item) => item.date === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`).map((item) => (
          <div className="calendar-event" key={item.id}>
            <span className="event-line blue" />
            <div><small>{item.time}</small><b>{item.title || "Visa consultation"}</b><span>Claro consultation · {item.type || "Video call"}</span></div>
          </div>
        )) : day === 18 || day === 20 || day === 22 ? (
          <div className="calendar-event">
            <span className="event-line blue" />
            <div>
              <small>
                {day === 20 ? "10:30 AM" : day === 18 ? "ALL DAY" : "2:00 PM"}
              </small>
              <b>
                {day === 18
                  ? "Proof of funds due"
                  : day === 20
                    ? "Consultation with Sofia"
                    : "Application submission"}
              </b>
              <span>
                {day === 20
                  ? "Video call · 30 minutes"
                  : "Skilled Worker Visa · Canada"}
              </span>
            </div>
          </div>
        ) : (
          <div className="empty-day">
            <CalendarDays />
            <b>A little breathing room.</b>
            <span>No events scheduled for this day.</span>
          </div>
        )}
        <button className="calendar-link" onClick={onNew}>
          <Plus size={15} /> Add an appointment
        </button>
      </div>
    </div>
  );
}

function ConsultationsPage({ consultations, onBook }) {
  const [tab, setTab] = useState("Upcoming");
  const sorted = [...consultations].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visible = sorted.filter((item) => tab === "Upcoming" ? new Date(`${item.date}T12:00:00`) >= today : new Date(`${item.date}T12:00:00`) < today);
  return <div className="consultations-page">
    <div className="card consultation-list-card">
      <div className="consultation-toolbar"><div className="tabs"><button className={tab === "Upcoming" ? "selected" : ""} onClick={() => setTab("Upcoming")}>Upcoming <span>{sorted.length}</span></button><button className={tab === "Past" ? "selected" : ""} onClick={() => setTab("Past")}>Past</button></div><button className="primary-btn" onClick={onBook}><Plus size={16}/> Book consultation</button></div>
      {visible.length ? <div className="consultation-list">{visible.map((item) => <article className="consultation-item" key={item.id}><div className="consultation-date"><b>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en", { day: "2-digit" })}</b><span>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en", { month: "short" }).toUpperCase()}</span></div><div className="consultation-details"><b>{item.title || "Visa consultation"}</b><span>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · {item.time}</span><small>{item.type || "Video consultation"} · 30 minutes</small></div><span className="status-pill status-review"><i/>Confirmed</span><button className="icon-btn" aria-label="Open consultation"><ChevronRight size={17}/></button></article>)}</div> : <div className="consultation-empty"><span><CalendarDays/></span><b>{tab === "Upcoming" ? "No consultations booked yet" : "No past consultations"}</b><p>{tab === "Upcoming" ? "Book a session with a Claro consultant and it will appear here and on your calendar." : "Completed sessions will show up here."}</p>{tab === "Upcoming" && <button className="primary-btn" onClick={onBook}><Plus size={16}/> Book a consultation</button>}</div>}
    </div>
  </div>;
}

function SettingsPage({ user, onSave }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", country: user?.country || "Canada", visa: user?.visa || "Skilled Worker Visa" });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  return <form className="card settings-card" onSubmit={(event) => { event.preventDefault(); onSave(form); toast.success("Your profile has been updated"); }}>
    <CardTitle title="Profile information" subtitle="Update the details connected to your visa journey." />
    <div className="settings-fields"><label>Full name<input value={form.name} onChange={update("name")} required /></label><label>Email address<input type="email" value={form.email} onChange={update("email")} required /></label><label>Preferred destination<input value={form.country} onChange={update("country")} /></label><label>Visa type<input value={form.visa} onChange={update("visa")} /></label></div>
    <button className="primary-btn" type="submit">Save changes <Check size={15}/></button>
  </form>;
}

