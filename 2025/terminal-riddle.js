// Text-Abenteuer - Rätsel 1
const terminalState = {
  location: 'lichtung',
  hasLamp: false,
  lampOn: false,
  hasMatches: false,
  hasKey: false,
  chestOpen: false,
  codeFound: false,
  hasStick: false,
  matchesReachable: false,
  visited: new Set()
};

const terminalCode = '3357';
const terminalLog = document.getElementById('terminalLog');
const terminalInput = document.getElementById('terminalInput');
const terminalCodeHint = document.getElementById('terminalCodeHint');

// Normalize text: uppercase, replace umlauts, trim
function normalizeText(text) {
  return text
    .toUpperCase()
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ẞ/g, 'SS')
    .trim();
}

function writeLog(text, isCommand = false) {
  if (isCommand) {
    terminalLog.textContent += "\n\n> " + text;
  } else {
    terminalLog.textContent += "\n" + text;
  }
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function startTerminal() {
  terminalLog.textContent = 'Du stehst auf einer kleinen Lichtung im Wald. Hinter dir flackert ein schwaches Lagerfeuer, das kaum noch Waerme spendet. Dichter Nebel haengt zwischen den Baeumen. Ein schmaler Pfad fuehrt nach vorne in den dunklen Wald hinein.';
  terminalInput.value = '';
  terminalInput.focus();
  terminalState.visited.add('lichtung');
}

function handleTerminalCommand() {
  const raw = (terminalInput.value || '').trim();
  if (!raw) return;
  
  writeLog(raw, true);
  
  const normalized = normalizeText(raw);
  terminalInput.value = '';
  
  if (normalized === 'RESTART' || normalized === 'NEUSTART') {
    terminalState.location = 'lichtung';
    terminalState.hasLamp = false;
    terminalState.lampOn = false;
    terminalState.hasMatches = false;
    terminalState.hasKey = false;
    terminalState.chestOpen = false;
    terminalState.codeFound = false;
    terminalState.hasStick = false;
    terminalState.matchesReachable = false;
    terminalState.visited.clear();
    terminalCodeHint.textContent = '';
    startTerminal();
    return;
  }
  
  if (normalized === 'HILFE' || normalized === 'HELP' || normalized === '?') {
    writeLog('Befehle: UMSEHEN, GEHE [RICHTUNG], NIMM [GEGENSTAND], OEFFNE [GEGENSTAND], BENUTZE [GEGENSTAND], INVENTAR, BETRETE [ORT].\nRichtungen: VORWAERTS, ZURUECK, LINKS, RECHTS.\nTipp: Du kannst auch "zünde Laterne an" schreiben.');
    return;
  }
  
  processCommand(normalized);
}

function processCommand(cmd) {
  const loc = terminalState.location;
  
  if (cmd.includes('UMSEHEN') || cmd.includes('UMSCHAUEN') || cmd.includes('SCHAU') || cmd === 'U' || cmd === 'L' || cmd === 'LOOK') {
    describeLocation();
    return;
  }
  
  if (cmd.includes('INVENTAR') || cmd === 'I' || cmd === 'INV') {
    let items = [];
    if (terminalState.hasLamp) items.push('alte Laterne' + (terminalState.lampOn ? ' (brennt)' : ' (aus)'));
    if (terminalState.hasMatches) items.push('Streichhoelzer');
    if (terminalState.hasKey) items.push('rostiger Schluessel');
    if (terminalState.hasStick) items.push('langer Stock');
    writeLog(items.length > 0 ? 'Inventar: ' + items.join(', ') : 'Inventar: leer');
    return;
  }
  
  // BENUTZE muss VOR NIMM kommen, da manche Befehle "HOL" enthalten
  if (cmd.includes('BENUTZE') || cmd.includes('BENUTZ') || cmd.includes('USE') || cmd.includes('VERWEND')) {
    handleUse(cmd, loc);
    return;
  }
  
  if (cmd.includes('NIMM') || cmd.includes('NEHM') || cmd.includes('HOL') || cmd.includes('PACK')) {
    handleTake(cmd, loc);
    return;
  }
  
  // LAMPE ANZUENDEN
  if ((cmd.includes('ZUEND') || cmd.includes('ANZUEND') || cmd.includes('LAMPE AN') || cmd.includes('LICHT AN'))) {
    if (!terminalState.hasLamp) {
      writeLog('Du hast keine Lampe.');
    } else if (!terminalState.hasMatches) {
      writeLog('Du hast die Laterne, aber nichts, womit du sie anzuenden koenntest. Du brauchst Streichhoelzer.');
    } else if (terminalState.lampOn) {
      writeLog('Die Laterne brennt bereits.');
    } else {
      terminalState.lampOn = true;
      writeLog('Du nimmst ein Streichholz aus der Dose, entzündest es und haeltst es an den Docht. Ein warmes, goldenes Licht vertreibt die Dunkelheit.');
      if (loc === 'huette-innen') {
        describeLocation();
      }
    }
    return;
  }
  
  if (cmd.includes('GEH') || cmd.includes('LAUF') || cmd.includes('WALK') || cmd.includes('MOVE') || 
      cmd === 'N' || cmd === 'S' || cmd === 'O' || cmd === 'W' ||
      cmd.includes('VOR') || cmd.includes('ZURUECK') || cmd.includes('RAUS') || cmd.includes('LINKS') || cmd.includes('RECHTS')) {
    move(cmd);
    return;
  }
  
  if (cmd.includes('BETRET') || cmd.includes('GEHE IN') || cmd.includes('REIN') || cmd.includes('ENTER')) {
    handleEnter(cmd, loc);
    return;
  }
  
  if (cmd.includes('OEFFNE') || cmd.includes('OEFFN') || cmd.includes('AUFMACH') || cmd.includes('OPEN')) {
    handleOpen(cmd, loc);
    return;
  }
  
  if (cmd.includes('UNTERSUCH') || cmd.includes('BETRACHT') || cmd.includes('INSPECT') || cmd.includes('EXAMINE') || cmd === 'X') {
    handleExamine(cmd, loc);
    return;
  }
  
  writeLog('Das kannst du nicht machen. (Versuche HILFE)');
}

function handleTake(cmd, loc) {
  // Logik für Lampe
  if (cmd.includes('LAMP') || cmd.includes('LATERN')) {
    if (loc === 'lichtung' && !terminalState.hasLamp) {
      terminalState.hasLamp = true;
      writeLog('Du hebst die alte Laterne auf.');
    } else {
      writeLog('Hier ist keine Lampe.');
    }
    return;
  }
  
  // Logik für Stock
  if (cmd.includes('STOCK') || cmd.includes('STAB') || cmd.includes('STICK')) {
    if (loc === 'scheune' && !terminalState.hasStick) {
      terminalState.hasStick = true;
      writeLog('Du nimmst den langen Stock. Damit koenntest du vielleicht hoch gelegene Dinge erreichen.');
    } else if (terminalState.hasStick) {
      writeLog('Du hast den Stock schon.');
    } else {
      writeLog('Hier gibt es keinen Stock.');
    }
    return;
  }
  
  // Logik für Streichhölzer
  if (cmd.includes('STREICH') || cmd.includes('MATCH') || cmd.includes('DOSE') || cmd.includes('SCHACHTEL')) {
    if (loc === 'scheune' && !terminalState.matchesReachable && !terminalState.hasMatches) {
      writeLog('Die Streichhoelzer sind zu hoch oben im Regal. Du kannst sie nicht erreichen.');
    } else if (loc === 'scheune' && terminalState.matchesReachable && !terminalState.hasMatches) {
      terminalState.hasMatches = true;
      writeLog('Du nimmst die kleine Metalldose. Darin klappern ein paar Streichhoelzer.');
    } else if (terminalState.hasMatches) {
      writeLog('Du hast die Streichhoelzer schon.');
    } else {
      writeLog('Hier gibt es keine Streichhoelzer.');
    }
    return;
  }
  
  if (cmd.includes('SCHLUESSEL') || cmd.includes('KEY')) {
    if (loc === 'brunnen' && !terminalState.hasKey) {
      terminalState.hasKey = true;
      writeLog('Du nimmst den rostigen Schluessel aus dem Brunnen.');
    } else {
      writeLog('Hier ist kein Schluessel.');
    }
    return;
  }
  
  writeLog('Das kannst du nicht nehmen.');
}

function handleEnter(cmd, loc) {
  if (cmd.includes('HUETTE') || cmd.includes('HAUS')) {
    if (loc === 'huette-aussen') {
      terminalState.location = 'huette-innen';
      writeLog('Du betrittst die dunkle Huette.');
      describeLocation();
    } else {
      writeLog('Hier ist keine Huette.');
    }
    return;
  }
  writeLog('Das kannst du nicht betreten.');
}

function handleOpen(cmd, loc) {
  if (cmd.includes('KISTE') || cmd.includes('TRUHE') || cmd.includes('BOX')) {
    if (loc !== 'huette-innen') {
      writeLog('Hier ist keine Kiste.');
    } else if (!terminalState.lampOn) {
      writeLog('Es ist zu dunkel, um etwas zu oeffnen.');
    } else if (!terminalState.hasKey) {
      writeLog('Die Kiste ist verschlossen.');
    } else {
      terminalState.chestOpen = true;
      terminalState.codeFound = true;
      terminalCodeHint.textContent = 'Code: ' + terminalCode;
      writeLog('Du oeffnest die Kiste. Der Code lautet: ' + terminalCode);
    }
    return;
  }
  writeLog('Das kannst du nicht oeffnen.');
}

function handleExamine(cmd, loc) {
  if (cmd.includes('LAMP')) {
    writeLog(terminalState.hasLamp ? 'Eine alte Kerosinlampe.' : 'Du hast keine Lampe.');
  } else if (cmd.includes('DOSE') || cmd.includes('STREICH')) {
    writeLog(terminalState.hasMatches ? 'Eine kleine Dose mit ein paar Streichhoelzern.' : 'Du siehst keine Dose.');
  } else if (cmd.includes('STOCK')) {
    writeLog(terminalState.hasStick ? 'Ein langer, stabiler Stock.' : 'Du hast keinen Stock.');
  } else if (cmd.includes('REGAL')) {
    if (loc === 'scheune') {
      writeLog('Ein hohes Holzregal. Ganz oben siehst du eine Metalldose mit Streichhoelzern.');
    } else {
      writeLog('Hier ist kein Regal.');
    }
  } else {
    writeLog('Nichts Besonderes.');
  }
}

function handleUse(cmd, loc) {
  if (cmd.includes('STOCK') || cmd.includes('STAB')) {
    if (!terminalState.hasStick) {
      writeLog('Du hast keinen Stock.');
    } else if (loc === 'scheune' && !terminalState.matchesReachable) {
      terminalState.matchesReachable = true;
      writeLog('Du streckst den Stock nach oben und stoeberst damit im Regal herum. Die Metalldose rutscht nach vorne und faellt auf den Boden.');
    } else if (loc === 'scheune' && terminalState.matchesReachable) {
      writeLog('Du hast die Streichhoelzer bereits heruntergeholt.');
    } else {
      writeLog('Hier kannst du den Stock nicht benutzen.');
    }
  } else {
    writeLog('Das kannst du nicht benutzen.');
  }
}

function describeLocation() {
  const loc = terminalState.location;
  terminalState.visited.add(loc);
  
  if (loc === 'lichtung') {
    let desc = 'Du stehst auf der Lichtung beim Lagerfeuer.';
    if (!terminalState.hasLamp) desc += ' Am Boden liegt eine LATERNE.';
    desc += ' Ein Pfad fuehrt nach NORDEN. Im OSTEN siehst du eine alte Scheune.';
    writeLog(desc);
  } else if (loc === 'pfad') {
    writeLog('Ein Waldpfad. Im NORDEN siehst du eine Huette, im WESTEN ist ein Brunnen, im SUEDEN geht es zurück zur Lichtung.');
  } else if (loc === 'brunnen') {
    writeLog(terminalState.hasKey ? 'Ein alter Brunnen. Der Pfad ist im Osten.' : 'Ein alter Brunnen. Im Wasser schimmert ein SCHLUESSEL. Der Pfad ist im Osten.');
  } else if (loc === 'scheune') {
    let desc = 'Eine alte, verfallene Scheune.';
    if (!terminalState.hasStick) desc += ' In der Ecke lehnt ein langer STOCK.';
    if (!terminalState.hasMatches && !terminalState.matchesReachable) {
      desc += ' An der Wand haengt ein hohes REGAL. Ganz oben auf dem Regal siehst du eine Metalldose - vermutlich STREICHHOELZER.';
    } else if (!terminalState.hasMatches && terminalState.matchesReachable) {
      desc += ' Die Metalldose mit den STREICHHOELZERN liegt jetzt am Boden.';
    }
    desc += ' Die Lichtung ist im WESTEN.';
    writeLog(desc);
  } else if (loc === 'huette-aussen') {
    writeLog('Du stehst vor der HUETTE. Der Pfad ist im Sueden.');
  } else if (loc === 'huette-innen') {
    if (!terminalState.lampOn) {
      writeLog('Es ist stockfinster. Du siehst absolut nichts.');
    } else {
      writeLog('Das Lampenlicht zeigt eine staubige Huette mit einer KISTE auf dem Tisch.');
    }
  }
}

function move(cmd) {
  const loc = terminalState.location;
  let moved = false;
  
  if (loc === 'lichtung') {
    if (cmd.includes('VOR') || cmd.includes('NORD') || cmd === 'N') { terminalState.location = 'pfad'; moved = true; }
    else if (cmd.includes('RECHTS') || cmd.includes('OST') || cmd === 'O') { terminalState.location = 'scheune'; moved = true; }
  } else if (loc === 'scheune') {
    if (cmd.includes('LINKS') || cmd.includes('WEST') || cmd === 'W') { terminalState.location = 'lichtung'; moved = true; }
  } else if (loc === 'pfad') {
    if (cmd.includes('ZURUECK') || cmd.includes('SUED') || cmd === 'S') { terminalState.location = 'lichtung'; moved = true; }
    else if (cmd.includes('VOR') || cmd.includes('NORD') || cmd === 'N') { terminalState.location = 'huette-aussen'; moved = true; }
    else if (cmd.includes('LINKS') || cmd.includes('WEST') || cmd === 'W') { terminalState.location = 'brunnen'; moved = true; }
  } else if (loc === 'brunnen' && (cmd.includes('RECHTS') || cmd.includes('OST') || cmd === 'O')) {
    terminalState.location = 'pfad'; moved = true;
  } else if (loc === 'huette-aussen') {
    if (cmd.includes('ZURUECK') || cmd.includes('SUED') || cmd === 'S') { terminalState.location = 'pfad'; moved = true; }
  } else if (loc === 'huette-innen' && (cmd.includes('RAUS') || cmd.includes('AUSSEN') || cmd.includes('HINAUS') || cmd === 'S')) {
    terminalState.location = 'huette-aussen'; moved = true;
  }
  
  if (moved) {
    describeLocation();
  } else {
    writeLog('In diese Richtung kannst du nicht gehen.');
  }
}

startTerminal();