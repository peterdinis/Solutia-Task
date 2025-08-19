import { els } from "./state.mjs";

/**
 * Shows temporary alert in form area
 * @param {string} msg - Message to display
 * @param {string} [type='success'] - Alert type (success, danger, warning, info)
 */
export function showFormAlert(msg, type = 'success') {
  els.formAlert.innerHTML = '';
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.textContent = msg;
  els.formAlert.appendChild(div);
  setTimeout(() => {
    if (els.formAlert.contains(div)) div.remove();
  }, 2000);
}