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
  const pageSize = Number(state.pageSize) || 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // clamp current page
  if (state.page > totalPages) state.page = totalPages;

  const startIndex = (state.page - 1) * pageSize;
  const pageItems = data.slice(startIndex, startIndex + pageSize);

  // reset table body
  els.historyBody.innerHTML = "";

  // handle empty state
  els.emptyState.style.display = pageItems.length === 0 ? "block" : "none";
  if (pageItems.length === 0) {
    renderPagination(totalPages, state.page);
    return;
  }

  // build rows efficiently
  const fragment = document.createDocumentFragment();

  pageItems.forEach(r => {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = formatDateDisplay(r.date);
    tr.appendChild(tdDate);

    const tdItem = document.createElement("td");
    tdItem.textContent = escapeHtml(r.itemName);
    tr.appendChild(tdItem);

    const tdType = document.createElement("td");
    tdType.textContent = escapeHtml(r.type);
    tr.appendChild(tdType);

    const tdStatus = document.createElement("td");
    tdStatus.appendChild(statusBadge(r.status));
    tr.appendChild(tdStatus);

    const tdReturnDate = document.createElement("td");
    tdReturnDate.textContent = formatDateDisplay(r.returnDate);
    tr.appendChild(tdReturnDate);

    fragment.appendChild(tr);
  });

  els.historyBody.appendChild(fragment);

  renderPagination(totalPages, state.page);
}
