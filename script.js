document.getElementById('year').textContent = new Date().getFullYear();

// ---- Render page content from content.js (SITE_CONTENT) ----
const PHOTO_ICON_SVG = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>`;

const ICON_GITHUB = `
  <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1.0.07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"/>
  </svg>`;

const ICON_EXTERNAL = `
  <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <path d="M15 3h6v6"/>
    <path d="M10 14 21 3"/>
  </svg>`;

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

// A media-placeholder that quietly upgrades to a real photo if the file exists,
// so dropping an image in with the right filename is all that's needed later.
function loadPhotoInto(el, src) {
  const img = new Image();
  img.onload = () => {
    el.classList.add('has-image');
    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.alt = '';
    el.appendChild(imgEl);
  };
  img.src = src;
}

function renderContent() {
  const c = SITE_CONTENT;

  // Hero
  document.getElementById('heroName').textContent = c.hero.name;
  document.getElementById('heroRole').textContent = c.hero.roleLine;
  document.getElementById('heroPitch').textContent = c.hero.pitch;
  document.getElementById('heroStatus').textContent = c.hero.status;
  document.getElementById('footerName').textContent = c.hero.name;
  document.title = `${c.hero.name} — ${c.hero.roleLine}`;

  // Banner CTA button labels
  document.getElementById('btnAboutLabel').textContent = c.bannerButtons.about;
  document.getElementById('btnProjectsLabel').textContent = c.bannerButtons.projects;
  document.getElementById('btnCertsLabel').textContent = c.bannerButtons.certs;
  document.getElementById('btnResumeLabel').textContent = c.bannerButtons.resume;

  // About
  const portraitEl = document.getElementById('aboutPortrait');
  portraitEl.innerHTML = `${PHOTO_ICON_SVG(28)}<span>Portrait — replace with ${portraitEl.dataset.src}</span>`;
  loadPhotoInto(portraitEl, portraitEl.dataset.src);

  const aboutEl = document.getElementById('aboutText');
  c.about.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    aboutEl.appendChild(p);
  });

  // Projects — projectOrder[0] is the featured slot; everything after is secondary.
  const isRealLink = url => !!url && url.trim() !== '' && url.trim() !== '#';
  // Unfilled template fields look like "[Project Two Name]" — treat those (and blanks) as no content.
  const isPlaceholderText = text => !text || !text.trim() || /^\[.*\]$/.test(text.trim());
  const hasRealContent = project => !isPlaceholderText(project.name) && !isPlaceholderText(project.description);
  const [featuredId, ...secondaryIds] = c.projectOrder;
  const featured = c.projectsById[featuredId];

  const featuredEl = document.getElementById('featuredProject');
  const dots = featured.photos.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" type="button" data-slide="${i}" aria-label="Show photo ${i + 1}"></button>`
  ).join('');
  const slidesHtml = featured.photos.map((photo, i) =>
    `<div class="media-placeholder featured-photo-main carousel-slide${i === 0 ? ' active' : ''}" data-src="${photo.src}">
      ${PHOTO_ICON_SVG(28)}
      <span>${photo.label}</span>
    </div>`
  ).join('');

  const featuredLinksHtml = [
    isRealLink(featured.liveUrl) ? `<a class="btn primary" href="${featured.liveUrl}" target="_blank" rel="noopener">View Site</a>` : '',
    isRealLink(featured.repoUrl) ? `<a class="btn ghost" href="${featured.repoUrl}" target="_blank" rel="noopener">View Repo</a>` : ''
  ].join('');

  const hasVideo = !!featured.video;
  const videoHtml = hasVideo ? `
      <div class="featured-media-right">
        <div class="video-placeholder">
          <video controls preload="none" poster="${featured.video.poster}">
            <source src="${featured.video.src}" type="video/mp4">
            Your browser doesn't support embedded video. <a href="${featured.video.src}">Download the demo instead</a>.
          </video>
        </div>
      </div>` : '';

  const carouselHtml = `
      <div class="featured-photo-carousel">
        <div class="carousel-track">
          ${slidesHtml}
          <button class="carousel-arrow carousel-prev" type="button" aria-label="Previous photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="carousel-arrow carousel-next" type="button" aria-label="Next photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="carousel-dots">${dots}</div>
        </div>
      </div>`;

  // With a video: title/links/desc centered above a photo+video row.
  // Without one: split layout, text on the left and the carousel on the right.
  featuredEl.innerHTML = hasVideo ? `
    <h2 class="featured-title">${featured.name}</h2>
    ${featuredLinksHtml ? `<div class="featured-links">${featuredLinksHtml}</div>` : ''}
    <p class="featured-desc">${featured.description}</p>
    <div class="featured-media">
      ${carouselHtml}${videoHtml}
    </div>` : `
    <div class="featured-split">
      <div class="featured-text">
        <h2 class="featured-title">${featured.name}</h2>
        ${featuredLinksHtml ? `<div class="featured-links">${featuredLinksHtml}</div>` : ''}
        <p class="featured-desc">${featured.description}</p>
      </div>
      ${carouselHtml}
    </div>`;

  featuredEl.querySelectorAll('.carousel-slide[data-src]').forEach(slide => {
    loadPhotoInto(slide, slide.dataset.src);
  });

  // Projects — secondary. Placeholder/blank entries are skipped so visitors
  // never land on a card promising content that isn't there yet (or was
  // pulled because it's outdated) — just remove/blank the fields in
  // content/projects.js and the card disappears on its own.
  const secondaryEl = document.getElementById('secondaryProjects');
  secondaryEl.innerHTML = secondaryIds.map(id => c.projectsById[id]).filter(hasRealContent).map(project => {
    const thumb = project.photos[0];
    const link = isRealLink(project.liveUrl) ? project.liveUrl : (isRealLink(project.repoUrl) ? project.repoUrl : '');
    return `
    <div class="secondary-project">
      <button class="secondary-project-toggle" type="button" aria-expanded="false">
        <span>${project.name}</span>
        ${ICON_CHEVRON}
      </button>
      <div class="secondary-project-body">
        <div class="secondary-project-split">
          <div class="secondary-project-text">
            <h3 class="secondary-project-title">${project.name}</h3>
            <p>${project.description}</p>
            ${link ? `<a href="${link}" target="_blank" rel="noopener">View Project →</a>` : ''}
          </div>
          <div class="media-placeholder small" data-src="${thumb.src}">
            ${PHOTO_ICON_SVG(22)}
            <span>Photo — replace with ${thumb.src}</span>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  secondaryEl.querySelectorAll('.media-placeholder[data-src]').forEach(el => {
    loadPhotoInto(el, el.dataset.src);
  });

  // Certs
  const isPlaceholder = (val) => typeof val === 'string' && /^\[.*\]$/.test(val.trim());

  const setSectionVisible = (listEl, visible) => {
    listEl.style.display = visible ? '' : 'none';
    const heading = listEl.previousElementSibling;
    if (heading && (heading.tagName === 'H2' || heading.tagName === 'H3')) {
      heading.style.display = visible ? '' : 'none';
    }
  };

  const renderCertList = (id, allCerts) => {
    const listEl = document.getElementById(id);
    const certs = allCerts.filter(cert => !isPlaceholder(cert.name));
    setSectionVisible(listEl, certs.length > 0);
    listEl.innerHTML = certs.map(cert => {
      if (cert.format === 'badge') {
        return `
      <div class="cert-row cert-row--badge">
        <div class="cert-row-top">
          <div class="cert-name">${cert.name}</div>
          <div class="cert-badge-media media-placeholder small" data-src="${cert.badgeSrc}"></div>
        </div>
        <div class="cert-meta">${cert.meta}</div>
      </div>`;
      }
      if (cert.format === 'inline') {
        return `
      <div class="cert-row cert-row--inline">
        <div class="cert-row-top">
          <div class="cert-name">${cert.name}</div>
          <span class="cert-status">${cert.status}</span>
        </div>
        <div class="cert-meta">${cert.meta}</div>
      </div>`;
      }
      return `
      <div class="cert-row">
        <div>
          <div class="cert-name">${cert.name}</div>
          <div class="cert-meta">${cert.meta}</div>
        </div>
        <span class="cert-status">${cert.status}</span>
      </div>`;
    }).join('');
    document.querySelectorAll(`#${id} .media-placeholder[data-src]`).forEach(el => {
      loadPhotoInto(el, el.dataset.src);
    });
  };
  renderCertList('certList', c.certs);
  renderCertList('shortCoursesList', c.shortCourses);
  renderCertList('educationList', c.education);

  const handsOnPracticeListEl = document.getElementById('handsOnPracticeList');
  const handsOnPractice = c.handsOnPractice.filter(platform => !isPlaceholder(platform.name));
  setSectionVisible(handsOnPracticeListEl, handsOnPractice.length > 0);
  handsOnPracticeListEl.innerHTML = handsOnPractice.map(platform => `
    <div class="cert-row cert-row--badge">
      <div class="cert-row-top">
        <div class="cert-name">${platform.name}</div>
        <div class="cert-badge-media media-placeholder small" data-src="${platform.badgeSrc}"></div>
      </div>
      <a class="cert-meta cert-meta-link" href="${platform.profileUrl}" target="_blank" rel="noopener">${platform.meta}</a>
    </div>`).join('');
  document.querySelectorAll('#handsOnPracticeList .media-placeholder[data-src]').forEach(el => {
    loadPhotoInto(el, el.dataset.src);
  });

  // Whichever heading ends up first (earlier ones may be hidden if empty) sits flush
  // against the section's top padding, so every tab opens with the same gap under the divider.
  const certsHeadings = document.querySelectorAll('#certs > h2, #certs > .cert-subheading');
  certsHeadings.forEach(h => { h.style.marginTop = ''; });
  const firstVisibleCertsHeading = Array.from(certsHeadings).find(h => h.style.display !== 'none');
  if (firstVisibleCertsHeading) firstVisibleCertsHeading.style.marginTop = '0';

  // Contact
  document.getElementById('contactIntro').textContent = c.contact.intro;
  const recipientSelect = document.getElementById('recipientSelect');
  recipientSelect.innerHTML = c.contact.recipients.map(email =>
    `<option value="${email}">${email}</option>`
  ).join('');
}

