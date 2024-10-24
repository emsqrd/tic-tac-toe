import { selectGameBoard, selectDraws, selectOutcome } from './game.selectors';
import { GameState } from './game.reducer';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';

describe('Game Selectors', () => {
  const initialState: GameState = {
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
    draws: 0,
    gameMode: GameModeEnum.TwoPlayer,
  };

  it('should select the game board', () => {
    const result = selectGameBoard.projector(initialState);
    expect(result).toEqual(initialState.gameBoard);
  });

  it('should select the number of draws', () => {
    const result = selectDraws.projector(initialState);
    expect(result).toEqual(initialState.draws);
  });

  it('should select the outcome', () => {
    const result = selectOutcome.projector(initialState);
    expect(result).toEqual(initialState.outcome);
  });
});
