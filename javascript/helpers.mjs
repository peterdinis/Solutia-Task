import { els } from "./state.mjs";

/**
 * Shows or hides a loading spinner element.
 * Uses `hidden` attribute instead of inline style for better semantics.
 * @param {boolean} show - Whether spinner should be shown.
 */
export function showLoading(show) {
  if (!els?.loadingSpinner) return;
  els.loadingSpinner.hidden = !show;
}

/**
 * Debounce function to limit function call frequency.
 * Ensures `this` context is preserved and allows cancellation/flush.
 * @param {Function} fn - Function to debounce.
 * @param {number} [wait=200] - Wait time in milliseconds.
 * @returns {Function & {cancel: Function, flush: Function}} Debounced function with control methods.
 */
export function debounce(fn, wait = 200) {
  let timeout;

  function debounced(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(context, args), wait);
  }

  debounced.cancel = () => clearTimeout(timeout);

  debounced.flush = (...args) => {
    clearTimeout(timeout);
    fn.apply(this, args);
  };

  return debounced;
}

/**
 * Escapes HTML special characters in text for safe display.
 * Prevents XSS when inserting user content.
 * @param {string|number} str - Text to escape.
 * @returns {string} Escaped text.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
