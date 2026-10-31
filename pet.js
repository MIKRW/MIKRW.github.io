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
const PET_FLAG_HASH = '1a95f2cda64476b51cdb6623f245ee02f48e77b9ba4287a8566c2b840bb93440';

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

// The pet's deriveFromSite() spins the crest and eye ring around the colour
// wheel from the site accent, which on the lavender light theme lands on
// orange and lime green. Light mode uses this hand-picked berry palette
// instead so the pet stays in the purple/pink/red family; dark mode keeps
// the derived one, which already suits the navy theme.
const LIGHT_PET_PALETTE = {
  body: '#7A2E62',
  bodyLight: '#B5578F',
  bodyDark: '#4A1A3C',
  outline: '#1E0A18',
  crest: '#C2364F',
  eye: '#0a0a0a',
  eyeRing: '#F2A7C3',
  tongue: '#E0457B',
};

function sitePetPalette() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    return window.ChameleonThemes.deriveFromSite();
  }
  return LIGHT_PET_PALETTE;
}
window.sitePetPalette = sitePetPalette;

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

const PET_HIDDEN_KEY = 'chameleonPetHidden';

let petScriptsLoaded = false;

function setOnekoVisible(visible) {
  const oneko = document.getElementById('oneko');
  if (oneko) oneko.style.display = visible ? '' : 'none';
}

async function showChameleonPet() {
  setOnekoVisible(false);

  if (!petScriptsLoaded) {
    try {
      for (const path of PET_SCRIPTS) {
        await loadScript(PET_BASE + path);
      }
      petScriptsLoaded = true;
    } catch (e) {
      // Pet repo unreachable — fall back to the cat rather than leaving no pet at all.
      setOnekoVisible(true);
      return;
    }
  }

  // The visitor may have hidden the pet again while its scripts were still loading.
  if (isPetHidden() || window.__chameleonPetInstance) return;

  const pet = window.ChameleonPet.init();
  window.__chameleonPetInstance = pet;
  if (window.ChameleonThemes) {
    pet.setPalette(sitePetPalette());
  }
}

function hideChameleonPet() {
  if (window.__chameleonPetInstance) {
    window.__chameleonPetInstance.destroy();
    // ChameleonPet.init() returns the cached instance, so clear it to allow a fresh one later.
    window.__chameleonPetInstance = null;
  }
  setOnekoVisible(true);
}

const petUnlockBtn = document.getElementById('petUnlockBtn');

// Storage can throw (private windows, blocked site data), so every access goes
// through these and fails quietly, like the theme code in index.html.
function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}
function storageRemove(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

function isPetUnlocked() {
  return storageGet(PET_UNLOCKED_KEY) === '1';
}

function isPetHidden() {
  return storageGet(PET_HIDDEN_KEY) === '1';
}

function updatePetButton() {
  if (!petUnlockBtn) return;
  if (!isPetUnlocked()) {
    petUnlockBtn.title = 'Got the terrarium flag?';
    petUnlockBtn.removeAttribute('aria-pressed');
    return;
  }
  const on = !isPetHidden();
  petUnlockBtn.title = on ? 'Hide the chameleon' : 'Show the chameleon';
  petUnlockBtn.setAttribute('aria-pressed', String(on));
  petUnlockBtn.classList.toggle('is-active', on);
}

async function tryUnlockPet(guess) {
  const hash = await sha256Hex(guess);
  if (hash === PET_FLAG_HASH) {
    storageSet(PET_UNLOCKED_KEY, '1');
    storageRemove(PET_HIDDEN_KEY);
    updatePetButton();
    await showChameleonPet();
  } else {
    window.alert('Not quite — that flag doesn\'t match.');
  }
}

function togglePet() {
  if (isPetHidden()) {
    storageRemove(PET_HIDDEN_KEY);
    showChameleonPet();
  } else {
    storageSet(PET_HIDDEN_KEY, '1');
    hideChameleonPet();
  }
  updatePetButton();
}

if (petUnlockBtn) {
  petUnlockBtn.addEventListener('click', () => {
    if (isPetUnlocked()) {
      togglePet();
      return;
    }
    const guess = window.prompt('Enter the terrarium flag:');
    if (guess) tryUnlockPet(guess);
  });
}

updatePetButton();
if (isPetUnlocked() && !isPetHidden()) {
  showChameleonPet();
}
