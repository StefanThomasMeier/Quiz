import { questions } from './questions.js';
import { getGames, saveGames } from './games.js';

const container = document.querySelector('.battle-container');
const qrContainer = document.getElementById('qr');
const siteQrContainer = document.getElementById('siteQr');
const startBtn = document.getElementById('startBtn');

// Display a QR code for the main website
if (siteQrContainer) {
  new QRCode(siteQrContainer, 'https://www.mei-deo.ch');
}

function getJoinUrl(token) {
  const url = new URL('index.html', location.href);
  url.searchParams.set('token', token);
  return url.href;
}

const params = new URLSearchParams(window.location.search);
const tokenParam = params.get('token');

let games = getGames();


if (tokenParam) {
  startBtn.style.display = 'none';
  const game = games.find(g => g.token === tokenParam);
  if (game) {
    const joinUrl = getJoinUrl(tokenParam);
    if (qrContainer) {
      qrContainer.innerHTML = '';
      new QRCode(qrContainer, joinUrl);
    }
    renderGame(game);
  } else {
    container.innerHTML = '<p>Spiel nicht gefunden.</p>';

    startBtn.style.display = 'inline-block';
    container.appendChild(startBtn);
    startBtn.addEventListener('click', createGame);
    const backLink = document.createElement('a');
    backLink.href = 'index.html';
    backLink.textContent = 'Zurück';
    backLink.className = 'back-btn';
    container.appendChild(backLink);

  }
} else {
  startBtn.addEventListener('click', createGame);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function createGame() {
  games = getGames();
  const id = games.length + 1;
  const token = Math.random().toString(36).substring(2, 10);
  const frageIds = shuffle([...questions])
    .slice(0, 5)
    .map(q => q.id);
  const datestamp = new Date().toISOString();

  const game = {
    id,
    token,
    playerCount: 1,
    fragen: frageIds,
    datestamp
  };

  games.push(game);
  saveGames(games);

  const joinUrl = getJoinUrl(token);
  if (qrContainer) {
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, joinUrl);
  }
  renderGame(game);
}

function renderGame(game) {
  let pre = document.getElementById('gameInfo');
  if (!pre) {
    pre = document.createElement('pre');
    pre.id = 'gameInfo';
    container.appendChild(pre);
  }
  pre.textContent = JSON.stringify(game, null, 2);
}
