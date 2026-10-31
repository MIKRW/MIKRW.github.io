document.getElementById('year').textContent = new Date().getFullYear();

// ---- Render page content from content.js (SITE_CONTENT) ----
const PHOTO_ICON_SVG = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>`;

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

const BADGE_ICON_SVG = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="9" r="6"/>
    <path d="M9.5 14.5 8 22l4-2 4 2-1.5-7.5"/>
  </svg>`;

// Unfilled template fields look like "[Project Two Name]" — treat those (and blanks) as no content.
const isPlaceholder = text => typeof text !== 'string' || !text.trim() || /^\[.*\]$/.test(text.trim());

// A media-placeholder that quietly upgrades to a real photo if the file exists,
// so dropping an image in with the right filename is all that's needed later.
function loadPhotoInto(el, src) {
  if (isPlaceholder(src)) return;
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
  const hasRealContent = project => !isPlaceholder(project.name) && !isPlaceholder(project.description);
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

  const carouselHtml = featured.photos.length === 0 ? '' : `
      <div class="featured-photo-carousel">
        <div class="carousel-track">
          ${slidesHtml}
          <button class="carousel-arrow carousel-prev" type="button" aria-label="Previous photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="carousel-arrow carousel-next" type="button" aria-label="Next photo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="carousel-dots">${dots}</div>
        </div>
      </div>`;

  // With an embed: title/desc/links centered above the live iframe.
  // With a video: title/links/desc centered above a photo+video row.
  // Without either: split layout, text on the left and the carousel on the right.
  featuredEl.innerHTML = featured.embed ? `
    <h2 class="featured-title">${featured.name}</h2>
    <p class="featured-desc">${featured.description}</p>
    ${featuredLinksHtml ? `<div class="featured-links">${featuredLinksHtml}</div>` : ''}
    <div class="game-wrap">
      <iframe id="gameFrame" src="${featured.embed.src.replace(/([?&]theme=)\w+/, `$1${currentTheme()}`)}" title="${featured.embed.title}" loading="lazy" scrolling="no"></iframe>
    </div>` : hasVideo ? `
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
          ${thumb ? `<div class="media-placeholder small" data-src="${thumb.src}">
            ${PHOTO_ICON_SVG(22)}
            <span>${thumb.label}</span>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  secondaryEl.querySelectorAll('.media-placeholder[data-src]').forEach(el => {
    loadPhotoInto(el, el.dataset.src);
  });

  // Certs
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
          <div>
            <div class="cert-name">${cert.name}</div>
            ${cert.profileUrl
              ? `<a class="cert-meta cert-meta-link" href="${cert.profileUrl}" target="_blank" rel="noopener">${cert.meta}</a>`
              : `<div class="cert-meta">${cert.meta}</div>`}
          </div>
          <div class="cert-badge-media media-placeholder small" data-src="${cert.badgeSrc}">${BADGE_ICON_SVG(22)}</div>
        </div>
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
    listEl.querySelectorAll('.media-placeholder[data-src]').forEach(el => {
      loadPhotoInto(el, el.dataset.src);
    });
  };
  renderCertList('certList', c.certs);
  renderCertList('shortCoursesList', c.shortCourses);
  renderCertList('educationList', c.education);
  renderCertList('handsOnPracticeList', c.handsOnPractice);

  // Whichever heading ends up first (earlier ones may be hidden if empty) sits flush
  // against the section's top padding, so every tab opens with the same gap under the divider.
  const certsHeadings = document.querySelectorAll('#certs > h2, #certs > .cert-subheading');
  const firstVisibleCertsHeading = Array.from(certsHeadings).find(h => h.style.display !== 'none');
  if (firstVisibleCertsHeading) firstVisibleCertsHeading.style.marginTop = '0';

  // Contact
  document.getElementById('contactIntro').textContent = c.contact.intro;
}

renderContent();

// ---- JSON-LD structured data (schema.org/Person), built from content/seo.js ----
function renderStructuredData() {
  const seo = SITE_CONTENT.seo;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": seo.person.name,
    "jobTitle": seo.person.jobTitle,
    "url": seo.siteUrl,
    "sameAs": seo.person.sameAs
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}
renderStructuredData();

// ---- Theme toggle (light / dark) ----
const themeToggle = document.getElementById('themeToggle');
const gameFrame = document.getElementById('gameFrame');

// Keeps the embedded game's background in sync with the site theme so the
// iframe never shows a stale (opposite-theme) background while it fades.
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
function syncGameTheme(theme) {
  if (gameFrame && gameFrame.contentWindow) {
    gameFrame.contentWindow.postMessage({ type: 'set-theme', theme }, 'https://mikrw.github.io');
  }
}
// The iframe is lazy-loaded, so it may still be blank when the toggle is
// clicked; re-sync once it actually finishes loading (its own ?theme= param
// only covers the theme active at page load, not one picked up mid-flight).
if (gameFrame) {
  gameFrame.addEventListener('load', () => syncGameTheme(currentTheme()));
}

