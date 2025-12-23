// Passwort-Spiel - Rätsel 3
const rulesEl = document.getElementById('rules');
const passwordInputEl = document.getElementById('passwordInput');
const passwordCode = '6195';
const passwordCodeEl = document.getElementById('passwordCode');
const ruleCounterEl = document.getElementById('ruleCounter');

const ruleDefs = [
  { id: 'len', text: 'Mindestens 18 Zeichen.', test: pwd => pwd.length >= 18 },
  { id: 'upper', text: 'Mindestens drei Grossbuchstaben.', test: pwd => ((pwd.match(/[A-Z]/g) || []).length) >= 3 },
  { id: 'lower', text: 'Mindestens vier Kleinbuchstaben.', test: pwd => ((pwd.match(/[a-z]/g) || []).length) >= 4 },
  { id: 'digit', text: 'Mindestens eine Ziffer.', test: pwd => /[0-9]/.test(pwd) },
  { id: 'month', text: 'Enthaelt einen Monatsnamen (JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER).', test: pwd => /(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)/i.test(pwd) },
  { id: 'digitSum', text: 'Die Ziffern addieren sich zu genau 25.', test: pwd => {
    const digits = (pwd.match(/\d/g) || []).map(d => parseInt(d, 10));
    const sum = digits.reduce((acc, n) => acc + n, 0);
    return digits.length > 0 && sum === 25;
  } },
  { id: 'maxLength', text: 'Maximal 35 Zeichen.', test: pwd => pwd.length <= 35 },
  { id: 'noE', text: 'Enthaelt keinen Buchstaben E.', test: pwd => !/E/i.test(pwd) },
  { id: 'prime', text: 'Enthaelt eine zweistellige Primzahl (11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97).', test: pwd => /(11|13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97)/.test(pwd) },
  { id: 'exactDigits', text: 'Genau fuenf Ziffern insgesamt.', test: pwd => ((pwd.match(/\d/g) || []).length) === 5 },
  { id: 'hex', text: 'Enthaelt einen Hex-Farbcode (#RRGGBB).', test: pwd => /#[0-9A-Fa-f]{6}/.test(pwd) },
  { id: 'romanNum', text: 'Enthaelt eine roemische Zahl zwischen IV und IX (IV, V, VI, VII, VIII, IX).', test: pwd => /(IV|V|VI|VII|VIII|IX)/.test(pwd) },
  { id: 'sumLessThan', text: 'Die Gesamtlaenge ist kuerzer als 30 Zeichen.', test: pwd => pwd.length < 30 },
  { id: 'palindrome', text: 'Enthaelt ein Palindrom von mindestens 3 Zeichen (z.B. ABA, 121, XYX).', test: pwd => {
    for (let i = 0; i < pwd.length - 2; i++) {
      const triple = pwd.substring(i, i + 3);
      if (triple[0] === triple[2]) return true;
    }
    return false;
  } },
  { id: 'noRepeatingDigits', text: 'Keine Ziffer darf zweimal vorkommen.', test: pwd => {
    const digits = (pwd.match(/\d/g) || []);
    const uniqueDigits = new Set(digits);
    return digits.length === uniqueDigits.size;
  } },
  { id: 'hasHash', text: 'Enthaelt mindestens zwei # Zeichen.', test: pwd => ((pwd.match(/#/g) || []).length) >= 2 },
  { id: 'question', text: 'Endet mit einem Fragezeichen ?', test: pwd => /\?$/.test(pwd) }
];

let passwordRules = [];

function initPasswordGame() {
  passwordRules = ruleDefs.map((rule, idx) => ({
    ...rule,
    index: idx,
    shown: idx === 0,
    satisfied: false,
    everSatisfied: false
  }));
  renderRuleList();
  updatePasswordCode(false);
}

function evaluatePassword(pwd) {
  passwordRules.forEach(rule => {
    const ok = rule.test(pwd);
    rule.satisfied = ok;
    if (ok) rule.everSatisfied = true;
  });
}

function revealNextRuleIfReady() {
  let revealed = false;
  while (true) {
    const visible = passwordRules.filter(r => r.shown);
    const allVisibleSatisfied = visible.length > 0 && visible.every(r => r.satisfied);
    const nextRule = passwordRules.find(r => !r.shown);
    if (allVisibleSatisfied && nextRule) {
      nextRule.shown = true;
      revealed = true;
      continue;
    }
    break;
  }
  return revealed;
}

function renderRuleList() {
  const visible = passwordRules.filter(r => r.shown);
  const ordered = [...visible.filter(r => !r.satisfied), ...visible.filter(r => r.satisfied)];
  rulesEl.innerHTML = '';
  ordered.forEach(rule => {
    const li = document.createElement('li');
    li.className = 'rule ' + (rule.satisfied ? 'rule-ok' : 'rule-fail');
    li.innerHTML = `
      <div class="rule-status">${rule.satisfied ? '✔' : '✖'}</div>
      <div class="rule-copy">
        <div class="rule-title">Regel ${rule.index + 1}</div>
        <div class="rule-text">${rule.text}</div>
      </div>`;
    rulesEl.appendChild(li);
  });
  if (ruleCounterEl) {
    ruleCounterEl.textContent = `Regel ${visible.length} / ${ruleDefs.length}`;
  }
}

function updatePasswordCode(allOk) {
  if (allOk) {
    passwordCodeEl.textContent = 'Code (Passwort-Spiel): ' + passwordCode;
  } else {
    passwordCodeEl.textContent = '';
  }
}

function checkPassword() {
  const pwd = (passwordInputEl ? passwordInputEl.value : '') || '';
  evaluatePassword(pwd);
  revealNextRuleIfReady();
  renderRuleList();
  const allDone = passwordRules.every(r => r.shown && r.satisfied);
  updatePasswordCode(allDone);
}

// Initialize password game when script loads
initPasswordGame();
