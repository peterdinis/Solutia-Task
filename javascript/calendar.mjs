import { els, state } from "./state.mjs";
import { toDateStr, today } from "./date-utils.mjs";
import { showFormAlert } from "./alert.mjs";

/**
 * Renders calendar for specified year and month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 */
export function renderCalendar(year, month) {
    els.calendar.innerHTML = '';
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const firstWeekDay = (firstOfMonth.getDay() + 6) % 7; // Monday start
    const daysInMonth = lastOfMonth.getDate();

    const monthName = firstOfMonth.toLocaleString('en-US', { month: 'long' });
    els.monthLabel.textContent = `${monthName} ${year}`;

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const headerRow = document.createElement('div');
    headerRow.className = 'row row-cols-7 g-1 mb-1';
    weekdays.forEach(w => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `<div class="small-muted text-center">${w}</div>`;
        headerRow.appendChild(col);
    });
    els.calendar.appendChild(headerRow);

    const totalCells = firstWeekDay + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    let dayCounter = 1;

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'row row-cols-7 g-1';
        for (let c = 0; c < 7; c++) {
            const cellIndex = r * 7 + c;
            const col = document.createElement('div');
            col.className = 'col';
            const cell = document.createElement('div');
            cell.className = 'day';

            if (cellIndex < firstWeekDay || dayCounter > daysInMonth) {
                cell.classList.add('muted');
                cell.innerHTML = '&nbsp;';
            } else {
                const d = new Date(year, month, dayCounter);
                const dStr = toDateStr(d);
                const reservationsOnDate = state.reservations.filter(rr => rr.date === dStr);
                const reservationCount = reservationsOnDate.length;

                cell.innerHTML = `<div class="number">${dayCounter}</div>
                                  <div class="small-muted">${reservationCount} reservation(s)</div>`;

                if (d.setHours(0, 0, 0, 0) === today.getTime()) {
                    cell.classList.add('today');
                }
                
                if (reservationCount === 0) {
                    cell.classList.add('available');
                } else {
                    cell.classList.add('unavailable');
                }

                cell.addEventListener('click', () => {
                    if (reservationCount > 0) {
                        showFormAlert('This day is not available for new reservations.', 'warning');
                        return;
                    }
                    els.dateInput.value = dStr;
                    document.querySelector('#form-section').scrollIntoView({ behavior: 'smooth' });
                    showFormAlert('Date has been pre-filled from the calendar.', 'info');
                });

                dayCounter++;
            }

            col.appendChild(cell);
            row.appendChild(col);
        }
        els.calendar.appendChild(row);
    }
}
