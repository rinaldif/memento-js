import {
  EARTH_SPEED_KMH,
  LIGHT_YEAR_KM,
  OBSERVABLE_UNIVERSE_LY,
  ANT_CM,
  CELL_NUCLEUS_CM,
  EARTH_DIAMETER_CM,
  HOURS_PER_DAY,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  AVERAGE_LIFESPAN_YEARS,
} from './constants.js';

/**
 * Number of whole days between a date of birth and today.
 * @param {Date} dob
 * @returns {number}
 */
export function daysAlive(dob) {
  const today = new Date();
  // Zero out the time portion for accurate day calculation
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dobDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
  return Math.floor((todayDate - dobDate) / (1000 * 60 * 60 * 24));
}

/**
 * Compute cosmic distance values.
 * @param {number} days - number of days alive
 * @returns {{ totalHours: number, distanceKm: number, distanceLy: number, universeProportion: number }}
 */
export function cosmicDistance(days) {
  const totalHours = HOURS_PER_DAY * days;
  const distanceKm = totalHours * EARTH_SPEED_KMH;
  const distanceLy = distanceKm / LIGHT_YEAR_KM;
  const universeProportion = (distanceLy / OBSERVABLE_UNIVERSE_LY) * 100;
  return { totalHours, distanceKm, distanceLy, universeProportion };
}

/**
 * Ant size as a proportion of Earth's diameter (%).
 */
export function antProportion() {
  return (ANT_CM / EARTH_DIAMETER_CM) * 100;
}

/**
 * Cell nucleus size as a proportion of Earth's diameter (%).
 */
export function cellProportion() {
  return (CELL_NUCLEUS_CM / EARTH_DIAMETER_CM) * 100;
}

/**
 * Order of magnitude (floor of log10).
 * @param {number} n - positive number
 * @returns {number}
 */
export function magnitude(n) {
  if (n <= 0) throw new Error('magnitude requires a positive number');
  return Math.floor(Math.log10(n));
}

/**
 * Compute the date corresponding to a dayversary.
 * @param {Date} dob
 * @param {number} days
 * @returns {{ date: Date, ageYears: number, comparison: "past"|"future"|"today" }}
 */
export function dayversaryDate(dob, days) {
  const result = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
  result.setDate(result.getDate() + days);

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let comparison;
  if (result < todayDate) comparison = 'past';
  else if (result > todayDate) comparison = 'future';
  else comparison = 'today';

  return { date: result, ageYears: Math.round(days / DAYS_PER_YEAR), comparison };
}

/**
 * Build a 2D array of 0s and 1s for the Memento Mori heatmap.
 * 1 = lived, 0 = not yet lived.
 * Layout: 80 rows (years) x 52 columns (weeks) — vertical/portrait orientation.
 * @param {Date} dob
 * @returns {{ z: number[][], xLabels: number[], yLabels: number[], xLabel: string, yLabel: string, cellSize: number }}
 */
export function buildCalendarMatrix(dob) {
  const weeksMax = AVERAGE_LIFESPAN_YEARS * WEEKS_PER_YEAR; // 4160
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dobDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
  const weeksLived = (todayDate - dobDate) / (1000 * 60 * 60 * 24 * 7);

  const weeks = weeksLived <= weeksMax ? weeksLived : weeksMax;
  const weeksRem = weeksMax - Math.round(weeks);

  // Flat array: 1 for lived weeks, 0 for remaining
  const flat = [];
  for (let i = 0; i < Math.round(weeks); i++) flat.push(1);
  for (let i = 0; i < weeksRem; i++) flat.push(0);

  // 80 rows (years) x 52 columns (weeks)
  const rows = AVERAGE_LIFESPAN_YEARS;
  const cols = WEEKS_PER_YEAR;
  const z = [];
  for (let r = 0; r < rows; r++) {
    z.push(flat.slice(r * cols, (r + 1) * cols));
  }
  const xLabels = Array.from({ length: cols }, (_, i) => i + 1);
  const yLabels = Array.from({ length: rows }, (_, i) => i + 1);
  return { z, xLabels, yLabels, xLabel: 'Weeks in the year', yLabel: 'Years in your life' };
}
