import {
  daysAlive,
  cosmicDistance,
  antProportion,
  cellProportion,
  magnitude,
  dayversaryDate,
} from './calculations.js';

import {
  EARTH_SPEED_KMH,
  OBSERVABLE_UNIVERSE_LY,
  ANT_CM,
  CELL_NUCLEUS_CM,
  EARTH_DIAMETER_CM,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  AVERAGE_LIFESPAN_YEARS,
} from './constants.js';

import { renderMementoMori } from './chart.js';

// ---- Utility: format a number with commas ----
function fmt(n) {
  return n.toLocaleString('en-US');
}

// ---- Utility: format a Date as dd-Mon-YYYY ----
function fmtDate(d) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

// ---- Utility: get day-of-week name ----
function dayOfWeek(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

// ---- Utility: format date for dayversary display (YYYY-MM-DD) ----
function fmtDateISO(d) {
  return d.toLocaleDateString('en-GB');
}

// ---- Stored DOB for reuse across handlers ----
let currentDob = null;

// ---- DOM references ----
const form = document.getElementById('calcForm');
const results = document.getElementById('results');
const bottomNav = document.getElementById('bottomNav');
const tabBtns = bottomNav.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const daysInput = document.getElementById('daysInput');

// ---- DOB input: text↔date trick for placeholder support ----
const dobInput = document.getElementById('userDob');
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
dobInput.max = yesterday.toISOString().split('T')[0];

dobInput.addEventListener('focus', () => { dobInput.type = 'date'; });
dobInput.addEventListener('blur', () => {
  if (!dobInput.value) dobInput.type = 'text';
});

// ================================================
// Tab switching
// ================================================
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ================================================
// Form submit
// ================================================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('userName').value.trim();
  const dobValue = document.getElementById('userDob').value;
  if (!dobValue) return;

  // Parse date — input value is "YYYY-MM-DD"
  const parts = dobValue.split('-');
  currentDob = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

  results.classList.remove('hidden');
  bottomNav.classList.remove('disabled');

  renderSpaceJourney(name, currentDob);
  renderDayversary(currentDob);
  renderMementoTab(currentDob);

  results.scrollIntoView({ behavior: 'smooth' });
});

// ================================================
// Tab 1: A Space Journey
// ================================================
function renderSpaceJourney(name, dob) {
  const days = daysAlive(dob);
  const cosmic = cosmicDistance(days);
  const antPct = antProportion();
  const cellPct = cellProportion();
  const ordersDiff = Math.abs(magnitude(cosmic.universeProportion / 100) - magnitude(antPct / 100));

  // Greeting
  document.getElementById('greeting').innerHTML =
    `&#128075; Hello ${name || 'space traveller'}!`;

  // Birth info
  document.getElementById('birthInfo').innerHTML =
    `You were born on <strong><span class="big">${fmtDate(dob)}</span></strong>, it was a <strong>${dayOfWeek(dob)}</strong>, and you've been travelling on this amazing spaceship we call Earth for <strong><span class="big">${fmt(days)}</span></strong> days.`;

  // Speed in expander
  document.getElementById('speedKmh').textContent = fmt(EARTH_SPEED_KMH);

  // Distance
  document.getElementById('distanceInfo').innerHTML =
    `Now, since <code>1 day = 24 hours</code>, it follows that <code>${fmt(days)} days = ${fmt(cosmic.totalHours)} hours</code> and since we just learned that <strong>Earth travels at a speed of ${fmt(EARTH_SPEED_KMH)} km/h</strong> it means that so far in your lifetime you have traveled <strong><span class="big">${fmt(cosmic.distanceKm)}</span></strong> km.`;

  // Feeling down
  const billionKm = (cosmic.distanceKm / 1_000_000_000).toFixed(2);
  document.getElementById('feelingDown').innerHTML =
    `On those days when you wake up and feel like you haven't accomplished enough or if you just need a little nudge, remember that in your lifetime you've already explored over <strong><span class="big">${billionKm} billion kilometers</span></strong> of cosmic space!`;

  // Need grounding
  document.getElementById('needGrounding').innerHTML =
    `When, on the other hand, you feel on top of the world and need to come back down to earth, consider that those ${billionKm} billion kilometers are equivalent to just about <strong><span class="big">${cosmic.distanceLy.toFixed(5)} light-years</span></strong>.`;

  // Universe comparison
  document.getElementById('universeComparison').innerHTML =
    `It's hard to juggle such astronomical numbers in our head, so let's compare them to something we have more direct experience with. But first, consider this: the <a href="https://en.wikipedia.org/wiki/Observable_universe" target="_blank"><strong>observable universe</strong></a> currently has a diameter of about <strong><span class="big">${fmt(OBSERVABLE_UNIVERSE_LY)} light-years</span></strong>, so <strong>the portion you've explored so far</strong> is equivalent to <strong><span class="big">${cosmic.universeProportion.toFixed(15)}%</span></strong> of its diameter.`;

  // Ant comparison
  document.getElementById('antComparison').innerHTML =
    `Does this make you feel like a <strong>tiny ant</strong>? Well, you should know that the comparison doesn't actually hold up. In fact, a small ant like the <a href="https://en.wikipedia.org/wiki/Pharaoh_ant" target="_blank"><strong>Pharaoh ant</strong></a> is about ${ANT_CM}cm long, and if we compare it to Earth's diameter, which is about ${fmt(EARTH_DIAMETER_CM)}cm, then the insect is equivalent to about <strong><span class="big">${antPct.toFixed(15)}%</span></strong> of the Earth's diameter, so this comparison would overestimate the proportion by about <strong><span class="big">${ordersDiff} orders of magnitude</span></strong>!`;

  // Cell comparison
  document.getElementById('cellComparison').innerHTML =
    `To have a more accurate comparison, we need to borrow a microscope! The <strong>nucleus of an animal cell</strong> measures an average of ${CELL_NUCLEUS_CM}cm which, compared to the Earth's diameter, is about <strong><span class="big">${cellPct.toFixed(15)}%</span></strong>, which is much more aligned to our initial proportion.`;

  // Conclusion
  document.getElementById('conclusion').innerHTML =
    `So in conclusion, we can say that <strong><span class="big">the distance you've traveled in space so far</span></strong> compared to <strong><span class="big">the observable universe</span></strong> is equivalent to <strong><span class="big">the length of the nucleus of an animal cell</span></strong> compared to <strong><span class="big">the Earth's diameter</span></strong>!`;
}

