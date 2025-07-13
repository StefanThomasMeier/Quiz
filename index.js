
import { getGames, saveGames } from './games.js';

function handleToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('spiele-Token');
  if (token) {
    const games = getGames();
    const game = games.find(g => g.token === token);
    if (game) {
      game.playerCount = (game.playerCount || 0) + 1;
      saveGames(games);

    }
    window.location.href = `battle.html?spiele-Token=${token}`;
  }
}

document.addEventListener('DOMContentLoaded', handleToken);
