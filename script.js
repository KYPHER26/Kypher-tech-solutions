// ---------- mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navlinks = document.getElementById('navlinks');

menuBtn.addEventListener('click', () => {
  const open = navlinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navlinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// ---------- hero console (application queue) ----------
const queue = [
  { task: 'RITA business name — Mwangaza Traders', ref: 'REF-RITA-2291', status: 'approved' },
  { task: 'HESLB loan — 2nd year application', ref: 'REF-HESLB-0847', status: 'approved' },
  { task: 'TIN registration — small retail shop', ref: 'REF-TIN-1163', status: 'processing' },
  { task: 'Website build — consulting client', ref: 'REF-DEV-0092', status: 'processing' },
];

const consoleBody = document.getElementById('consoleBody');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderQueue() {
  consoleBody.innerHTML = '';
  queue.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'console-line';
    row.style.animationDelay = reduceMotion ? '0s' : `${i * 0.15}s`;
    row.innerHTML = `
      <div>
        <div class="task">${item.task}</div>
        <div class="ref">${item.ref}</div>
      </div>
      <span class="status ${item.status}">${item.status === 'approved' ? 'APPROVED' : 'PROCESSING'}</span>
    `;
    consoleBody.appendChild(row);
  });
}
renderQueue();

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- contact form (Formspree) ----------
// Submits via fetch so the page doesn't reload. Requires a real Formspree
// form ID in index.html's form action (replace YOUR_FORM_ID at formspree.io).
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (form.action.includes('YOUR_FORM_ID')) {
    formNote.textContent = 'Form not connected yet — add your Formspree ID in index.html.';
    formNote.className = 'form-note mono error';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formNote.textContent = 'Sending…';
  formNote.className = 'form-note mono';

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      formNote.textContent = 'Sent — we\'ll get back to you within 24 hours.';
      formNote.className = 'form-note mono success';
      form.reset();
    } else {
      throw new Error('Non-OK response');
    }
  } catch (err) {
    formNote.textContent = 'Couldn\'t send. Email hello@kyphertech.co.tz directly.';
    formNote.className = 'form-note mono error';
  } finally {
    submitBtn.disabled = false;
  }
});
