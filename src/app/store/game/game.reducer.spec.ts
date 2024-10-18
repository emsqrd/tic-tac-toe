import { gameReducer, initialState, GameState } from './game.reducer';
import { startGame, makeMove, endGame, switchPlayer } from './game.actions';
import { Player } from '../../models/player';
import { Square } from '../../models/square';

describe('Game Reducer', () => {
  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle startGame action', () => {
    const action = startGame();
    const state = gameReducer(initialState, action);
    expect(state.gameBoard).toEqual(
      Array(9).fill({ gamePiece: '', isWinner: false })
    );
    expect(state.winner).toBeNull();
    expect(state.isDraw).toBe(false);
  });

  it('should handle makeMove action', () => {
    const position = 0;
    const action = makeMove({ position });
    const state = gameReducer(initialState, action);
    expect(state.gameBoard[position].gamePiece).toBe('X');
  });

  it('should not allow a move on an already occupied square', () => {
    const position = 0;
    const stateWithMove = gameReducer(initialState, makeMove({ position }));
    const stateWithInvalidMove = gameReducer(
      stateWithMove,
      makeMove({ position })
    );
    expect(stateWithInvalidMove).toEqual(stateWithMove);
  });

  it('should handle endGame action with a winner', () => {
    const winner: Player = initialState.player1;
    const winningPositions = [0, 1, 2];
    const action = endGame({ winner, winningPositions });
    const state = gameReducer(initialState, action);
    expect(state.winner).toEqual(winner);
    expect(state.player1.wins).toBe(1);
    expect(state.gameBoard[0].isWinner).toBe(true);
    expect(state.gameBoard[1].isWinner).toBe(true);
    expect(state.gameBoard[2].isWinner).toBe(true);
  });

  it('should handle endGame action with a draw', () => {
    const action = endGame({ winner: null, winningPositions: [] });
    const state = gameReducer(initialState, action);
    expect(state.isDraw).toBe(true);
    expect(state.draws).toBe(1);
  });

  it('should handle switchPlayer action', () => {
    const action = switchPlayer();
    const state = gameReducer(initialState, action);
    expect(state.currentPlayer).toEqual(initialState.player2);
  });
});
