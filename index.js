import { games } from './games.js';

function handleToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    const game = games.find(g => g.token === token);
    if (game) {
      game.anzahlSpiele = (game.anzahlSpiele || 0) + 1;
    }
    window.location.href = `battle.html?token=${token}`;
  }
}

document.addEventListener('DOMContentLoaded', handleToken);
