/**
 * Pads a number with leading zero if it's less than 10.
 * @param {number} n - Number to pad.
 * @returns {string} Padded number as a string.
 */
export const pad = (n) => String(n).padStart(2, '0');

/**
 * Converts a Date object to a string in YYYY-MM-DD format.
 * @param {Date} d - Date object.
 * @returns {string} Formatted date string.
 */
export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Gets today's date with time set to midnight.
 * @constant {Date}
 */
export const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

/**
 * Returns a Date object representing the current date plus n days, time set to midnight.
 * @param {number} n - Number of days to add (can be negative).
 * @returns {Date} New Date object.
 */
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Formats date for display in Slovak format
 * @param {string} dStr - Date as string
 * @returns {string} Formatted date
 */
export function formatDateDisplay(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr + 'T00:00:00');
  return d.toLocaleDateString('en-US');
}
