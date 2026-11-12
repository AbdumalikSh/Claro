import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, FileCheck2, FileText, Globe2, LayoutDashboard, LogOut, Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Sparkles, UploadCloud, Users, X, ArrowDownLeft, Home } from "lucide-react";
export default function Modal({ kind, close, user, onBook }) {
  const title =
    kind === "upload"
      ? "Upload a document"
      : kind === "appointment"
        ? "Create an appointment"
        : "Book a consultation";
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState({ title: "", date: "2026-11-20", time: "10:30 AM" });
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close icon-btn" onClick={close}>
          <X />
        </button>
        {success ? (
          <div className="modal-success">
            <span>
              <Check />
            </span>
            <h2>All set!</h2>
            <p>
              {kind === "upload"
                ? "Your document is ready for review."
                : kind === "appointment"
                  ? "Your appointment has been added to the calendar."
                  : "Your consultation request has been sent."}
            </p>
            <button className="primary-btn" onClick={close}>
              Done <Check size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="modal-icon">
              {kind === "upload" ? (
                <UploadCloud />
              ) : kind === "appointment" ? (
                <CalendarDays />
              ) : (
                <MessageCircle />
              )}
            </div>
            <h2>{title}</h2>
            <p className="modal-desc">
              {kind === "upload"
                ? "Add a file to your secure application portal."
                : kind === "appointment"
                  ? "Keep the next milestone on everyone’s calendar."
                  : "Talk through your options with a visa expert."}
            </p>
            {kind === "upload" ? (
              <div className="modal-drop">
                <UploadCloud />
                <b>Choose a file to upload</b>
                <span>PDF, JPG or PNG up to 10 MB</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            ) : (
              <div className="modal-fields">
                {kind === "appointment" && (
                  <label>
                    Client
                    <select defaultValue="Alex Morgan">
                      <option>Alex Morgan</option>
                      <option>Priya Shah</option>
                      <option>Daniel Kim</option>
                    </select>
                  </label>
                )}
                <label>
                  {kind === "appointment"
                    ? "Appointment title"
                    : "What would you like to discuss?"}
                  <input
                    value={booking.title}
                    onChange={(event) => setBooking((current) => ({ ...current, title: event.target.value }))}
                    placeholder={
                      kind === "appointment"
                        ? "e.g. Document review"
                        : "e.g. My application timeline"
                    }
                  />
                </label>
                <div className="modal-field-row">
                  <label>
                    Date
                    <input type="date" value={booking.date} onChange={(event) => setBooking((current) => ({ ...current, date: event.target.value }))} />
                  </label>
                  <label>
                    Time
                    <select value={booking.time} onChange={(event) => setBooking((current) => ({ ...current, time: event.target.value }))}>
                      <option>10:30 AM</option>
                      <option>1:00 PM</option>
                      <option>3:30 PM</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
            <button
              className="primary-btn modal-submit"
              onClick={() => {
                if (kind !== "upload") {
                  const bookingItem = { id: Date.now(), title: booking.title || (kind === "appointment" ? "Visa appointment" : "Visa consultation"), date: booking.date, time: booking.time, type: "Video call", client: user?.name || "Alex Morgan" };
                  onBook?.(bookingItem);
                  toast.success(kind === "appointment" ? "Appointment added to your calendar" : "Consultation booked successfully");
                } else toast.success("Document uploaded for review");
                setSuccess(true);
              }}
            >
              {kind === "upload"
                ? "Upload document"
                : kind === "appointment"
                  ? "Create appointment"
                  : "Request consultation"}{" "}
              <ArrowRight size={16} />
            </button>
            <div className="modal-security">
              <ShieldCheck size={14} /> Your information is kept private and
              secure
            </div>
          </>
        )}
      </div>
    </div>
  );
}