// ================================================
// Tab 2: Dayversary
// ================================================
function renderDayversary(dob) {
  const days = Number(daysInput.value) || 0;
  const result = dayversaryDate(dob, days);

  const dayversaryEl = document.getElementById('dayversaryResult');
  const ageEl = document.getElementById('dayversaryAge');

  if (result.comparison === 'past') {
    dayversaryEl.textContent = `Your ${fmt(days)} dayversary was on ${fmtDateISO(result.date)}`;
    ageEl.textContent = `and you were about ${result.ageYears} years old`;
  } else if (result.comparison === 'future') {
    dayversaryEl.textContent = `Your ${fmt(days)} dayversary will be on ${fmtDateISO(result.date)}`;
    ageEl.textContent = `and you will be about ${result.ageYears} years old`;
  } else {
    dayversaryEl.textContent = `Hooray! Your dayversary is today!!`;
    ageEl.textContent = '';
  }
}

// ---- Live dayversary update ----
daysInput.addEventListener('input', () => {
  if (currentDob) renderDayversary(currentDob);
});

// ================================================
// Tab 3: Memento Mori
// ================================================
function renderMementoTab(dob) {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dobDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
  const userAgeYears = (todayDate - dobDate) / (1000 * 60 * 60 * 24) / DAYS_PER_YEAR;
  const yearsLeft = userAgeYears <= AVERAGE_LIFESPAN_YEARS ? AVERAGE_LIFESPAN_YEARS - userAgeYears : 0;
  const totalWeeks = AVERAGE_LIFESPAN_YEARS * WEEKS_PER_YEAR;
  const totalDays = totalWeeks * 7;

  // Lifespan info
  const lifespanEl = document.getElementById('lifespanInfo');
  if (userAgeYears < AVERAGE_LIFESPAN_YEARS) {
    lifespanEl.innerHTML =
      `Nowadays, the average human lifespan is <strong>${AVERAGE_LIFESPAN_YEARS} years</strong>, that is ${fmt(totalWeeks)} weeks or ${fmt(totalDays)} days. If you were lucky enough to live that long, you would have <strong><span class="big">${Math.round(yearsLeft)} years left to live</span></strong>, then think again to Marcus Aurelius words: <strong>how will you spend them?</strong>`;
  } else {
    lifespanEl.innerHTML =
      `Nowadays, the average human lifespan is <strong>${AVERAGE_LIFESPAN_YEARS} years</strong>, that is ${fmt(totalWeeks)} weeks or ${fmt(totalDays)} days and you were lucky enough to live that long!`;
  }

  // Calendar explanation
  document.getElementById('calendarExplanation').innerHTML =
    `<strong>Each square in this calendar represents a week of your life</strong> and each row contains 52 weeks, that is 1 year of your life:
    <br>- by looking at the <strong style="color:#888;">dark-grey squares</strong>, you will see how much life you've already lived
    (or as <a href="https://www.goodreads.com/quotes/447621-what-man-can-you-show-me-who-places-any-value" target="_blank">Seneca said</a>, how much you've already died),
    <br>- whereas the <em style="color:#aaa;">light-grey squares</em> will show you how much life you've (hopefully) got left.`;

  // Render chart
  renderMementoMori(dob, 'mementoChart');
}

// ================================================
// PWA Service Worker registration
// ================================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {
    // Service worker registration failed — likely not served over HTTPS or localhost
  });
}
