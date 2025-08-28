import { els, state } from "./state.mjs";

/**
 * Populates the item select dropdown with available items.
 * Clears existing options and adds a default placeholder.
 */
export function populateItemSelect() {
  const sel = els.itemSelect;
  if (!sel) return;

  sel.innerHTML = '<option value="">-- select an item --</option>';
  for (const it of state.items) {
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = `${it.name} (${it.type})`;
    sel.appendChild(opt);
  }
}

/**
 * Populates the type filter dropdown with unique item types.
 * Clears existing options and adds a default "All types" option.
 */
export function populateTypeFilter() {
  const sel = els.typeFilter;
  if (!sel) return;

  const types = [...new Set(state.items.map(i => i.type))].sort();

  sel.innerHTML = '<option value="">All types</option>';
  for (const t of types) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  }
}

/**
 * Returns reservations filtered and sorted based on the current filters and sorting state.
 */
export function getFilteredReservations() {
  const f = state.filters;
  let list = [...state.reservations];

  // --- filtering ---
  if (f.search?.trim()) {
    const q = f.search.trim().toLowerCase();
    list = list.filter(r =>
      r.employeeId?.toLowerCase().includes(q) ||
      r.itemName?.toLowerCase().includes(q)
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

  // --- sorting ---
  const { key, dir } = state.sort;
  const direction = dir === "asc" ? 1 : -1;

  list.sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";

    if (key === "date" || key === "returnDate") {
      return (new Date(av) - new Date(bv)) * direction;
    }

    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as === bs) return 0;
    return (as > bs ? 1 : -1) * direction;
  });

  return list;
}

/**
 * Renders pagination controls based on total pages and active page.
 * Includes "Prev" and "Next" navigation, as well as numbered page buttons.
 */
export function renderPagination(totalPages, activePage) {
  const container = els.pagination;
  if (!container) return;
  container.innerHTML = "";

  const maxButtons = 7;

  /**
   * Creates an individual pagination element.
   */
  const createPageItem = (page, label = null, disabled = false, active = false) => {
    const li = document.createElement("li");
    li.className = "page-item" + (disabled ? " disabled" : "") + (active ? " active" : "");

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label || String(page);
    a.addEventListener("click", e => {
      e.preventDefault();
      if (!disabled && state.page !== page) {
        state.page = page;
        renderTable();
      }
    });

    li.appendChild(a);
    return li;
  };

  // --- Previous ---
  container.appendChild(createPageItem(
    Math.max(1, activePage - 1),
    "Prev",
    activePage === 1
  ));

  // --- Numbered pages ---
  let start = Math.max(1, activePage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let p = start; p <= end; p++) {
    container.appendChild(createPageItem(p, null, false, p === activePage));
  }

  // --- Next ---
  container.appendChild(createPageItem(
    Math.min(totalPages, activePage + 1),
    "Next",
    activePage === totalPages
  ));
}
