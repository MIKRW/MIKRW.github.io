// ---- Chameleon pet unlock ----
// The chameleon pet (https://github.com/MIKRW/chameleon_pet, served live off
// its own GitHub Pages) is a reward for finishing the "Escape the Terrarium"
// game — its scripts are loaded from that page at runtime rather than vendored
// in here, so pushing to the pet repo updates it on the portfolio automatically.
//
// Solving the game produces a flag string. Entering it here only ever compares
// a SHA-256 hash of the guess against PET_FLAG_HASH below (same pattern the
// game itself uses in puzzles.js) — the plaintext flag never lives in source.
//
// To set PET_FLAG_HASH: open this site, open the console, and run
//   await sha256Hex('FLAG{...}')
// with the real flag, then paste the result in below.
const PET_FLAG_HASH = '';

const PET_BASE = 'https://mikrw.github.io/chameleon_pet/';
const PET_SCRIPTS = [
  'chameleon-themes.js',
  'chameleon-sprite.js',
  'chameleon-path.js',
  'chameleon-actions.js',
  'behaviours/standard-behaviour.js',
  'behaviours/user-interaction-behaviour.js',
  'behaviours/desktop-interaction-behaviour.js',
  'chameleon-behavior.js',
  'chameleon-pet.js',
];
const PET_UNLOCKED_KEY = 'chameleonPetUnlocked';

async function sha256Hex(text) {
  const normalized = text.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = reject;
    document.body.appendChild(el);
  });
}

async function loadChameleonPet() {
  const oneko = document.getElementById('oneko');
  if (oneko) oneko.remove();

  for (const path of PET_SCRIPTS) {
    await loadScript(PET_BASE + path);
  }

  const pet = window.ChameleonPet.init();
  window.__chameleonPetInstance = pet;
  if (window.ChameleonThemes) {
    pet.setPalette(window.ChameleonThemes.deriveFromSite());
  }
}

const petUnlockBtn = document.getElementById('petUnlockBtn');

async function tryUnlockPet(guess) {
  if (!PET_FLAG_HASH) {
    window.alert("Pet unlock isn't configured yet — PET_FLAG_HASH is empty in pet.js.");
    return;
  }
  const hash = await sha256Hex(guess);
  if (hash === PET_FLAG_HASH) {
    localStorage.setItem(PET_UNLOCKED_KEY, '1');
    petUnlockBtn.remove();
    await loadChameleonPet();
  } else {
    window.alert('Not quite — that flag doesn\'t match.');
  }
}

if (petUnlockBtn) {
  petUnlockBtn.addEventListener('click', () => {
    const guess = window.prompt('Enter the terrarium flag:');
    if (guess) tryUnlockPet(guess);
  });
}

if (localStorage.getItem(PET_UNLOCKED_KEY) === '1') {
  petUnlockBtn?.remove();
  loadChameleonPet();
}
