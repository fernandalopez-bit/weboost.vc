function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}

// Converts **bold** markers to <strong>, used in short editable text fields.
function mdBold(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

function initCarousel() {
  const carousel = document.getElementById('scalability-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dotsWrap = carousel.querySelector('.carousel-dots');
  if (!slides.length || !dotsWrap) return;
  dotsWrap.innerHTML = '';
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
  function startAutoplay() { timer = setInterval(next, 3000); }
  function stopAutoplay() { clearInterval(timer); }

  goTo(0);
  startAutoplay();
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
}

async function renderHome() {
  const heroEl = document.getElementById('hero-headline');
  if (!heroEl) return;
  const data = await loadJSON('data/home.json');

  heroEl.innerHTML = `${escapeHtml(data.hero_text)} <strong class="text-accent">${escapeHtml(data.hero_accent)}</strong>`;

  document.getElementById('problem-eyebrow').textContent = data.problem_eyebrow;
  document.getElementById('scalability-title').innerHTML =
    `${escapeHtml(data.scalability_title)} <span class="text-accent">${escapeHtml(data.scalability_accent)}</span>`;

  const track = document.getElementById('carousel-track');
  track.innerHTML = data.carousel.map((slide, i) => `
        <div class="carousel-slide${i === 0 ? ' is-active' : ''}">
          <img src="${escapeHtml(slide.image)}" alt="Latam Scalability" />
          <p>${mdBold(slide.text)}</p>
        </div>`).join('');
  initCarousel();

  document.getElementById('methodology-title').textContent = data.methodology_title;
  document.getElementById('methodology-center-image').src = data.methodology_center_image;

  const cardHtml = c => `
        <div class="methodology-card">
          <img src="${escapeHtml(c.icon)}" alt="${escapeHtml(c.title)}" />
          <h4>${escapeHtml(c.title)}</h4>
          <p>${escapeHtml(c.text)}</p>
        </div>`;
  document.getElementById('methodology-left').innerHTML = data.methodology_left.map(cardHtml).join('');
  document.getElementById('methodology-right').innerHTML = data.methodology_right.map(cardHtml).join('');

  document.getElementById('linkedin-eyebrow').textContent = data.linkedin_eyebrow;
  document.getElementById('linkedin-title').textContent = data.linkedin_title;
  const linkedinBtn = document.getElementById('linkedin-button');
  linkedinBtn.textContent = data.linkedin_button_text;
  linkedinBtn.href = data.linkedin_url;
}

async function renderInvestors() {
  const labelEl = document.getElementById('investors-label');
  if (!labelEl) return;
  const data = await loadJSON('data/investors.json');
  labelEl.textContent = data.label;
  const cta = document.getElementById('investors-cta');
  cta.textContent = data.cta_text;
  cta.href = data.cta_link;
}

async function renderConnect() {
  const grid = document.getElementById('contact-info-grid');
  if (!grid) return;
  const data = await loadJSON('data/connect.json');
  grid.innerHTML = `
      <a href="${escapeHtml(data.linkedin_url)}" target="_blank" rel="noopener">Linkedin</a>
      <a href="${escapeHtml(data.twitter_url)}" target="_blank" rel="noopener">Twitter</a>
      <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
      <a href="${escapeHtml(data.address_maps_url)}" target="_blank" rel="noopener">${escapeHtml(data.address)}</a>`;
  const heading = document.getElementById('connect-form-heading');
  if (heading) heading.textContent = data.form_heading;
}

async function renderPartners() {
  const mount = document.getElementById('partners-row');
  if (!mount) return;
  const data = await loadJSON('data/site.json');
  mount.innerHTML = data.strategic_partners.map(p =>
    `<img src="${escapeHtml(p.logo)}" alt="${escapeHtml(p.alt)}" />`).join('');
}

async function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const data = await loadJSON('data/site.json');
  const footerLogos = data.footer_partners.map(p =>
    `<img src="${escapeHtml(p.logo)}" alt="${escapeHtml(p.alt)}" />`).join('\n    ');

  mount.innerHTML = `
  <div class="container partners-row partners-row-footer">
    ${footerLogos}
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>${escapeHtml(data.footer_copyright)}</p>
      <div class="footer-social">
        <a href="${escapeHtml(data.linkedin_url)}" target="_blank" rel="noopener"><img src="assets/images/icon-footer-linkedin.svg" alt="LinkedIn" /></a>
        <a href="${escapeHtml(data.twitter_url)}" target="_blank" rel="noopener"><img src="assets/images/icon-footer-twitter.svg" alt="Twitter" /></a>
        <a href="mailto:${escapeHtml(data.footer_email)}"><img src="assets/images/icon-footer-email.svg" alt="Email" /></a>
      </div>
    </div>
  </div>`;
}

async function renderPortfolio() {
  const mount = document.getElementById('portfolio-list');
  if (!mount) return;
  const companies = (await loadJSON('data/portfolio.json')).companies;
  const defaultBg = 'linear-gradient(135deg, rgba(255,90,95,0.16), rgba(45,190,175,0.16))';

  mount.innerHTML = companies.map(c => {
    const bg = c.background ? `url('${c.background}')` : defaultBg;
    const websiteBtn = c.website
      ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noopener" class="btn btn-primary" style="padding:8px 20px; font-size:14px;">Go to website</a>`
      : '';
    const team = (c.team || []).map(m => `
          <div class="member"><img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" /><div><div class="member-name">${escapeHtml(m.name)}</div><div class="member-role">${escapeHtml(m.role)}</div></div></div>`).join('');

    return `
      <section class="portfolio-section" style="background-image:${bg};">
      <div class="container portfolio-card">
        <img class="logo" src="${escapeHtml(c.logo)}" alt="${escapeHtml(c.name)}" />
        <div class="portfolio-body">
          <h3 class="section-title" style="font-size:24px;">${escapeHtml(c.name)}</h3>
          <p>${escapeHtml(c.description)}</p>
          ${websiteBtn}
        <div class="team-mini">
          <p class="eyebrow" style="margin-bottom:0;">Team</p>${team}
        </div>
        </div>
      </div>
      </section>`;
  }).join('\n');
}

async function renderTeam() {
  const mount = document.getElementById('team-grid');
  if (!mount) return;
  const members = (await loadJSON('data/team.json')).members;
  mount.innerHTML = members.map(m => `
      <div class="team-card">
        <img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" />
        <div>
        <h4>${escapeHtml(m.name)}</h4>
        <p class="role">${escapeHtml(m.role)}</p>
        <p class="bio">${escapeHtml(m.bio)}</p>
        </div>
      </div>`).join('\n');
}

async function renderMedia() {
  const mount = document.getElementById('media-grid');
  if (!mount) return;
  const items = (await loadJSON('data/media.json')).items;
  mount.innerHTML = items.map(item => `
      <div class="media-card">
        <img src="${escapeHtml(item.image)}" alt="" />
        <h4>${escapeHtml(item.title)}</h4>
      </div>`).join('\n');
}

renderHome();
renderInvestors();
renderConnect();
renderPartners();
renderFooter();
renderPortfolio();
renderTeam();
renderMedia();