// The game reports its real content height so the iframe can match it
// exactly (no leftover transparent margin for a theme-switch flash to
// show through, and no fixed aspect-ratio guess that breaks on mobile).
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://mikrw.github.io' || !gameFrame || event.source !== gameFrame.contentWindow) return;
  const data = event.data;
  if (data && data.type === 'content-resize' && typeof data.height === 'number') {
    gameFrame.style.aspectRatio = 'auto';
    // A few px of slack absorbs sub-pixel rounding and late font/image
    // reflows inside the iframe so the bottom of the game never clips
    // now that the frame has scrolling disabled.
    gameFrame.style.height = `${data.height + 4}px`;
  }
});

// Keeps the unlocked chameleon pet's camouflage palette in sync with the
// site theme (see sitePetPalette() in pet.js for the light-mode override).
function syncPetTheme() {
  if (window.__chameleonPetInstance && window.ChameleonThemes && window.sitePetPalette) {
    window.__chameleonPetInstance.setPalette(window.sitePetPalette());
  }
}

// The inline script in <head> already set data-theme before paint; this only
// brings the toggle's label in line with it and keeps the embeds in sync.
function syncToggleLabel(theme) {
  const next = theme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
  themeToggle.setAttribute('title', `Switch to ${next} theme`);
}
function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  syncToggleLabel(theme);
  syncGameTheme(theme);
  syncPetTheme();
}
syncToggleLabel(currentTheme());

themeToggle.addEventListener('click', () => {
  const theme = currentTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', theme); } catch (e) {}
  applyTheme(theme);
});

// Until the visitor picks a theme themselves, follow live system changes
// (e.g. an OS that switches to dark mode at sunset).
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (!saved) applyTheme(event.matches ? 'dark' : 'light');
});

// ---- Tab switching: buttons control which section is shown ----
const tabSections = document.querySelectorAll('.tab-section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setActiveTab(id) {
  tabSections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === id);
  });
  // Always scroll back to the very top so the hero (and the buttons) is fully visible,
  // regardless of how far down the previous tab's content was scrolled.
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
}

document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Tab links (e.g. the nav's #email) switch tabs instead of jumping to the hash.
    if (btn.tagName === 'A') e.preventDefault();
    setActiveTab(btn.dataset.tab);
  });
});

// ---- Contact form: submit via Formspree ----
// content/contact.js holds the Formspree form ID, so no real email address ever
// appears in the page source.
const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactFormStatus = document.getElementById('contactFormStatus');
const messageBody = document.getElementById('messageBody');
const messageCharCount = document.getElementById('messageCharCount');
const MESSAGE_MAX_LENGTH = 500;
// Plain-text messages only — reject anything that looks like a link so people can't
// slip malicious/spam URLs into an inbox via the contact form.
const LINK_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|dev|xyz|info|biz|ru|cn)\b)/i;
// Email addresses are stripped before the link check so "reach me at jane@company.com" is allowed.
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

messageBody.addEventListener('input', () => {
  const len = messageBody.value.length;
  messageCharCount.textContent = `${len} / ${MESSAGE_MAX_LENGTH}`;
  messageCharCount.classList.toggle('limit', len >= MESSAGE_MAX_LENGTH);
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactFormStatus.textContent = '';
  contactFormStatus.className = 'form-status';

  // The form is novalidate (to keep styling consistent), so run the built-in
  // required / type="email" checks here before anything is sent.
  if (!contactForm.reportValidity()) return;

  if (LINK_PATTERN.test(messageBody.value.replace(EMAIL_PATTERN, ''))) {
    contactFormStatus.textContent = 'Please remove links/URLs from your message — text only.';
    contactFormStatus.classList.add('error');
    return;
  }

  if (window.grecaptcha && grecaptcha.getResponse().length === 0) {
    contactFormStatus.textContent = 'Please complete the "I\'m not a robot" checkbox.';
    contactFormStatus.classList.add('error');
    return;
  }

  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Sending…';

  const formspreeEndpoint = `https://formspree.io/f/${SITE_CONTENT.contact.formId}`;

  try {
    const response = await fetch(formspreeEndpoint, {
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
    contactFormStatus.textContent = 'Something went wrong — try again later.';
    contactFormStatus.classList.add('error');
  } finally {
    contactSubmitBtn.disabled = false;
    contactSubmitBtn.textContent = 'Send Message';
    if (window.grecaptcha) grecaptcha.reset();
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
  if (slides.length === 0) return;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn.addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
});

