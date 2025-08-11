import { els } from "./state.mjs";

/**
 * Shows or hides loading spinner
 * @param {boolean} show - Whether spinner should be shown
 */
export function showLoading(show) {
  els.loadingSpinner.style.display = show ? 'block' : 'none';
}

/**
 * Debounce function to limit function call frequency
 * @param {Function} fn - Function to debounce
 * @param {number} [wait=200] - Wait time in milliseconds
 * @returns {Function} Debounce wrapper function
 */
export function debounce(fn, wait=200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Escapes HTML characters in text for safe display
 * @param {string} str - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return (''+str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}