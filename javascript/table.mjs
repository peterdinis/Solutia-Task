import { getFilteredReservations } from "./pagination-and-filter.mjs";
import { state, els } from "./state.mjs";
import { formatDateDisplay } from "./date-utils.mjs";
import { escapeHtml } from "./helpers.mjs";
import { statusBadge } from "./badge.mjs";
import { renderPagination } from "./pagination-and-filter.mjs";

/**
 * Renders reservation table with pagination
 */
export function renderTable() {
  const data = getFilteredReservations();
  const total = data.length;
  const pageSize = parseInt(state.pageSize, 10) || 10;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (state.page > pages) state.page = pages;

  const start = (state.page - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);

  els.historyBody.innerHTML = '';
  if (pageItems.length === 0) {
    els.emptyState.style.display = 'block';
  } else {
    els.emptyState.style.display = 'none';
  }

  pageItems.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDateDisplay(r.date)}</td>
      <td>${escapeHtml(r.itemName)}</td>
      <td>${escapeHtml(r.type)}</td>
      <td></td>
      <td>${formatDateDisplay(r.returnDate)}</td>
    `;
    const statusCell = tr.querySelector('td:nth-child(4)');
    statusCell.appendChild(statusBadge(r.status));
    els.historyBody.appendChild(tr);
  });

  renderPagination(pages, state.page);
}