// Text-Abenteuer - Raetsel 1
const terminalState = {
  location: 'lichtung',
  hasLamp: false,
  lampOn: false,
  hasKey: false,
  chestOpen: false,
  codeFound: false,
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
  
  // Echo command in terminal
  writeLog(raw, true);
  
  const normalized = normalizeText(raw);
  terminalInput.value = '';
  
  if (normalized === 'RESTART' || normalized === 'NEUSTART') {
    terminalState.location = 'lichtung';
    terminalState.hasLamp = false;
    terminalState.lampOn = false;
    terminalState.hasKey = false;
    terminalState.chestOpen = false;
    terminalState.codeFound = false;
    terminalState.visited.clear();
    terminalCodeHint.textContent = '';
    startTerminal();
    return;
  }
  
  if (normalized === 'HILFE' || normalized === 'HELP' || normalized === '?') {
    writeLog('Befehle: UMSEHEN, GEHE [RICHTUNG], NIMM [GEGENSTAND], OEFFNE [GEGENSTAND], BENUTZE [GEGENSTAND], INVENTAR, BETRETE [ORT].\nRichtungen: VORWAERTS/VOR, ZURUECK, LINKS, RECHTS, NORDEN/N, SUEDEN/S, OSTEN/O, WESTEN/W.\nTipp: Du kannst auch ganze Saetze schreiben, z.B. "gehe nach vorne" oder "nimm die Lampe".');
    return;
  }
  
  processCommand(normalized);
}

function processCommand(cmd) {
  const loc = terminalState.location;
  
  // UMSEHEN
  if (cmd.includes('UMSEHEN') || cmd.includes('UMSCHAUEN') || cmd.includes('SCHAU') || cmd === 'U' || cmd === 'L' || cmd === 'LOOK') {
    describeLocation();
    return;
  }
  
  // INVENTAR
  if (cmd.includes('INVENTAR') || cmd === 'I' || cmd === 'INV') {
    let items = [];
    if (terminalState.hasLamp) items.push('alte Laterne' + (terminalState.lampOn ? ' (brennt)' : ' (aus)'));
    if (terminalState.hasKey) items.push('rostiger Schluessel');
    writeLog(items.length > 0 ? 'Inventar: ' + items.join(', ') : 'Inventar: leer');
    return;
  }
  
  // NIMM
  if (cmd.includes('NIMM') || cmd.includes('NEHM') || cmd.includes('HOL') || cmd.includes('PACK')) {
    handleTake(cmd, loc);
    return;
  }
  
  // LAMPE ANZUENDEN
  if ((cmd.includes('ZUEND') || cmd.includes('ANZUEND') || cmd.includes('LAMPE AN') || cmd.includes('LICHT AN'))) {
    if (!terminalState.hasLamp) {
      writeLog('Du hast keine Lampe.');
    } else if (terminalState.lampOn) {
      writeLog('Die Laterne brennt bereits.');
    } else {
      terminalState.lampOn = true;
      writeLog('Du zuendest die Laterne an. Ein warmes, goldenes Licht vertreibt die Dunkelheit um dich herum.');
      if (loc === 'huette-innen') {
        describeLocation();
      }
    }
    return;
  }
  
  // BEWEGEN
  if (cmd.includes('GEH') || cmd.includes('LAUF') || cmd.includes('WALK') || cmd.includes('MOVE') || 
      cmd === 'N' || cmd === 'S' || cmd === 'O' || cmd === 'W' ||
      cmd.includes('VOR') || cmd.includes('ZURUECK') || cmd.includes('LINKS') || cmd.includes('RECHTS') ||
      cmd.includes('NORD') || cmd.includes('SUED') || cmd.includes('OST') || cmd.includes('WEST')) {
    move(cmd);
    return;
  }
  
  // BETRETE
  if (cmd.includes('BETRET') || cmd.includes('GEHE IN') || cmd.includes('REIN') || cmd.includes('ENTER')) {
    handleEnter(cmd, loc);
    return;
  }
  
  // OEFFNE
  if (cmd.includes('OEFFNE') || cmd.includes('OEFFN') || cmd.includes('AUFMACH') || cmd.includes('OPEN')) {
    handleOpen(cmd, loc);
    return;
  }
  
  // UNTERSUCHE
  if (cmd.includes('UNTERSUCH') || cmd.includes('BETRACHT') || cmd.includes('INSPECT') || cmd.includes('EXAMINE') || cmd === 'X') {
    handleExamine(cmd, loc);
    return;
  }
  
  writeLog('Das verstehst du nicht. (Versuche HILFE fuer eine Liste der Befehle)');
}

