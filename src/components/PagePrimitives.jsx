import { ChevronDown, MoreHorizontal } from "lucide-react";

export function Stat({ icon, tone, label, value, foot }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <span className="stat-label">{label}</span>
      <b className="stat-value">{value}</b>
      <div className="stat-foot">{foot}</div>
      <button className="stat-more" aria-label={`More about ${label}`} type="button">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}

export function CardTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="card-title">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="card-action" onClick={onAction} type="button">
          {action}
          <ChevronDown size={13} />
        </button>
      )}
    </div>
  );
}
