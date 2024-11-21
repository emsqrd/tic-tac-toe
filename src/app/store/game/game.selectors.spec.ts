import { selectDraws, selectGameMode } from './game.selectors';
import { getInitialGameStateMock } from '../mocks/game-mocks';

describe('Game Selectors', () => {
  const intitalGameStateMock = getInitialGameStateMock();

  test('should select the number of draws', () => {
    const result = selectDraws.projector(intitalGameStateMock);
    expect(result).toBe(intitalGameStateMock.draws);
  });

  test('should select the game mode', () => {
    const result = selectGameMode.projector(intitalGameStateMock);
    expect(result).toBe(intitalGameStateMock.gameMode);
  });
});
