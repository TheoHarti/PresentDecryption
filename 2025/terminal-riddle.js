// Terminal-Abenteuer - Raetsel 1
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

// Initialize terminal when script loads
startTerminal();
