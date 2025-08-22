import { jest } from '@jest/globals';

function mockLocalStorage() {
  const store = {};
  return {
    getItem: jest.fn(key => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); })
  };
}

describe('storage helpers', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('addReport stores report', async () => {
    const { addReport, getReports } = await import('../storage.js');
    addReport({ question: { id: 1 }, message: 'Test' });
    expect(getReports()).toEqual([{ question: { id: 1 }, message: 'Test' }]);
  });

  test('removeReport deletes report', async () => {
    const { addReport, removeReport, getReports } = await import('../storage.js');
    addReport({ question: { id: 1 }, message: 'Test' });
    removeReport(0);
    expect(getReports()).toEqual([]);
  });

  test('addCustomQuestion overrides', async () => {
    const { addCustomQuestion, getCustomQuestions } = await import('../storage.js');
    addCustomQuestion({ id: 1, frage: 'a' });
    addCustomQuestion({ id: 1, frage: 'b' });
    expect(getCustomQuestions()).toEqual([{ id: 1, frage: 'b' }]);
  });
});
