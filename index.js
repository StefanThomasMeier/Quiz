
import { getGames, saveGames } from './games.js';

const CURRENT_TOKEN_KEY = 'currentGameToken';
const CURRENT_PLAYER_KEY = 'currentPlayerId';

function handleToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');
  if (token) {
    const games = getGames();
    const game = games.find(g => g.token === token);
    if (game) {
      game.players = game.players || [];
      const playerId = game.players.length + 1;
      game.players.push({ id: playerId, score: null, finished: false });
      game.playerCount = game.players.length;
      saveGames(games);
      localStorage.setItem(CURRENT_PLAYER_KEY, playerId);
    }
    localStorage.setItem(CURRENT_TOKEN_KEY, token);
    window.location.href = `battle.html?tokenid=${token}`;
  }
}

document.addEventListener('DOMContentLoaded', handleToken);
