import { today } from "./date-utils.mjs";

/**
 * Global application state
 * @type {Object}
 */
export let state = {
  reservations: [],
  items: [],
  filters: {
    search: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    statuses: ['Pending', 'Returned', 'Overdue']
  },
  sort: { key: 'date', dir: 'desc' },
  page: 1,
  pageSize: 10,
  calendarYear: today.getFullYear(),
  calendarMonth: today.getMonth()
};

/**
 * DOM element references
 * @type {Object}
 */
export const els = {
  itemSelect: document.getElementById('itemSelect'),
  typeFilter: document.getElementById('typeFilter'),
  reservationForm: document.getElementById('reservation-form'),
  employeeId: document.getElementById('employeeId'),
  dateInput: document.getElementById('dateInput'),
  submitBtn: document.getElementById('submitBtn'),
  sendNotifyBtn: document.getElementById('sendNotifyBtn'),
  formAlert: document.getElementById('formAlert'),
  historyBody: document.getElementById('historyBody'),
  searchInput: document.getElementById('searchInput'),
  dateFrom: document.getElementById('dateFrom'),
  dateTo: document.getElementById('dateTo'),
  pageSize: document.getElementById('pageSize'),
  pagination: document.getElementById('pagination'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  emptyState: document.getElementById('emptyState'),
  calendar: document.getElementById('calendar'),
  monthLabel: document.getElementById('monthLabel'),
  prevMonth: document.getElementById('prevMonth'),
  nextMonth: document.getElementById('nextMonth')
};