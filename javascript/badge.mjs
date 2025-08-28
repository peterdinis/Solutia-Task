/**
 * Creates a status badge element with a consistent style based on reservation status.
 *
 * @param {string} status - Reservation status (e.g. "Pending", "Returned", "Overdue").
 * @returns {HTMLSpanElement} A span element with Bootstrap badge styling.
 */
export function statusBadge(status) {
  /** @type {Record<string, string>} */
  const statusClasses = {
    Pending: "bg-warning text-dark",
    Returned: "bg-success",
    Overdue: "bg-danger",
  };

  const span = document.createElement("span");
  span.className = `badge rounded-pill ${statusClasses[status] || "bg-secondary"}`;
  span.textContent = status;

  return span;
}