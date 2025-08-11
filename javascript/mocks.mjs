import { toDateStr, addDays } from "./date-utils.mjs";

/**
 * Counter for generating IDs
 * @type {number}
 */
export let idCounter = 100;

/**
 * Generates the next unique ID string prefixed with 'R'.
 * Increments an internal counter each time it is called.
 *
 * @function
 * @returns {string} The generated unique ID (e.g., "R1", "R2", "R3").
 */
export function getNextId() {
  return 'R' + (++idCounter);
}

/**
 * Sample items for reservation
 * @type {Array<{id: string, name: string, type: string}>}
 */
export const mockItems = [
    { id: 'IT001', name: 'Laptop Dell XPS 13', type: 'Laptop' },
    { id: 'IT002', name: 'Canon EOS R', type: 'Camera' },
    { id: 'IT003', name: 'Projector Epson', type: 'Projector' },
    { id: 'IT004', name: 'MacBook Pro', type: 'Laptop' },
    { id: 'IT005', name: 'GoPro HERO9', type: 'Camera' }
];

/**
 * Sample reservations with dates relative to today
 * @type {Array<{id: string, date: string, itemId: string, itemName: string, type: string, employeeId: string, status: string, returnDate: string}>}
 */
export let mockReservations = [
    { id: 'R' + (++idCounter), date: toDateStr(addDays(-5)), itemId: 'IT001', itemName: 'Laptop Dell XPS 13', type: 'Laptop', employeeId: 'E001', status: 'Overdue', returnDate: toDateStr(addDays(-2)) },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(-1)), itemId: 'IT002', itemName: 'Canon EOS R', type: 'Camera', employeeId: 'E002', status: 'Returned', returnDate: toDateStr(addDays(0)) },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(0)), itemId: 'IT003', itemName: 'Projector Epson', type: 'Projector', employeeId: 'E003', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(1)), itemId: 'IT001', itemName: 'Laptop Dell XPS 13', type: 'Laptop', employeeId: 'E004', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(2)), itemId: 'IT004', itemName: 'MacBook Pro', type: 'Laptop', employeeId: 'E005', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(2)), itemId: 'IT002', itemName: 'Canon EOS R', type: 'Camera', employeeId: 'E006', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(3)), itemId: 'IT005', itemName: 'GoPro HERO9', type: 'Camera', employeeId: 'E007', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(5)), itemId: 'IT001', itemName: 'Laptop Dell XPS 13', type: 'Laptop', employeeId: 'E008', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(10)), itemId: 'IT003', itemName: 'Projector Epson', type: 'Projector', employeeId: 'E009', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(-2)), itemId: 'IT005', itemName: 'GoPro HERO9', type: 'Camera', employeeId: 'E010', status: 'Returned', returnDate: toDateStr(addDays(-1)) },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(7)), itemId: 'IT002', itemName: 'Canon EOS R', type: 'Camera', employeeId: 'E011', status: 'Pending', returnDate: '' },
    { id: 'R' + (++idCounter), date: toDateStr(addDays(7)), itemId: 'IT002', itemName: 'Canon EOS R', type: 'Camera', employeeId: 'E012', status: 'Pending', returnDate: '' }
];

/**
 * Simulates fetch API for mock data
 * @param {string} url - URL endpoint
 * @param {Object} [options] - Fetch options
 * @returns {Promise<any>} Promise with mock data
 */
export function mockFetch(url, options) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (url === '/api/items') resolve(JSON.parse(JSON.stringify(mockItems)));
            else if (url === '/api/reservations') resolve(JSON.parse(JSON.stringify(mockReservations)));
            else if (url === '/api/notify') resolve({ ok: true, message: 'Simulated email sent.' });
            else resolve({ ok: false, message: 'Unknown endpoint' });
        }, 250 + Math.random() * 300);
    });
}