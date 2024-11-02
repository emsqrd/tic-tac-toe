import { selectDraws, selectGameMode } from './game.selectors';
import { getInitialGameStateMock } from '../mocks/game-mocks';

describe('Game Selectors', () => {
  const intitalGameStateMock = getInitialGameStateMock();

  it('should select the number of draws', () => {
    const result = selectDraws.projector(intitalGameStateMock);
    expect(result).toEqual(intitalGameStateMock.draws);
  });

  it('should select the game mode', () => {
    const result = selectGameMode.projector(intitalGameStateMock);
    expect(result).toEqual(intitalGameStateMock.gameMode);
  });
});
