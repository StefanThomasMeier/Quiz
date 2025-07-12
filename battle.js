import { questions } from './questions.js';
import { games } from './games.js';

const container = document.getElementById('battle');
const battleBtn = document.getElementById('battle-btn');

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createGame() {
  const id = games.length + 1;
  const token = Math.random().toString(36).substring(2, 10);
  const frageIds = shuffle([...questions])
    .slice(0, 5)
    .map(q => q.id);
  const datestamp = new Date().toISOString();

  const game = {
    id,
    token,
    anzahlSpiele: 0,
    fragen: frageIds,
    datestamp
  };

  games.push(game);
  renderGame(game);
}

function renderGame(game) {
  container.innerHTML = `<pre>${JSON.stringify(game, null, 2)}</pre>`;
}

battleBtn.addEventListener('click', createGame);
