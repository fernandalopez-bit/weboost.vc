function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
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

renderPortfolio();
renderTeam();
renderMedia();
