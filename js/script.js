// Header shrink on scroll
const header = document.getElementById('site-header');
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateHeader);
updateHeader();

// Connect page: contact tabs
const tabButtons = document.querySelectorAll('.contact-tabs button[data-panel]');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.contact-form-panel').forEach(p => p.classList.remove('is-active'));
    btn.classList.add('is-active');
    document.getElementById(btn.dataset.panel).classList.add('is-active');
  });
});

// Connect page: forms submit to Netlify Forms via AJAX
function encodeFormData(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

document.querySelectorAll('.contact-form-panel').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(form),
    })
      .then(() => {
        form.innerHTML = '<p style="color:#fff;">Thanks! Your message was sent.</p>';
      })
      .catch(() => {
        form.insertAdjacentHTML('beforeend', '<p style="color:#fdd;">Something went wrong. Please try again or email us directly.</p>');
      });
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
