import { gameReducer, initialState } from './game.reducer';
import { startGame, makeMove, endGame, switchPlayer } from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';

describe('Game Reducer', () => {
  const currentPlayerMock = { name: 'Player 1', piece: 'X', wins: 0 };

  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle startGame action', () => {
    const state = gameReducer(initialState, startGame());
    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.outcome).toEqual(OutcomeEnum.None);
  });

  it('should handle makeMove action', () => {
    const position = 0;
    const state = gameReducer(
      initialState,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );
    expect(state.gameBoard[position].gamePiece).toEqual(
      initialState.currentPlayer.piece
    );
  });

  it('should not allow a move on an already taken square', () => {
    const position = 0;
    const stateWithMove = gameReducer(
      initialState,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );
    const stateWithInvalidMove = gameReducer(
      stateWithMove,
      makeMove({ position, currentPlayer: currentPlayerMock })
    );
    expect(stateWithInvalidMove).toEqual(stateWithMove);
  });

  it('should handle endGame action with a win', () => {
    const winningPositions = [0, 1, 2];
    const state = gameReducer(
      initialState,
      endGame({ outcome: OutcomeEnum.Win, winningPositions })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Win);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
    expect(state.player1.wins).toBe(1);
  });

  it('should handle endGame action with a draw', () => {
    const state = gameReducer(
      initialState,
      endGame({ outcome: OutcomeEnum.Draw, winningPositions: [] })
    );
    expect(state.outcome).toEqual(OutcomeEnum.Draw);
    expect(state.draws).toBe(1);
  });

  it('should handle switchPlayer action', () => {
    const state = gameReducer(initialState, switchPlayer());
    expect(state.currentPlayer).toEqual(initialState.player2);
  });
});
