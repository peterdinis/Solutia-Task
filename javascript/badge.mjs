/**
 * Creates status badge element
 * @param {string} status - Reservation status
 * @returns {HTMLElement} Span element with appropriate class
 */
export function statusBadge(status) {
  const span = document.createElement('span');
  span.className = `status-badge ${status}`;
  span.textContent = status;
  return span;
}
