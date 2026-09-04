// Header shrink on scroll
const header = document.getElementById('site-header');
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateHeader);
updateHeader();

// Latam Scalability carousel
const carousel = document.getElementById('scalability-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dotsWrap = carousel.querySelector('.carousel-dots');
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.textContent = i + 1;
    dot.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function next() { goTo((current + 1) % slides.length); }

  function startAutoplay() {
    timer = setInterval(next, 3000);
  }
  function stopAutoplay() {
    clearInterval(timer);
  }

  goTo(0);
  startAutoplay();
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
}

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

// Connect page: forms send via mailto (no backend on this static site)
document.querySelectorAll('.contact-form-panel').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.dataset.mailSubject || 'WeBoost - Website message');
    const name = form.querySelector('[name="names"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    const bodyLines = [];
    if (name) bodyLines.push(`Name: ${name.value}`);
    if (email) bodyLines.push(`Email: ${email.value}`);
    bodyLines.push('', message ? message.value : '');
    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = `mailto:info@weboost.vc?subject=${subject}&body=${body}`;
  });
});
