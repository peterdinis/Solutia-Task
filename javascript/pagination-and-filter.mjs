import { els, state } from "./state.mjs";

/**
 * Populates the item select dropdown with available items.
 * Clears existing options and adds a default placeholder.
 *
 * @function
 * @returns {void}
 */
export function populateItemSelect() {
  const sel = els.itemSelect;
  sel.innerHTML = '<option value="">-- select an item --</option>';
  state.items.forEach(it => {
    const opt = document.createElement('option');
    opt.value = it.id;
    opt.textContent = `${it.name} (${it.type})`;
    sel.appendChild(opt);
  });
}

/**
 * Populates the type filter dropdown with unique item types.
 * Clears existing options and adds a default "All types" option.
 *
 * @function
 * @returns {void}
 */
export function populateTypeFilter() {
  const types = Array.from(new Set(state.items.map(i => i.type))).sort();
  const sel = els.typeFilter;
  sel.innerHTML = '<option value="">All types</option>';
  types.forEach(t => {
    const o = document.createElement('option');
    o.value = t;
    o.textContent = t;
    sel.appendChild(o);
  });
}

/**
 * Returns reservations filtered and sorted based on the current filters and sorting state.
 *
 * Filtering includes:
 * - Search term (employeeId or itemName)
 * - Item type
 * - Date range (from/to)
 * - Statuses
 *
 * Sorting is applied based on the current sort key and direction.
 *
 * @function
 * @returns {Array} Filtered and sorted list of reservations.
 */
export function getFilteredReservations() {
  const f = state.filters;
  let list = state.reservations.slice();

  if (f.search && f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    list = list.filter(r =>
      (r.employeeId && r.employeeId.toLowerCase().includes(q)) ||
      (r.itemName && r.itemName.toLowerCase().includes(q))
    );
  }

  if (f.type) {
    list = list.filter(r => r.type === f.type);
  }

  if (f.dateFrom) {
    list = list.filter(r => r.date >= f.dateFrom);
  }
  if (f.dateTo) {
    list = list.filter(r => r.date <= f.dateTo);
  }

  if (Array.isArray(f.statuses) && f.statuses.length) {
    list = list.filter(r => f.statuses.includes(r.status));
  }

  const key = state.sort.key;
  const dir = state.sort.dir === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    if (key === 'date' || key === 'returnDate') {
      const av = a[key] || '';
      const bv = b[key] || '';
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * dir;
    } else {
      const av = (a[key] || '').toString().toLowerCase();
      const bv = (b[key] || '').toString().toLowerCase();
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * dir;
    }
  });

  return list;
}

/**
 * Renders pagination controls based on total pages and active page.
 * Includes "Prev" and "Next" navigation, as well as numbered page buttons.
 *
 * @function
 * @param {number} totalPages - Total number of pages.
 * @param {number} activePage - Current active page.
 * @returns {void}
 */
export function renderPagination(totalPages, activePage) {
  els.pagination.innerHTML = '';

  /**
   * Creates an individual pagination element.
   *
   * @param {number} p - Page number to navigate to.
   * @param {string|null} [text=null] - Custom text for the button (defaults to page number).
   * @param {boolean} [disabled=false] - Whether the button is disabled.
   * @param {boolean} [active=false] - Whether the button is the active page.
   * @returns {HTMLElement} The created list item (`<li>`) containing the page link.
   */
  const createPageItem = (p, text = null, disabled = false, active = false) => {
    const li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = text || String(p);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (!disabled) {
        state.page = p;
        renderTable();
      }
    });
    li.appendChild(a);
    return li;
  };

  // Previous button
  els.pagination.appendChild(createPageItem(Math.max(1, activePage - 1), 'Prev', activePage === 1));

  // Numbered page buttons
  const maxButtons = 7;
  let start = Math.max(1, activePage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  for (let p = start; p <= end; p++) {
    els.pagination.appendChild(createPageItem(p, null, false, p === activePage));
  }

  // Next button
  els.pagination.appendChild(createPageItem(Math.min(totalPages, activePage + 1), 'Next', activePage === totalPages));
}
