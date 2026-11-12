export function initials(name = "") {
  return name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
export function statusTone(status) {
  return status === "In review"
    ? "status-review"
    : status === "Ready to submit"
      ? "status-done"
      : "status-wait";
}