renderContent();

// ---- Theme toggle (light / dark) ----
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    themeToggle.setAttribute('title', 'Switch to dark theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
    themeToggle.setAttribute('title', 'Switch to light theme');
  }
});

// ---- Tab switching: buttons control which section is shown ----
const panel = document.getElementById('detailsPanel');
const tabSections = document.querySelectorAll('.tab-section');

function setActiveTab(id) {
  tabSections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === id);
  });
  if (id === 'game') {
    startGame();
  } else {
    pauseGame();
  }
  requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
});

// ---- Contact form: submit via Formspree ----
// TODO: replace with your real endpoint from https://formspree.io (Settings -> your form -> "Your Forms Endpoint")
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactFormStatus = document.getElementById('contactFormStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactFormStatus.textContent = '';
  contactFormStatus.className = 'form-status';
  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    });

    if (response.ok) {
      contactFormStatus.textContent = 'Message sent — thanks for reaching out!';
      contactFormStatus.classList.add('success');
      contactForm.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch {
    contactFormStatus.textContent = 'Something went wrong — please email me directly instead.';
    contactFormStatus.classList.add('error');
  } finally {
    contactSubmitBtn.disabled = false;
    contactSubmitBtn.textContent = 'Send Message';
  }
});

// ---- Secondary project accordion cards ----
document.querySelectorAll('.secondary-project-toggle').forEach(toggleBtn => {
  toggleBtn.addEventListener('click', () => {
    const card = toggleBtn.closest('.secondary-project');
    const isOpen = card.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// ---- Featured project photo carousel ----
document.querySelectorAll('.featured-photo-carousel').forEach(carousel => {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn.addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  const id = link.getAttribute('href').slice(1);
  const targetEl = document.getElementById(id);
  if (targetEl && targetEl.classList.contains('tab-section')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab(id);
    });
  }
});

// ---- Catch the Packets: a small canvas game ----
const canvas = document.getElementById('packetCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const PADDLE_W = 74;
const PADDLE_H = 12;
const PADDLE_Y = H - 26;

let paddleX = (W - PADDLE_W) / 2;
let items = [];
let score = 0;
let lives = 3;
let spawnTimer = 0;
let lastTime = 0;
let running = false;
let over = false;
let animId = null;

const scoreEl = document.getElementById('gameScore');
const livesEl = document.getElementById('gameLives');
const restartBtn = document.getElementById('gameRestart');

function resetGame() {
  items = [];
  score = 0;
  lives = 3;
  spawnTimer = 0;
  over = false;
  paddleX = (W - PADDLE_W) / 2;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function spawnItem() {
  const isBad = Math.random() < 0.22;
  items.push({
    x: Math.random() * (W - 18),
    y: -18,
    size: 18,
    speed: 90 + score * 2 + Math.random() * 40,
    bad: isBad
  });
}

function update(dt) {
  spawnTimer += dt;
  if (spawnTimer > 750) {
    spawnTimer = 0;
    spawnItem();
  }

  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.y += (it.speed * dt) / 1000;

    const caughtX = it.x + it.size > paddleX && it.x < paddleX + PADDLE_W;
    const caughtY = it.y + it.size >= PADDLE_Y && it.y < PADDLE_Y + PADDLE_H;

    if (caughtX && caughtY) {
      items.splice(i, 1);
      if (it.bad) {
        lives -= 1;
        livesEl.textContent = lives;
        if (lives <= 0) endGame();
      } else {
        score += 1;
        scoreEl.textContent = score;
      }
      continue;
    }

    if (it.y > H) items.splice(i, 1);
  }
}

function draw() {
  const styles = getComputedStyle(document.documentElement);
  const textColor = styles.getPropertyValue('--text').trim();
  const bgRgb = styles.getPropertyValue('--bg-rgb').trim();

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(76,122,100,0.08)';
  for (let x = 20; x < W; x += 40) {
    for (let y = 20; y < H; y += 40) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  items.forEach(it => {
    ctx.fillStyle = it.bad ? '#B4544A' : '#4C7A64';
    ctx.fillRect(it.x, it.y, it.size, it.size);
  });

  ctx.fillStyle = textColor;
  ctx.fillRect(paddleX, PADDLE_Y, PADDLE_W, PADDLE_H);

  if (over) {
    ctx.fillStyle = `rgba(${bgRgb},0.94)`;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = "600 22px 'IBM Plex Mono', monospace";
    ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
    ctx.font = "400 14px 'IBM Plex Mono', monospace";
    ctx.fillText('Final score: ' + score, W / 2, H / 2 + 16);
    ctx.fillText('Press Restart to play again', W / 2, H / 2 + 38);
  }
}

function loop(time) {
  if (!running) return;
  const dt = Math.min(time - lastTime, 40);
  lastTime = time;
  if (!over) update(dt);
  draw();
  animId = requestAnimationFrame(loop);
}

function startGame() {
  if (running) return;
  running = true;
  lastTime = performance.now();
  animId = requestAnimationFrame(loop);
}

function pauseGame() {
  running = false;
  if (animId) cancelAnimationFrame(animId);
}

function endGame() {
  over = true;
}

function movePaddleTo(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scale = W / rect.width;
  const x = (clientX - rect.left) * scale - PADDLE_W / 2;
  paddleX = Math.max(0, Math.min(W - PADDLE_W, x));
}

canvas.addEventListener('mousemove', (e) => movePaddleTo(e.clientX));
canvas.addEventListener('touchmove', (e) => {
  if (e.touches[0]) movePaddleTo(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', (e) => {
  const gameEl = document.getElementById('game');
  if (!gameEl.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') paddleX = Math.max(0, paddleX - 24);
  if (e.key === 'ArrowRight') paddleX = Math.min(W - PADDLE_W, paddleX + 24);
});

restartBtn.addEventListener('click', () => {
  resetGame();
  startGame();
});

resetGame();
draw();
if (document.getElementById('game').classList.contains('active')) {
  startGame();
}
