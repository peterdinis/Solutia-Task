/**
 * Pads a number with leading zero if it's less than 10.
 * @param {number} n - Number to pad.
 * @returns {string} Padded number as a string.
 */
export const pad = (n) => String(n).padStart(2, '0');

/**
 * Converts a Date object to a string in YYYY-MM-DD format.
 * @param {Date|string|number} d - Date object or valid date input.
 * @returns {string} Formatted date string.
 */
export const toDateStr = (d) => {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Gets today's date with time set to midnight.
 * @returns {Date}
 */
export const today = (() => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
})();

/**
 * Returns a Date object representing the base date plus n days, time set to midnight.
 * @param {number} n - Number of days to add (can be negative).
 * @param {Date} [base=new Date()] - Base date.
 * @returns {Date} New Date object.
 */
export const addDays = (n, base = new Date()) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Formats a date for display in English locale.
 * @param {string|Date} d - Date string or Date object.
 * @param {string} [locale='en-US'] - Locale for formatting.
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options.
 * @returns {string} Formatted date
 */
export function formatDateDisplay(
  d,
  locale = 'en-US',
  options = { year: 'numeric', month: 'short', day: 'numeric' }
) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat(locale, options).format(date);
}
