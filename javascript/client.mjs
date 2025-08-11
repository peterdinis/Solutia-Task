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
    mockFetch('/api/items'),
    mockFetch('/api/reservations')
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
 * Attaches event listeners to DOM elements
 */
function attachListeners() {
  els.reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const employeeId = els.employeeId.value.trim();
    const itemId = els.itemSelect.value;
    const date = els.dateInput.value;

    if (!itemId) { showFormAlert('Please select an item.', 'danger'); return; }
    if (!date) { showFormAlert('Please select a date.', 'danger'); return; }

    const picked = new Date(date + 'T00:00:00');
    picked.setHours(0, 0, 0, 0);
    if (picked < today) {
      showFormAlert('Date cannot be in the past.', 'danger'); return;
    }

    const dup = state.reservations.find(r =>
      r.employeeId === employeeId && r.itemId === itemId && r.date === date
    );
    if (dup) {
      showFormAlert('A reservation for this employee, item, and date already exists.', 'danger');
      return;
    }

    const item = state.items.find(i => i.id === itemId);
    const newR = {
      id: getNextId(),
      date,
      itemId: item.id,
      itemName: item.name,
      type: item.type,
      employeeId,
      status: 'Pending',
      returnDate: ''
    };

    showLoading(true);
    await new Promise(r => setTimeout(r, 300));
    state.reservations.unshift(newR);
    renderTable();
    renderCalendar(state.calendarYear, state.calendarMonth);
    showLoading(false);
    form.reset();
    form.classList.remove('was-validated');
    showFormAlert('Reservation has been created (mock).', 'success');
  });

  els.sendNotifyBtn.addEventListener('click', async () => {
    const employeeId = els.employeeId.value.trim();
    const date = els.dateInput.value;
    const itemId = els.itemSelect.value;
    if (!employeeId || !date || !itemId) {
      showFormAlert('To simulate an email, please fill in Employee ID, Item, and Date.', 'warning');
      return;
    }
    showLoading(true);
    const resp = await mockFetch('/api/notify', {
      method: 'POST',
      body: JSON.stringify({ employeeId, date, itemId })
    });
    showLoading(false);
    if (resp && resp.ok) showFormAlert('Simulated email has been sent.', 'success');
    else showFormAlert('Email simulation failed.', 'danger');
  });

  els.searchInput.addEventListener('input', debounce(() => {
    state.filters.search = els.searchInput.value;
    state.page = 1;
    renderTable();
  }, 250));

  els.typeFilter.addEventListener('change', () => {
    state.filters.type = els.typeFilter.value;
    state.page = 1;
    renderTable();
  });

  els.dateFrom.addEventListener('change', () => {
    state.filters.dateFrom = els.dateFrom.value;
    state.page = 1;
    renderTable();
  });

  els.dateTo.addEventListener('change', () => {
    state.filters.dateTo = els.dateTo.value;
    state.page = 1;
    renderTable();
  });

  document.querySelectorAll('.status-filter').forEach(chk => {
    chk.addEventListener('change', () => {
      const arr = Array.from(document.querySelectorAll('.status-filter'))
        .filter(i => i.checked)
        .map(i => i.value);
      state.filters.statuses = arr;
      state.page = 1;
      renderTable();
    });
  });

  els.pageSize.addEventListener('change', () => {
    state.pageSize = parseInt(els.pageSize.value, 10) || 10;
    state.page = 1;
    renderTable();
  });

  document.querySelectorAll('th[data-sort]').forEach(h => {
    h.addEventListener('click', () => {
      const key = h.getAttribute('data-sort');
      if (state.sort.key === key) {
        state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.key = key;
        state.sort.dir = 'asc';
      }

      document.querySelectorAll('th[data-sort]').forEach(th => {
        if (th.getAttribute('data-sort') === state.sort.key) {
          th.textContent = `${th.textContent.split(' ')[0]} ${state.sort.dir === 'asc' ? '▴' : '▾'}`;
        } else {
          th.textContent = th.textContent.split(' ')[0];
        }
      });
      renderTable();
    });
  });

  els.prevMonth.addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
    renderCalendar(state.calendarYear, state.calendarMonth);
  });

  els.nextMonth.addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
    renderCalendar(state.calendarYear, state.calendarMonth);
  });
}

/**
 * Application initialization after DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  state.pageSize = parseInt(els.pageSize.value, 10) || 10;
  attachListeners();
  loadData();
});
