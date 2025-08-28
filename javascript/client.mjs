import { today } from "./date-utils.mjs";
import { getNextId, mockFetch } from "./mocks.mjs";
import { showLoading, debounce } from "./helpers.mjs";
import { state, els } from "./state.mjs";
import { populateItemSelect, populateTypeFilter } from "./pagination-and-filter.mjs";
import { showFormAlert } from "./alert.mjs";
import { renderTable } from "./table.mjs";
import { renderCalendar } from "./calendar.mjs";

/**
 * Loads initial data from API
 * @async
 */
async function loadData() {
  showLoading(true);
  const [items, reservations] = await Promise.all([
    mockFetch("/api/items"),
    mockFetch("/api/reservations"),
  ]);
  state.items = items;
  state.reservations = reservations;

  populateItemSelect();
  populateTypeFilter();
  renderTable();
  renderCalendar(state.calendarYear, state.calendarMonth);
  showLoading(false);
}

/**
 * Validate reservation form input
 */
function validateReservationForm(employeeId, itemId, date) {
  if (!itemId) return "Please select an item.";
  if (!date) return "Please select a date.";

  const picked = new Date(date + "T00:00:00");
  picked.setHours(0, 0, 0, 0);
  if (picked < today) return "Date cannot be in the past.";

  const dup = state.reservations.find(
    (r) => r.employeeId === employeeId && r.itemId === itemId && r.date === date
  );
  if (dup) return "A reservation for this employee, item, and date already exists.";

  return null;
}

/**
 * Handle reservation form submit
 */
async function handleReservationSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const employeeId = els.employeeId.value.trim();
  const itemId = els.itemSelect.value;
  const date = els.dateInput.value;

  const error = validateReservationForm(employeeId, itemId, date);
  if (error) {
    showFormAlert(error, "danger");
    return;
  }

  const item = state.items.find((i) => i.id === itemId);
  const newR = {
    id: getNextId(),
    date,
    itemId: item.id,
    itemName: item.name,
    type: item.type,
    employeeId,
    status: "Pending",
    returnDate: "",
  };

  showLoading(true);
  await new Promise((r) => setTimeout(r, 300));
  state.reservations.unshift(newR);
  renderTable();
  renderCalendar(state.calendarYear, state.calendarMonth);
  showLoading(false);

  form.reset();
  form.classList.remove("was-validated");
  showFormAlert("Reservation has been created (mock).", "success");
}

/**
 * Apply filters and re-render
 */
function applyFilterAndRender() {
  state.page = 1;
  renderTable();
}

/**
 * Update a filter value and re-render
 */
function updateFilter(key, value) {
  state.filters[key] = value;
  applyFilterAndRender();
}

/**
 * Update table headers for sort
 */
function updateSortHeaders() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    const key = th.getAttribute("data-sort");
    if (key === state.sort.key) {
      th.textContent = `${th.textContent.split(" ")[0]} ${
        state.sort.dir === "asc" ? "▴" : "▾"
      }`;
    } else {
      th.textContent = th.textContent.split(" ")[0];
    }
  });
}

/**
 * Change month in calendar
 */
function changeMonth(direction) {
  state.calendarMonth += direction;
  if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear--;
  }
  if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear++;
  }
  renderCalendar(state.calendarYear, state.calendarMonth);
}

/**
 * Attaches event listeners to DOM elements
 */
function attachListeners() {
  els.reservationForm.addEventListener("submit", handleReservationSubmit);

  els.sendNotifyBtn.addEventListener("click", async () => {
    const employeeId = els.employeeId.value.trim();
    const date = els.dateInput.value;
    const itemId = els.itemSelect.value;

    if (!employeeId || !date || !itemId) {
      showFormAlert(
        "To simulate an email, please fill in Employee ID, Item, and Date.",
        "warning"
      );
      return;
    }

    showLoading(true);
    const resp = await mockFetch("/api/notify", {
      method: "POST",
      body: JSON.stringify({ employeeId, date, itemId }),
    });
    showLoading(false);

    if (resp?.ok) showFormAlert("Simulated email has been sent.", "success");
    else showFormAlert("Email simulation failed.", "danger");
  });

  els.searchInput.addEventListener(
    "input",
    debounce(() => updateFilter("search", els.searchInput.value), 250)
  );

  els.typeFilter.addEventListener("change", () =>
    updateFilter("type", els.typeFilter.value)
  );
  els.dateFrom.addEventListener("change", () =>
    updateFilter("dateFrom", els.dateFrom.value)
  );
  els.dateTo.addEventListener("change", () =>
    updateFilter("dateTo", els.dateTo.value)
  );

  document.querySelectorAll(".status-filter").forEach((chk) => {
    chk.addEventListener("change", () => {
      const statuses = Array.from(
        document.querySelectorAll(".status-filter:checked")
      ).map((i) => i.value);
      updateFilter("statuses", statuses);
    });
  });

  els.pageSize.addEventListener("change", () => {
    state.pageSize = parseInt(els.pageSize.value, 10) || 10;
    applyFilterAndRender();
  });

  document.querySelectorAll("th[data-sort]").forEach((h) => {
    h.addEventListener("click", () => {
      const key = h.getAttribute("data-sort");
      if (state.sort.key === key) {
        state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
      } else {
        state.sort.key = key;
        state.sort.dir = "asc";
      }
      updateSortHeaders();
      renderTable();
    });
  });

  els.prevMonth.addEventListener("click", () => changeMonth(-1));
  els.nextMonth.addEventListener("click", () => changeMonth(1));
}

/**
 * Application initialization after DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  state.pageSize = parseInt(els.pageSize.value, 10) || 10;
  attachListeners();
  loadData();
});
