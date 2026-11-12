import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, FileCheck2, FileText, Globe2, LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, UploadCloud, Users, X, ArrowDownLeft, Home } from "lucide-react";
import { initials, statusTone } from "../utils/format.js";
import { CardTitle, Stat } from "../components/PagePrimitives.jsx";
export default function Dashboard({ user, consultant, apps, setModal, setSection }) {
  const name = user.name.split(" ")[0];
  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            <span /> WEDNESDAY, NOVEMBER 12, 2026
          </span>
          <h1>
            {consultant ? "Good morning, Sofia" : "Good morning, Alex"}{" "}
            <span className="wave">✦</span>
          </h1>
          <p>
            {consultant
              ? "Here’s what’s happening with your clients today."
              : "Your journey is moving forward. Here’s your latest update."}
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setModal(consultant ? "appointment" : "consultation")}
        >
          <Plus size={17} />
          {consultant ? "Create appointment" : "Book a consultation"}
        </button>
      </div>
      <div className="welcome-banner">
        <div className="banner-icon">
          <Globe2 size={23} />
        </div>
        <div className="banner-copy">
          <span className="banner-kicker">
            {consultant ? "TODAY AT A GLANCE" : "YOUR CANADA JOURNEY"}
          </span>
          <h3>
            {consultant
              ? "A little progress goes a long way."
              : "One step closer to your new beginning."}
          </h3>
          <p>
            {consultant
              ? "You have 3 client tasks that need your attention today."
              : "Your skilled worker visa application is in review."}
          </p>
        </div>
        <div className="banner-right">
          {consultant ? (
            <>
              <div className="stacked-avatars">
                <span>AM</span>
                <span>PS</span>
                <span>DK</span>
                <span>+9</span>
              </div>
              <small>12 active clients</small>
            </>
          ) : (
            <>
              <div className="banner-progress">
                <b>68%</b>
                <span>complete</span>
              </div>
              <div className="progress-line">
                <i style={{ width: "68%" }} />
              </div>
            </>
          )}
          <button
            onClick={() =>
              setSection(consultant ? "Clients" : "My application")
            }
          >
            View {consultant ? "clients" : "application"}{" "}
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="banner-decoration" />
      </div>
      <div className="section-heading">
        <div>
          <h2>{consultant ? "Your overview" : "Your overview"}</h2>
          <p>A snapshot of your visa journey</p>
        </div>
        <button
          className="subtle-link"
          onClick={() => setSection(consultant ? "Clients" : "My application")}
        >
          View details <ArrowRight size={15} />
        </button>
      </div>
      <div className="stats-grid">
        {consultant ? (
          <>
            <Stat
              icon={<Users />}
              tone="blue"
              label="Active clients"
              value="12"
              foot={
                <>
                  <ArrowUpRight size={13} /> 2 new this week
                </>
              }
            />
            <Stat
              icon={<FileText />}
              tone="purple"
              label="Documents to review"
              value="8"
              foot={
                <>
                  <span className="stat-dot amber" /> 3 due today
                </>
              }
            />
            <Stat
              icon={<CalendarDays />}
              tone="green"
              label="Upcoming sessions"
              value="5"
              foot={
                <>
                  <Clock3 size={13} /> Next at 10:30 AM
                </>
              }
            />
            <Stat
              icon={<Check />}
              tone="orange"
              label="Cases completed"
              value="24"
              foot={
                <>
                  <ArrowUpRight size={13} /> +4 this month
                </>
              }
            />
          </>
        ) : (
          <>
            <Stat
              icon={<FileCheck2 />}
              tone="blue"
              label="Application progress"
              value="68%"
              foot={
                <>
                  <ArrowUpRight size={13} /> +12% this month
                </>
              }
            />
            <Stat
              icon={<CalendarDays />}
              tone="purple"
              label="Days to deadline"
              value="6"
              foot={
                <>
                  <Clock3 size={13} /> Document submission
                </>
              }
            />
            <Stat
              icon={<FileText />}
              tone="green"
              label="Documents ready"
              value="7 / 9"
              foot={
                <>
                  <span className="stat-dot green-dot" /> 2 still needed
                </>
              }
            />
            <Stat
              icon={<MessageCircle />}
              tone="orange"
              label="Messages"
              value="3"
              foot={
                <>
                  <span className="stat-dot blue-dot" /> 1 unread message
                </>
              }
            />
          </>
        )}
      </div>
      <div className="dashboard-grid">
        <div className="card progress-card">
          <CardTitle
            title={consultant ? "Client activity" : "Application progress"}
            subtitle={
              consultant
                ? "Recent movement across your caseload"
                : "Skilled Worker Visa · Canada"
            }
            action="Last 30 days"
          />
          <div className="progress-focus">
            <div className="ring-wrap">
              <svg viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="42" />
                <circle className="ring-fill" cx="50" cy="50" r="42" />
              </svg>
              <div className="ring-label">
                <b>
                  {consultant ? "12" : "68"}
                  <small>{consultant ? "" : "%"}</small>
                </b>
                <span>{consultant ? "active cases" : "complete"}</span>
              </div>
            </div>
            <div className="progress-text">
              <b>{consultant ? "Looking good, team" : "Looking good, Alex!"}</b>
              <p>
                {consultant
                  ? "Most clients are on track with their next steps."
                  : "You’re right on track. Keep it up — just a couple of things left to go."}
              </p>
              <button
                className="subtle-link"
                onClick={() =>
                  setSection(consultant ? "Clients" : "My application")
                }
              >
                See full breakdown <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="mini-milestones">
            <div className="milestone done">
              <span>
                <Check size={12} />
              </span>
              <div>
                <b>Profile completed</b>
                <small>Oct 28, 2026</small>
              </div>
            </div>
            <i />
            <div className="milestone done">
              <span>
                <Check size={12} />
              </span>
              <div>
                <b>Documents submitted</b>
                <small>Nov 04, 2026</small>
              </div>
            </div>
            <i />
            <div className="milestone current">
              <span>03</span>
              <div>
                <b>Under review</b>
                <small>In progress</small>
              </div>
            </div>
            <i />
            <div className="milestone">
              <span>04</span>
              <div>
                <b>Visa decision</b>
                <small>Upcoming</small>
              </div>
            </div>
          </div>
        </div>
        <div className="card deadlines-card">
          <CardTitle
            title="Coming up"
            subtitle="Your next important dates"
            action="View calendar"
            onAction={() => setSection("Calendar")}
          />
          <div className="deadline-list">
            <Deadline
              date="18"
              month="NOV"
              title={
                consultant ? "Review Alex’s proof of funds" : "Proof of funds"
              }
              type="DOCUMENT DUE"
              tone="blue"
            />
            <Deadline
              date="20"
              month="NOV"
              title={
                consultant ? "Priya’s consultation" : "Consultation with Sofia"
              }
              type="10:30 AM · VIDEO CALL"
              tone="purple"
            />
            <Deadline
              date="22"
              month="NOV"
              title="Application submission"
              type="MILESTONE"
              tone="green"
            />
          </div>
          <button
            className="calendar-link"
            onClick={() => setSection("Calendar")}
          >
            <CalendarDays size={15} /> Open full calendar{" "}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="dashboard-grid lower-grid">
        <div className="card tasks-card">
          <CardTitle
            title={consultant ? "Needs your attention" : "Your next steps"}
            subtitle={
              consultant
                ? "A few things to keep moving"
                : "Small steps make big progress"
            }
            action="See all"
            onAction={() =>
              setSection(consultant ? "Documents" : "My application")
            }
          />
          <div className="task-list">
            <Task
              icon={<UploadCloud />}
              title={
                consultant ? "Review proof of funds" : "Upload proof of funds"
              }
              desc={
                consultant
                  ? "Alex Morgan · Skilled Worker Visa"
                  : "Required for your Canada application"
              }
              badge="Due in 6 days"
              tone="amber"
              onClick={() => setSection("Documents")}
            />
            <Task
              icon={<FileText />}
              title={
                consultant
                  ? "Check academic transcript"
                  : "Add your employment letter"
              }
              desc={
                consultant
                  ? "Priya Shah · Student Visa"
                  : "We’ll help you check it before submission"
              }
              badge={consultant ? "Due in 8 days" : "Required"}
              tone="blue"
              onClick={() => setSection("Documents")}
            />
          </div>
        </div>
        <div className="card advisor-card">
          <CardTitle
            title="Your consultant"
            subtitle="Here to guide your journey"
          />
          <div className="advisor-profile">
            <div className="advisor-avatar">SB</div>
            <div>
              <b>{consultant ? "Your Claro team" : "Sofia Bennett"}</b>
              <span>
                {consultant
                  ? "Client success team"
                  : "Senior Immigration Consultant"}
              </span>
              <div className="online-status">
                <i /> Online now
              </div>
            </div>
            <button
              className="icon-btn message-icon"
              onClick={() => setSection("Messages")}
            >
              <MessageCircle size={17} />
            </button>
          </div>
          <p className="advisor-note">
            “You’re making great progress, Alex. Let’s get those last documents
            ready!”
          </p>
          <button
            className="message-btn"
            onClick={() => setSection("Messages")}
          >
            <MessageCircle size={15} /> Send a message <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="card applications-card">
        <CardTitle
          title={consultant ? "Client applications" : "Your recent documents"}
          subtitle={
            consultant
              ? "Stay up to date with every case"
              : "Your submitted files at a glance"
          }
          action="View all"
          onAction={() => setSection(consultant ? "Clients" : "Documents")}
        />
        {consultant ? (
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
                {apps.slice(0, 3).map((a) => (
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
                      <span className={`status-pill ${statusTone(a.status)}`}>
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
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>DOCUMENT</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>UPLOADED</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[
                  ["Passport scan", "Identity", "Verified", "Nov 04"],
                  ["Employment letter", "Work history", "Verified", "Nov 03"],
                  ["Proof of funds", "Financial", "Needed", "—"],
                ].map((d, i) => (
                  <tr key={d[0]}>
                    <td>
                      <div className="client-cell">
                        <span className={`doc-icon doc-${i}`}>
                          <FileText size={16} />
                        </span>
                        <b>{d[0]}</b>
                      </div>
                    </td>
                    <td>{d[1]}</td>
                    <td>
                      <span
                        className={`status-pill ${d[2] === "Needed" ? "status-wait" : "status-done"}`}
                      >
                        <i />
                        {d[2]}
                      </span>
                    </td>
                    <td>{d[3]}, 2026</td>
                    <td>
                      <button
                        className="icon-btn dots"
                        onClick={() => setSection("Documents")}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Deadline({ date, month, title, type, tone }) {
  return (
    <div className="deadline-item">
      <div className={`deadline-date ${tone}`}>
        <b>{date}</b>
        <span>{month}</span>
      </div>
      <div className="deadline-copy">
        <b>{title}</b>
        <span>{type}</span>
      </div>
      <button className="icon-btn dots">
        <MoreHorizontal size={17} />
      </button>
    </div>
  );
}
function Task({ icon, title, desc, badge, tone, onClick }) {
  return (
    <button className="task-item" onClick={onClick}>
      <span className={`task-icon ${tone}`}>{icon}</span>
      <span className="task-copy">
        <b>{title}</b>
        <small>{desc}</small>
      </span>
      <span className={`task-badge ${tone}`}>{badge}</span>
      <ChevronRight className="task-arrow" size={16} />
    </button>
  );
}
