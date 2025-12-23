const einsteinCategories = [
  { key: 'color', label: 'Farbe', options: ['Blau', 'Rot', 'Gruen', 'Gelb'] },
  { key: 'person', label: 'Beruf', options: ['Pilotin', 'Programmierer', 'Taucherin', 'Baecker'] },
  { key: 'animal', label: 'Tier', options: ['Eule', 'Wal', 'Pinguin', 'Fuchs'] },
  { key: 'drink', label: 'Getraenk', options: ['Kaffee', 'Limo', 'Kakao', 'Tee'] }
];

const einsteinSolution = [
  { color: 'Blau', person: 'Pilotin', animal: 'Eule', drink: 'Kaffee' },
  { color: 'Rot', person: 'Programmierer', animal: 'Wal', drink: 'Limo' },
  { color: 'Gruen', person: 'Taucherin', animal: 'Pinguin', drink: 'Kakao' },
  { color: 'Gelb', person: 'Baecker', animal: 'Fuchs', drink: 'Tee' }
];

const housesEl = document.getElementById('einsteinHouses');
const bankEl = document.getElementById('tileBank');
const codeEl = document.getElementById('einsteinCode');
const statusEl = document.getElementById('einsteinStatus');
let draggedTile = null;

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createTile(option, category) {
  const tile = document.createElement('div');
  tile.className = `tile tile-${category}`;
  tile.textContent = option;
  tile.draggable = true;
  tile.dataset.category = category;
  tile.dataset.value = option;
  tile.id = `tile-${category}-${option}`;
  tile.addEventListener('dragstart', handleDragStart);
  tile.addEventListener('dragend', handleDragEnd);
  return tile;
}

function handleDragStart(event) {
  draggedTile = event.currentTarget;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedTile.id);
  setTimeout(() => draggedTile.classList.add('dragging'), 0);
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove('dragging');
  draggedTile = null;
}

function allowDrop(event) {
  event.preventDefault();
}

function handleSlotDrop(event) {
  event.preventDefault();
  if (!draggedTile) return;
  const slot = event.currentTarget;
  const category = slot.dataset.category;
  if (draggedTile.dataset.category !== category) {
    flashStatus('Falsche Kategorie für dieses Feld.', true);
    return;
  }
  placeTile(slot);
  flashStatus('Plakette gesetzt.', false);
}

function handleBankDrop(event) {
  event.preventDefault();
  if (!draggedTile) return;
  bankEl.appendChild(draggedTile);
  flashStatus('Plakette zur Ablage gelegt.', false);
  checkEinsteinSolution();
}

function placeTile(slot) {
  const existing = slot.querySelector('.tile');
  if (existing) bankEl.appendChild(existing);
  slot.appendChild(draggedTile);
  checkEinsteinSolution();
}

function renderHouses() {
  housesEl.innerHTML = '';
  einsteinSolution.forEach((_, idx) => {
    const card = document.createElement('div');
    card.className = 'house-card';

    const header = document.createElement('div');
    header.className = 'house-header';
    let posLabel = 'Mitte';
    if (idx === 0) posLabel = 'Ganz links';
    else if (idx === einsteinSolution.length - 1) posLabel = 'Ganz rechts';
    else if (idx < einsteinSolution.length / 2) posLabel = 'Mitte Links';
    else posLabel = 'Mitte Rechts';
    header.innerHTML = `<span class="house-index">Haus ${idx + 1}</span><span class="house-title">${posLabel}</span>`;
    card.appendChild(header);

    einsteinCategories.forEach(cat => {
      const row = document.createElement('div');
      row.className = 'slot-row';

      const label = document.createElement('div');
      label.className = 'slot-label';
      label.textContent = cat.label;

      const slot = document.createElement('div');
      slot.className = 'drop-slot';
      slot.dataset.category = cat.key;
      slot.id = `slot-${idx}-${cat.key}`;
      slot.addEventListener('dragover', allowDrop);
      slot.addEventListener('drop', handleSlotDrop);

      row.appendChild(label);
      row.appendChild(slot);
      card.appendChild(row);
    });

    housesEl.appendChild(card);
  });
}

function renderBank() {
  bankEl.innerHTML = '';
  const tiles = [];
  einsteinCategories.forEach(cat => {
    cat.options.forEach(opt => {
      tiles.push(createTile(opt, cat.key));
    });
  });
  shuffle(tiles).forEach(tile => bankEl.appendChild(tile));
  bankEl.addEventListener('dragover', allowDrop);
  bankEl.addEventListener('drop', handleBankDrop);
}

function flashStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('status-error', Boolean(isError));
}

function checkEinsteinSolution() {
  let correct = true;
  const categoryComplete = {};
  einsteinCategories.forEach(cat => { categoryComplete[cat.key] = true; });
  
  for (let houseIdx = 0; houseIdx < einsteinSolution.length; houseIdx += 1) {
    const expected = einsteinSolution[houseIdx];
    einsteinCategories.forEach(cat => {
      const slot = document.getElementById(`slot-${houseIdx}-${cat.key}`);
      const tile = slot.querySelector('.tile');
      const matches = tile && tile.dataset.value === expected[cat.key];
      if (!matches) {
        correct = false;
        categoryComplete[cat.key] = false;
      }
    });
  }

  einsteinCategories.forEach(cat => {
    const slots = document.querySelectorAll(`.drop-slot[data-category="${cat.key}"]`);
    slots.forEach(slot => slot.classList.toggle('category-correct', categoryComplete[cat.key]));
  });

  if (correct) {
    codeEl.textContent = '8 2 8 4';
    codeEl.classList.add('success');
    flashStatus('Alles passt! Der Code lautet 8284.', false);
  } else {
    codeEl.textContent = '_ _ _ _';
    codeEl.classList.remove('success');
  }
}

function initEinsteinRiddle() {
  if (!housesEl || !bankEl || !codeEl) return;
  renderHouses();
  renderBank();
  flashStatus('Ziehe die Plaketten auf die Felder.', false);
  checkEinsteinSolution();
}

initEinsteinRiddle();
