// Browser-Spielereien - Raetsel 4
const browserDigits = {
  resize: '3',
  torch: '9',
  captcha: '4',
  knock: '7'
};

const foundBrowser = {
  resize: false,
  torch: false,
  captcha: false,
  knock: false
};

const resizeDigitEl = document.getElementById('resizeDigit');
const torchDigitEl = document.getElementById('torchDigit');
const captchaDigitEl = document.getElementById('captchaDigit');
const knockDigitEl = document.getElementById('knockDigit');
const browserCodeDisplay = document.getElementById('browserCodeDisplay');

function updateBrowserCodeDisplay() {
  const parts = ['resize', 'torch', 'captcha', 'knock'].map(key => foundBrowser[key] ? browserDigits[key] : '_');
  browserCodeDisplay.textContent = parts.join(' ');
}

// Resize Aufgabe
function checkResize() {
  if (window.innerWidth < 800 && !foundBrowser.resize) {
    foundBrowser.resize = true;
    resizeDigitEl.textContent = 'Ziffer: ' + browserDigits.resize;
    updateBrowserCodeDisplay();
  }
}

// Taschenlampe
const torchMask = document.getElementById('torchMask');
function updateTorch(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  torchMask.style.background = `radial-gradient(circle 70px at ${x}px ${y}px, transparent 0%, transparent 55%, rgba(0,0,0,0.94) 70%)`;
  if (!foundBrowser.torch) {
    foundBrowser.torch = true;
    torchDigitEl.textContent = 'Ziffer: ' + browserDigits.torch;
    updateBrowserCodeDisplay();
  }
}

function resetTorch() {
  torchMask.style.background = 'radial-gradient(circle 60px at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.94) 70%)';
}

// Familien-CAPTCHA
const captchaItems = [
  { label: 'Hund', emoji: '🐶' },
  { label: 'Tanne', emoji: '🌲' },
  { label: 'Hund', emoji: '🐕' },
  { label: 'Geschenk', emoji: '🎁' },
  { label: 'Hund', emoji: '🐩' },
  { label: 'Schlitten', emoji: '🛷' },
  { label: 'Rentier', emoji: '🦌' },
  { label: 'Hund', emoji: '🐕‍🦺' },
  { label: 'Keks', emoji: '🍪' }
];

const captchaGrid = document.getElementById('captchaGrid');
const selectedCaptcha = new Set();

function renderCaptcha() {
  captchaGrid.innerHTML = '';
  captchaItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'captcha-card';
    div.innerHTML = `<span class="emoji">${item.emoji}</span><strong>${item.label}</strong>`;
    div.onclick = () => toggleCaptcha(idx, div);
    captchaGrid.appendChild(div);
  });
}

function toggleCaptcha(idx, element) {
  if (selectedCaptcha.has(idx)) {
    selectedCaptcha.delete(idx);
    element.classList.remove('selected');
  } else {
    selectedCaptcha.add(idx);
    element.classList.add('selected');
  }
}

function checkCaptcha() {
  const correctIdx = captchaItems.map((item, i) => item.label === 'Hund' ? i : null).filter(i => i !== null);
  const selected = Array.from(selectedCaptcha).sort();
  const needed = correctIdx.sort();
  const ok = selected.length === needed.length && selected.every((v, i) => v === needed[i]);
  if (ok) {
    foundBrowser.captcha = true;
    captchaDigitEl.textContent = 'Ziffer: ' + browserDigits.captcha;
    updateBrowserCodeDisplay();
  } else {
    captchaDigitEl.textContent = 'Noch nicht richtig';
  }
}

// Klopf-Aufgabe
let knockCount = 0;
function registerKnock() {
  knockCount += 1;
  if (knockCount >= 3 && !foundBrowser.knock) {
    foundBrowser.knock = true;
    knockDigitEl.textContent = 'Ziffer: ' + browserDigits.knock;
    updateBrowserCodeDisplay();
  }
}

// Initialize browser riddles when script loads
updateBrowserCodeDisplay();
window.addEventListener('resize', checkResize);
checkResize();
renderCaptcha();
