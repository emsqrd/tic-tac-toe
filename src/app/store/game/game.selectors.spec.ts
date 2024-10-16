import {
  selectGameBoard,
  selectCurrentPlayer,
  selectWinner,
  selectPlayer1,
  selectPlayer2,
  selectDraws,
  selectIsDraw,
} from './game.selectors';
import { GameState } from './game.reducer';

describe('Game Selectors', () => {
  const initialState: GameState = {
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    player1: {
      name: 'Player 1',
      piece: 'X',
      wins: 0,
    },
    player2: {
      name: 'Player 2',
      piece: 'O',
      wins: 0,
    },
    currentPlayer: {
      name: 'Player 1',
      piece: 'X',
      wins: 0,
    },
    winner: null,
    isDraw: false,
    draws: 0,
  };

  it('should select the game board', () => {
    const result = selectGameBoard.projector(initialState);
    expect(result).toEqual(initialState.gameBoard);
  });

  it('should select the current player', () => {
    const result = selectCurrentPlayer.projector(initialState);
    expect(result).toEqual(initialState.currentPlayer);
  });

  it('should select the winner', () => {
    const result = selectWinner.projector(initialState);
    expect(result).toEqual(initialState.winner);
  });

  it('should select player 1', () => {
    const result = selectPlayer1.projector(initialState);
    expect(result).toEqual(initialState.player1);
  });

  it('should select player 2', () => {
    const result = selectPlayer2.projector(initialState);
    expect(result).toEqual(initialState.player2);
  });

  it('should select the number of draws', () => {
    const result = selectDraws.projector(initialState);
    expect(result).toEqual(initialState.draws);
  });

  it('should select if the game is a draw', () => {
    const result = selectIsDraw.projector(initialState);
    expect(result).toEqual(initialState.isDraw);
  });
});
