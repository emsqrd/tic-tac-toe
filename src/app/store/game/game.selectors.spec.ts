import { selectDraws, selectGameMode } from './game.selectors';
import { getInitialGameStateMock } from '../mocks/game-mocks';

describe('Game Selectors', () => {
  let initialGameStateMock: ReturnType<typeof getInitialGameStateMock>;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
  });

  test('should select the number of draws', () => {
    const result = selectDraws.projector(initialGameStateMock);
    expect(result).toBe(initialGameStateMock.draws);
  });

  test('should select the game mode', () => {
    const result = selectGameMode.projector(initialGameStateMock);
    expect(result).toBe(initialGameStateMock.gameMode);
  });
});
