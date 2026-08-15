document.getElementById('year').textContent = new Date().getFullYear();

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
