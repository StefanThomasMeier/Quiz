import { questions } from './questions.js';
import { getGames, saveGames } from './games.js';

const container = document.querySelector('.battle-container');
const qrContainer = document.getElementById('qr');
const siteQrContainer = document.getElementById('siteQr');
const startBtn = document.getElementById('startBtn');
const gameDetailsEl = document.getElementById('gameDetails');
const devInfoEl = document.getElementById('devInfo');

function updateQr(container, url) {
  if (!container) return;
  container.innerHTML = '';
  new QRCode(container, url);
}

function getIndexUrl(token) {
  const url = new URL('index.html', location.href);
  url.searchParams.set('tokenid', token || 'unbekannt');

  return url.href;
}

function getJoinUrl(token) {
  const url = new URL('index.html', location.href);
  url.searchParams.set('tokenid', token || 'unbekannt');

  return url.href;
}

const params = new URLSearchParams(window.location.search);
const tokenParam = params.get('tokenid');

updateQr(siteQrContainer, getIndexUrl(tokenParam));

let games = getGames();

renderDevInfo(null);


if (tokenParam) {
  startBtn.style.display = 'none';
  const game = games.find(g => g.token === tokenParam);
  if (game) {
    const joinUrl = getJoinUrl(tokenParam);
    updateQr(qrContainer, joinUrl);
    updateQr(siteQrContainer, getIndexUrl(tokenParam));
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
  updateQr(qrContainer, joinUrl);
  updateQr(siteQrContainer, getIndexUrl(token));
  renderGame(game);
}

function renderGame(game) {
  if (gameDetailsEl) {
    gameDetailsEl.innerHTML = `
      <p>Spielnr.: ${game.id}</p>
      <p>Spieleranzahl: ${game.playerCount}</p>`;
  }
  renderDevInfo(game);
}

function renderDevInfo(game) {
  if (!devInfoEl) return;
  try {
    devInfoEl.textContent = JSON.stringify({ game, games }, null, 2);
  } catch (err) {
    devInfoEl.textContent = err.toString();
  }
}