function handleTake(cmd, loc) {
  if (cmd.includes('LAMP') || cmd.includes('LATERN')) {
    if (loc === 'lichtung' && !terminalState.hasLamp) {
      terminalState.hasLamp = true;
      writeLog('Du hebst die alte Laterne auf. Sie ist schwer und riecht nach Kerosin.');
    } else if (terminalState.hasLamp) {
      writeLog('Die Laterne hast du bereits.');
    } else {
      writeLog('Hier gibt es keine Lampe.');
    }
    return;
  }
  
  if (cmd.includes('SCHLUESSEL') || cmd.includes('KEY')) {
    if (loc === 'brunnen' && !terminalState.hasKey) {
      terminalState.hasKey = true;
      writeLog('Du greifst vorsichtig in den Brunnen und ziehst einen rostigen, aber stabilen Schluessel heraus. Er tropft noch.');
    } else if (terminalState.hasKey) {
      writeLog('Den Schluessel hast du bereits.');
    } else {
      writeLog('Hier gibt es keinen Schluessel.');
    }
    return;
  }
  
  writeLog('Das kannst du nicht nehmen.');
}

function handleEnter(cmd, loc) {
  if (cmd.includes('HUETTE') || cmd.includes('HAUS') || cmd.includes('GEBAEUDE')) {
    if (loc === 'huette-aussen') {
      terminalState.location = 'huette-innen';
      writeLog('Du drueckst die knarrende Holztuer auf und trittst ein.');
      describeLocation();
    } else if (loc === 'huette-innen') {
      writeLog('Du bist bereits in der Huette.');
    } else {
      writeLog('Hier gibt es keine Huette.');
    }
    return;
  }
  writeLog('Das kannst du nicht betreten.');
}

function handleOpen(cmd, loc) {
  if (cmd.includes('KISTE') || cmd.includes('TRUHE') || cmd.includes('BOX')) {
    if (loc !== 'huette-innen') {
      writeLog('Hier gibt es keine Kiste.');
      return;
    }
    if (!terminalState.lampOn) {
      writeLog('Es ist zu dunkel. Du kannst nichts sehen.');
      return;
    }
    if (!terminalState.hasKey) {
      writeLog('Die Kiste ist verschlossen. Sie hat ein altes Schloss, das einen Schluessel braucht.');
      return;
    }
    if (terminalState.chestOpen) {
      writeLog('Die Kiste ist bereits geoeffnet. Der Code liegt darin: ' + terminalCode);
      return;
    }
    terminalState.chestOpen = true;
    terminalState.codeFound = true;
    terminalCodeHint.textContent = 'Code (Text-Abenteuer): ' + terminalCode;
    writeLog('Du steckst den rostigen Schluessel ins Schloss. Mit einem lauten KLACK springt es auf! Du hebst den schweren Holzdeckel. Zwischen altem Stroh liegt eine Metallplakette mit eingravierter Schrift: CODE ' + terminalCode + '.');
    return;
  }
  writeLog('Das kannst du nicht oeffnen.');
}

function handleExamine(cmd, loc) {
  if (cmd.includes('LAMP') || cmd.includes('LATERN')) {
    if (terminalState.hasLamp) {
      writeLog('Eine alte Laterne aus Metall und Glas. ' + (terminalState.lampOn ? 'Sie brennt hell.' : 'Sie ist ausgeschaltet, aber du koenntesst sie anzuenden.'));
    } else {
      writeLog('Du hast keine Laterne.');
    }
    return;
  }
  if (cmd.includes('SCHLUESSEL')) {
    if (terminalState.hasKey) {
      writeLog('Ein alter, rostiger Eisenschluessel. Er sieht aus, als waere er schon lange nicht mehr benutzt worden.');
    } else {
      writeLog('Du hast keinen Schluessel.');
    }
    return;
  }
  writeLog('Du siehst nichts Besonderes.');
}

