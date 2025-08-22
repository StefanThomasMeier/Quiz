import { questions } from './questions.js';
import { getGames, saveGames } from './games.js';
import { getCustomQuestions, addReport } from './storage.js';
function allQuestions() {
  const base = [...questions];
  const extras = getCustomQuestions();
  extras.forEach(q => {
    const idx = base.findIndex(b => b.id === q.id);
    if (idx >= 0) base[idx] = q; else base.push(q);
  });
  return base;
}

const CURRENT_TOKEN_KEY = 'currentGameToken';
const CURRENT_PLAYER_KEY = 'currentPlayerId';
const COUNTDOWN_SECONDS = 5;

const container = document.querySelector('.battle-container');
const qrContainer = document.getElementById('qr');
const siteQrContainer = document.getElementById('siteQr');
const startBtn = document.getElementById('startBtn');
const gameDetailsEl = document.getElementById('gameDetails');
const devInfoEl = document.getElementById('devInfo');
const quizEl = document.getElementById('quiz');
const statusEl = document.getElementById('status');

function updateQr(el, url) {
  if (!el) return;
  el.innerHTML = '';
  new QRCode(el, url);
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

let games = getGames();
const params = new URLSearchParams(window.location.search);
let tokenParam = params.get('tokenid');
let game = tokenParam ? games.find(g => g.token === tokenParam) : null;
let playerId = parseInt(localStorage.getItem(CURRENT_PLAYER_KEY), 10);
let quizStarted = false;
let selected = [];
let current = 0;
let score = 0;

updateQr(siteQrContainer, getIndexUrl(tokenParam));
renderDevInfo(null);

if (tokenParam && game) {
  joinGame();
  renderGame();
  startPolling();
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
  const frageIds = shuffle(allQuestions())
    .slice(0, 5)
    .map(q => q.id);
  const datestamp = new Date().toISOString();

  const gameObj = {
    id,
    token,
    playerCount: 1,
    players: [{ id: 1, score: null, finished: false }],
    fragen: frageIds,
    datestamp,
    startTime: null
  };

  games.push(gameObj);
  saveGames(games);
  localStorage.setItem(CURRENT_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_PLAYER_KEY, 1);
  window.location.href = `battle.html?tokenid=${token}`;
}

function joinGame() {
  if (!game) return;
  if (!game.players) game.players = [];
  if (!playerId || !game.players.some(p => p.id === playerId)) {
    playerId = game.players.length + 1;
    game.players.push({ id: playerId, score: null, finished: false });
    game.playerCount = game.players.length;
    saveGames(games);
    localStorage.setItem(CURRENT_PLAYER_KEY, playerId);
  }
  localStorage.setItem(CURRENT_TOKEN_KEY, game.token);
}

function renderGame() {
  if (!game) return;
  updateQr(qrContainer, getJoinUrl(game.token));
  updateQr(siteQrContainer, getIndexUrl(game.token));
  if (gameDetailsEl) {
    gameDetailsEl.innerHTML = `
      <p>Spielnr.: ${game.id}</p>
      <p>Spieleranzahl: ${game.playerCount}</p>
      <p>Du bist Spieler ${playerId}</p>`;
  }
  if (playerId === 1 && !game.startTime) {
    startBtn.style.display = 'inline-block';
    startBtn.onclick = beginGame;
  } else {
    startBtn.style.display = 'none';
  }
  renderDevInfo(game);
}

function beginGame() {
  if (!game) return;
  game.startTime = Date.now() + COUNTDOWN_SECONDS * 1000;
  saveGames(games);
  renderGame();
}

function startPolling() {
  setInterval(() => {
    games = getGames();
    game = games.find(g => g.token === tokenParam);
    if (!game) return;
    renderGame();
    if (game.startTime && !quizStarted) {
      const diff = Math.ceil((game.startTime - Date.now()) / 1000);
      if (diff > 0) {
        statusEl.textContent = `Start in ${diff}...`;
      } else {
        statusEl.textContent = '';
        startQuiz();
      }
    }
    if (quizStarted) {
      checkResults();
    }
  }, 1000);
}

function startQuiz() {
  quizStarted = true;
  selected = game.fragen.map(id => allQuestions().find(q => q.id === id));
  current = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const q = selected[current];
  quizEl.innerHTML = '';
  const questionEl = document.createElement('div');
  questionEl.innerHTML = `<p>${current + 1}/5: ${q.frage}</p>`;
  const answersEl = document.createElement('div');
  answersEl.className = 'answers';
  q.antworten.forEach((a, idx) => {
    const btn = document.createElement('button');
    btn.textContent = a;
    btn.addEventListener('click', () => handleAnswer(idx));
    answersEl.appendChild(btn);
  });
  questionEl.appendChild(answersEl);
  const reportBtn = document.createElement("button");
  reportBtn.textContent = "Problem melden";
  reportBtn.addEventListener("click", () => {
    const msg = prompt("Was ist das Problem?");
    if (msg) { addReport({ question: q, message: msg }); alert("Danke für deine Meldung!"); }
  });
  questionEl.appendChild(reportBtn);
  quizEl.appendChild(questionEl);
}

function handleAnswer(idx) {
  const q = selected[current];
  if (idx === q.korrekt) score++;
  current++;
  if (current < selected.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const gamesArr = getGames();
  const g = gamesArr.find(gm => gm.token === tokenParam);
  if (g) {
    const p = g.players.find(pl => pl.id === playerId);
    if (p) {
      p.score = score;
      p.finished = true;
      saveGames(gamesArr);
    }
  }
  statusEl.textContent = `Warte auf andere Spieler... Dein Ergebnis: ${score}/5`;
  quizEl.innerHTML = '';
}

function checkResults() {
  if (!game.players) return;
  const finished = game.players.filter(p => p.finished).length;
  if (finished === game.playerCount && game.players.every(p => p.score !== null)) {
    showScoreboard();
  } else {
    statusEl.textContent = `Warte auf andere Spieler... (${finished}/${game.playerCount})`;
  }
}

function showScoreboard() {
  quizEl.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'scoreboard';
  let best = 0;
  game.players.forEach(p => { if (p.score > best) best = p.score; });
  game.players.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `Spieler ${p.id}: ${p.score} Punkte`;
    if (p.score === best) li.style.fontWeight = 'bold';
    list.appendChild(li);
  });
  quizEl.appendChild(list);
  const winners = game.players.filter(p => p.score === best).map(p => `Spieler ${p.id}`).join(', ');
  statusEl.textContent = `Gewonnen hat: ${winners}`;
  const backLink = document.createElement('a');
  backLink.href = 'index.html';
  backLink.textContent = 'Zurück';
  backLink.className = 'back-btn';
  quizEl.appendChild(backLink);
}

function renderDevInfo(g) {
  if (!devInfoEl) return;
  try {
    devInfoEl.textContent = JSON.stringify({ game: g, games }, null, 2);
  } catch (err) {
    devInfoEl.textContent = err.toString();
  }
}

