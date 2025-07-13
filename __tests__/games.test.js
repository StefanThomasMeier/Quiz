import { jest } from '@jest/globals';

// Helper to setup localStorage mock
function mockLocalStorage() {
  const store = {};
  return {
    getItem: jest.fn(key => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); })
  };
}

describe('games storage', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('saveGames stores JSON in localStorage', async () => {
    const { saveGames } = await import('../games.js');
    const data = [{ id: 1 }];
    saveGames(data);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('games', JSON.stringify(data));
  });

  test('getGames returns parsed games', async () => {
    const data = [{ id: 2 }];
    global.localStorage.getItem = jest.fn(() => JSON.stringify(data));
    const { getGames } = await import('../games.js');
    expect(getGames()).toEqual(data);
  });

  test('getGames returns empty array when nothing stored', async () => {
    global.localStorage.getItem = jest.fn(() => null);
    const { getGames } = await import('../games.js');
    expect(getGames()).toEqual([]);
  });
});
