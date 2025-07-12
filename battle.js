import { questions } from './questions.js';
import { games } from './games.js';

const container = document.querySelector('.battle-container');
const qrImg = document.getElementById('qr');
const startBtn = document.getElementById('startBtn');

function getJoinUrl(token) {
  const url = new URL('index.html', location.href);
  url.searchParams.set('token', token);
  return url.href;
}

const params = new URLSearchParams(window.location.search);
const tokenParam = params.get('token');

if (tokenParam) {
  startBtn.style.display = 'none';
  const game = games.find(g => g.token === tokenParam);
  if (game) {
    const joinUrl = getJoinUrl(tokenParam);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
    renderGame(game);
  } else {
    container.innerHTML = '<p>Spiel nicht gefunden.</p>';
  }
} else {
  startBtn.addEventListener('click', createGame);
}

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
  const joinUrl = getJoinUrl(token);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
  renderGame(game);
}

function renderGame(game) {
  container.innerHTML = `<pre>${JSON.stringify(game, null, 2)}</pre>`;
}
