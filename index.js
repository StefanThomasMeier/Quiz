
import { getGames, saveGames } from './games.js';

const CURRENT_TOKEN_KEY = 'currentGameToken';

function handleToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');
  if (token) {
    const games = getGames();
    const game = games.find(g => g.token === token);
    if (game) {
      game.playerCount = (game.playerCount || 0) + 1;
      saveGames(games);
    }
    localStorage.setItem(CURRENT_TOKEN_KEY, token);
    window.location.href = `battle.html?tokenid=${token}`;
  }
}

document.addEventListener('DOMContentLoaded', handleToken);
