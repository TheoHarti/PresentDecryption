// Navigation
function showPage(event) {
  if (event) event.preventDefault();
  const target = event ? event.target.getAttribute('data-target') : 'start';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(target);
  if (el) el.classList.add('active');
}

// Terminal-Abenteuer
const terminalState = {
  location: 'lichtung',
  hasLamp: false,
  lampOn: false,
  chestOpen: false,
  codeFound: false
};
const terminalCode = '8241';
const terminalLog = document.getElementById('terminalLog');
const terminalInput = document.getElementById('terminalInput');
const terminalCodeHint = document.getElementById('terminalCodeHint');

function writeLog(text) {
  terminalLog.textContent += "\n" + text;
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function startTerminal() {
  terminalLog.textContent = 'Du stehst auf einer Lichtung. Hinter dir flackert ein schwaches Lagerfeuer, vor dir ist dichter Wald. Ein alter Pfad fuehrt nach vorne.';
  terminalInput.value = '';
  terminalInput.focus();
}

function handleTerminalCommand() {
  const raw = (terminalInput.value || '').trim().toUpperCase();
  if (!raw) return;
  terminalInput.value = '';
  if (raw === 'RESTART') {
    terminalState.location = 'lichtung';
    terminalState.hasLamp = false;
    terminalState.lampOn = false;
    terminalState.chestOpen = false;
    terminalState.codeFound = false;
    terminalCodeHint.textContent = '';
    startTerminal();
    return;
  }
  if (raw === 'HILFE') {
    writeLog('Befehle: UMSEHEN, GEHE VORWAERTS, GEHE ZURUECK, NIMM LAMPE, ZUENDE LAMPE AN, BETRETE HUETTE, OEFFNE KISTE, INVENTAR.');
    return;
  }
  processCommand(raw);
}

function processCommand(cmd) {
  const loc = terminalState.location;
  if (cmd.includes('UMSEHEN')) {
    describeLocation();
    return;
  }
  if (cmd.includes('INVENTAR')) {
    writeLog(terminalState.hasLamp ? 'Inventar: alte Laterne' : 'Inventar: leer');
    return;
  }
  if (cmd.includes('NIMM') && cmd.includes('LAMPE')) {
    if (loc === 'lichtung' && !terminalState.hasLamp) {
      terminalState.hasLamp = true;
      writeLog('Du hebst eine alte Laterne vom Boden auf.');
    } else if (terminalState.hasLamp) {
      writeLog('Die Laterne hast du schon.');
    } else {
      writeLog('Hier liegt keine Lampe.');
    }
    return;
  }
  if ((cmd.includes('ANZUND') || cmd.includes('ZUENDE') || cmd.includes('LAMPE AN'))) {
    if (!terminalState.hasLamp) {
      writeLog('Du hast keine Lampe.');
    } else if (terminalState.lampOn) {
      writeLog('Die Laterne brennt bereits.');
    } else {
      terminalState.lampOn = true;
      writeLog('Die Laterne leuchtet und vertreibt die Dunkelheit.');
    }
    return;
  }
  if (cmd.includes('GEHE') || cmd.includes('LAUF') || cmd.includes('WALK') || cmd.includes('VORWAERTS')) {
    move(cmd);
    return;
  }
  if (cmd.includes('BETRET') || cmd.includes('HUETTE')) {
    if (loc === 'huette-aussen') {
      terminalState.location = 'huette-innen';
      writeLog('Du oeffnest die knarrende Tuer und trittst ein. Drinnen ist es stockdunkel.');
    } else if (loc === 'huette-innen') {
      writeLog('Du bist schon in der Huette.');
    } else {
      writeLog('Hier gibt es keine Huette.');
    }
    return;
  }
  if (cmd.includes('OEFFNE') && cmd.includes('KISTE')) {
    if (terminalState.location !== 'huette-innen') {
      writeLog('Hier gibt es keine Kiste.');
      return;
    }
    if (!terminalState.lampOn) {
      writeLog('Es ist zu dunkel, du tastest nur kalte Luft.');
      return;
    }
    if (terminalState.chestOpen) {
      writeLog('Die Kiste ist schon offen.');
      return;
    }
    terminalState.chestOpen = true;
    terminalState.codeFound = true;
    terminalCodeHint.textContent = 'Code (Terminal): ' + terminalCode;
    writeLog('Du hebst den Deckel. Zwischen Stroh liegt ein Metallplakette: CODE ' + terminalCode + '.');
    return;
  }
  writeLog('Der Wald schweigt. (Unbekannter Befehl)');
}

function describeLocation() {
  const loc = terminalState.location;
  if (loc === 'lichtung') {
    writeLog('Lichtung: Ein Pfad fuehrt nach vorn in den Wald. Neben dem Feuer liegt etwas Metallisches (vielleicht eine Laterne).');
  } else if (loc === 'pfad') {
    writeLog('Pfad: Du hoerst einen Bach. Vorne siehst du den Umriss einer Huette. Zurueck liegt die Lichtung.');
  } else if (loc === 'huette-aussen') {
    writeLog('Vor der Huette: Das Dach ist schief, die Tuer steht nur angelehnt. Drueber haengt ein Rentiergeweih.');
  } else if (loc === 'huette-innen') {
    if (terminalState.lampOn) {
      writeLog('Innen: Staub, Spinnweben und eine schwere Holzkiste auf dem Tisch.');
    } else {
      writeLog('Innen: Pechschwarz. Ohne Licht tappst du im Dunkeln.');
    }
  }
}

function move(cmd) {
  if (terminalState.location === 'lichtung' && (cmd.includes('VOR') || cmd.includes('WEITER'))) {
    terminalState.location = 'pfad';
    writeLog('Du folgst dem Pfad in den Wald hinein.');
    return;
  }
  if (terminalState.location === 'pfad') {
    if (cmd.includes('ZURUECK')) {
      terminalState.location = 'lichtung';
      writeLog('Du gehst zur Lichtung zurueck.');
      return;
    }
    if (cmd.includes('VOR') || cmd.includes('WEITER')) {
      terminalState.location = 'huette-aussen';
      writeLog('Zwischen den Baeumen taucht eine Huette auf.');
      return;
    }
  }
  if (terminalState.location === 'huette-aussen') {
    if (cmd.includes('ZURUECK')) {
      terminalState.location = 'pfad';
      writeLog('Du gehst den Pfad ein Stueck zurueck.');
      return;
    }
  }
  if (terminalState.location === 'huette-innen') {
    if (cmd.includes('ZURUECK')) {
      terminalState.location = 'huette-aussen';
      writeLog('Du gehst wieder vor die Huette.');
      return;
    }
  }
  writeLog('Da geht es gerade nicht weiter.');
}

startTerminal();

// Passwort-Spiel
const rulesEl = document.getElementById('rules');
const passwordCode = '2195';
const passwordCodeEl = document.getElementById('passwordCode');
const ruleDefs = [
  { id: 'len', text: 'Mindestens 12 Zeichen', test: pwd => pwd.length >= 12 },
  { id: 'upper', text: 'Mindestens ein Grossbuchstabe', test: pwd => /[A-ZÄÖÜ]/.test(pwd) },
  { id: 'lower', text: 'Mindestens ein Kleinbuchstabe', test: pwd => /[a-zäöüß]/.test(pwd) },
  { id: 'digit', text: 'Mindestens eine Ziffer', test: pwd => /[0-9]/.test(pwd) },
  { id: 'special', text: 'Mindestens ein Sonderzeichen (! ? # + - * _)', test: pwd => /[!?#\+\-\*_]/.test(pwd) },
  { id: 'month', text: 'Enthaelt einen Monatsnamen (JANUAR...DEZEMBER)', test: pwd => /(JANUAR|FEBRUAR|MAERZ|APRIL|MAI|JUNI|JULI|AUGUST|SEPTEMBER|OKTOBER|NOVEMBER|DEZEMBER)/i.test(pwd) },
  { id: 'prime', text: 'Enthaelt eine zweistellige Primzahl (z.B. 11,13,17,19,23...)', test: pwd => /(11|13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97)/.test(pwd) },
  { id: 'hex', text: 'Enthaelt einen Hex-Farbcode (#RRGGBB)', test: pwd => /#[0-9A-Fa-f]{6}/.test(pwd) },
  { id: 'space', text: 'Keine Leerzeichen', test: pwd => !/\s/.test(pwd) },
  { id: 'question', text: 'Endet mit einem Fragezeichen ?', test: pwd => /\?$/.test(pwd) }
];

function renderRules() {
  rulesEl.innerHTML = '';
  ruleDefs.forEach(rule => {
    const li = document.createElement('li');
    li.id = 'rule-' + rule.id;
    li.innerHTML = '<span class="status">&#x25CB;</span> ' + rule.text;
    rulesEl.appendChild(li);
  });
}

function checkPassword() {
  const pwd = (document.getElementById('passwordInput').value || '').trim();
  let allOk = true;
  ruleDefs.forEach(rule => {
    const ok = rule.test(pwd);
    const li = document.getElementById('rule-' + rule.id);
    if (li) {
      li.className = ok ? 'ok' : 'fail';
      li.querySelector('.status').textContent = ok ? '✔' : '○';
    }
    if (!ok) allOk = false;
  });
  if (allOk) {
    passwordCodeEl.textContent = 'Code (Passwort-Spiel): ' + passwordCode;
  } else {
    passwordCodeEl.textContent = '';
  }
}

renderRules();

// Browser-Spielereien
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
updateBrowserCodeDisplay();

// Resize Aufgabe
function checkResize() {
  if (window.innerWidth < 800 && !foundBrowser.resize) {
    foundBrowser.resize = true;
    resizeDigitEl.textContent = 'Ziffer: ' + browserDigits.resize;
    updateBrowserCodeDisplay();
  }
}
window.addEventListener('resize', checkResize);
checkResize();

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
renderCaptcha();

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

// Decoder
function finalDecrypt() {
  const c1 = document.getElementById('code1').value.trim();
  const c2 = document.getElementById('code2').value.trim();
  const c3 = document.getElementById('code3').value.trim();
  const c4 = document.getElementById('code4').value.trim();
  const encrypted = document.getElementById('encryptedName').value.trim();
  if (!c1 || !c2 || !c3 || !c4 || !encrypted) {
    document.getElementById('decryptedResult').textContent = 'Bitte alle vier Codes und den verschluesselten Namen eingeben.';
    return;
  }
  const key = c1 + c2 + c3 + c4;
  const decrypted = decryptText(encrypted.toUpperCase(), key);
  document.getElementById('decryptedResult').textContent = 'Ergebnis: ' + decrypted;
}

function decryptText(cipher, key) {
  let totalShift = 0;
  for (let i = 0; i < key.length; i++) {
    totalShift += parseInt(key[i], 10) || 0;
  }
  totalShift = totalShift % 26;
  let result = '';
  for (let i = 0; i < cipher.length; i++) {
    const c = cipher.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      const shift = (totalShift + i) % 26;
      let newChar = c - shift;
      if (newChar < 65) newChar += 26;
      result += String.fromCharCode(newChar);
    } else {
      result += cipher[i];
    }
  }
  return result;
}
