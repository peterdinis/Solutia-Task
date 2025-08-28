import { els } from "./state.mjs";

/**
 * Shows a temporary alert message in the form area.
 * Supports multiple alerts at once and fade-out animation.
 *
 * @param {string} msg - Message to display in the alert.
 * @param {'success' | 'danger' | 'warning' | 'info'} [type='success'] - Alert type, matches Bootstrap alert classes.
 * @param {number} [duration=2000] - How long (in ms) the alert stays visible before fading out.
 */
export function showFormAlert(msg, type = 'success', duration = 2000) {
  if (!els.formAlert) return;

  // Create alert element
  const div = document.createElement('div');
  div.className = `alert alert-${type} fade show`; // Bootstrap fade class
  div.textContent = msg;

  els.formAlert.appendChild(div);

  // Remove alert after duration with fade-out
  setTimeout(() => {
    div.classList.remove('show'); // Bootstrap fade-out
    div.addEventListener('transitionend', () => div.remove(), { once: true });
  }, duration);
}