function describeLocation() {
  const loc = terminalState.location;
  const firstVisit = !terminalState.visited.has(loc);
  terminalState.visited.add(loc);
  
  if (loc === 'lichtung') {
    if (firstVisit || !terminalState.hasLamp) {
      writeLog('Du stehst auf einer Lichtung. Das Lagerfeuer flackert schwach. Am Boden, halb im Laub vergraben, liegt etwas Metallisches - eine alte Laterne. Ein Pfad fuehrt nach vorne (Norden) tiefer in den Wald.');
    } else {
      writeLog('Die Lichtung mit dem Lagerfeuer. Der Pfad fuehrt nach Norden.');
    }
  } else if (loc === 'pfad') {
    if (firstVisit) {
      writeLog('Du folgst dem Pfad zwischen hohen Tannen. Links hoerst du das Plaetschern von Wasser. Nach vorne (Norden) wird der Wald dichter, du kannst den Umriss einer alten Huette erahnen. Der Weg zurueck fuehrt nach Sueden.');
    } else {
      writeLog('Der Waldpfad. Links (Westen) hoerst du Wasser. Norden zur Huette, Sueden zur Lichtung.');
    }
  } else if (loc === 'brunnen') {
    if (firstVisit || !terminalState.hasKey) {
      writeLog('Du stehst vor einem alten Steinbrunnen, ueberwuchert von Moos und Efeu. Das Wasser ist tief und dunkel. Etwas glaenzt am Grund - es sieht aus wie ein Schluessel! Du koenntest versuchen, ihn zu nehmen. Der Pfad liegt im Osten.');
    } else {
      writeLog('Der alte Brunnen. Der Pfad ist im Osten.');
    }
  } else if (loc === 'huette-aussen') {
    if (firstVisit) {
      writeLog('Vor dir steht eine verfallene Holzhuette. Das Dach ist schief, Fenster sind mit Brettern vernagelt. Ueber der angelehnte Tuer haengt ein verwittertes Rentiergeweih. Du koenntest die Huette betreten. Der Pfad zurueck liegt im Sueden.');
    } else {
      writeLog('Die alte Huette. Du kannst sie betreten oder nach Sueden zurueck zum Pfad.');
    }
  } else if (loc === 'huette-innen') {
    if (!terminalState.lampOn) {
      writeLog('Pechschwarz. Ohne Licht siehst du rein gar nichts. Du koenntest die Laterne anzuenden, falls du eine hast.');
    } else {
      if (firstVisit) {
        writeLog('Das Licht der Laterne erhellt den staubigen Raum. Spinnweben haengen von der Decke. Auf einem wackeligen Holztisch steht eine schwere, eisenbeschlagene Kiste. Sie hat ein altes Schloss.');
      } else {
        writeLog('Die staubige Huette. Auf dem Tisch steht die ' + (terminalState.chestOpen ? 'geoeffnete' : 'verschlossene') + ' Kiste.');
      }
    }
  }
}

function move(cmd) {
  const loc = terminalState.location;
  let moved = false;
  
  // VON LICHTUNG
  if (loc === 'lichtung') {
    if (cmd.includes('VOR') || cmd.includes('NORD') || cmd === 'N') {
      terminalState.location = 'pfad';
      writeLog('Du folgst dem schmalen Pfad nach Norden in den Wald hinein. Die Baeume werden dichter.');
      moved = true;
    }
  }
  
  // VON PFAD
  else if (loc === 'pfad') {
    if (cmd.includes('ZURUECK') || cmd.includes('SUED') || cmd === 'S') {
      terminalState.location = 'lichtung';
      writeLog('Du gehst den Pfad zurueck zur Lichtung.');
      moved = true;
    } else if (cmd.includes('VOR') || cmd.includes('NORD') || cmd === 'N') {
      terminalState.location = 'huette-aussen';
      writeLog('Du gehst weiter nach Norden. Zwischen den Baeumen taucht eine alte Huette auf.');
      moved = true;
    } else if (cmd.includes('LINKS') || cmd.includes('WEST') || cmd === 'W') {
      terminalState.location = 'brunnen';
      writeLog('Du folgst dem Geraeusch des Wassers nach Westen und findest einen alten Brunnen.');
      moved = true;
    }
  }
  
  // VON BRUNNEN
  else if (loc === 'brunnen') {
    if (cmd.includes('RECHTS') || cmd.includes('OST') || cmd === 'O' || cmd.includes('ZURUECK')) {
      terminalState.location = 'pfad';
      writeLog('Du gehst zurueck zum Pfad.');
      moved = true;
    }
  }
  
  // VON HUETTE AUSSEN
  else if (loc === 'huette-aussen') {
    if (cmd.includes('ZURUECK') || cmd.includes('SUED') || cmd === 'S') {
      terminalState.location = 'pfad';
      writeLog('Du gehst den Pfad ein Stueck nach Sueden zurueck.');
      moved = true;
    }
  }
  
  // VON HUETTE INNEN
  else if (loc === 'huette-innen') {
    if (cmd.includes('RAUS') || cmd.includes('ZURUECK') || cmd.includes('HINAUS')) {
      terminalState.location = 'huette-aussen';
      writeLog('Du verlaesst die Huette und stehst wieder draussen.');
      moved = true;
    }
  }
  
  if (!moved) {
    writeLog('In diese Richtung kannst du nicht gehen.');
  }
}

// Initialize terminal when script loads
startTerminal();
