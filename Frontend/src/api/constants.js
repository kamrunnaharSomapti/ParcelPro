
export const STATUS_CONFIG = {
  Pending: { bg: "bg-yellow-50", border: "border-yellow-200", color: "text-yellow-700", label: "Pending" },
  Assigned: { bg: "bg-purple-50", border: "border-purple-200", color: "text-purple-700", label: "Assigned" },
  "Picked Up": { bg: "bg-blue-50", border: "border-blue-200", color: "text-blue-700", label: "Picked Up" },
  "In Transit": { bg: "bg-indigo-50", border: "border-indigo-200", color: "text-indigo-700", label: "In Transit" },
  Delivered: { bg: "bg-green-50", border: "border-green-200", color: "text-green-700", label: "Delivered" },
  Failed: { bg: "bg-red-50", border: "border-red-200", color: "text-red-700", label: "Failed" },
};

export const STATUS_ORDER = ["Assigned", "Picked Up", "In Transit", "Delivered"];

export function normalizeStatus(s) {
  if (!s) return "Pending";
  return String(s).trim();
}

export function canMoveTo(current, next) {
  const c = normalizeStatus(current);
  if (c === "Delivered" || c === "Failed") return false;
  if (next === "Failed") return true;

  const ci = STATUS_ORDER.indexOf(c);
  const ni = STATUS_ORDER.indexOf(next);
  return ci !== -1 && ni !== -1 && ni === ci + 1;
}