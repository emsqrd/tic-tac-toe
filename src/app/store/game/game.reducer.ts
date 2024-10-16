import { createReducer, on, State } from '@ngrx/store';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { endGame, makeMove, startGame } from './game.actions';
import { calculateWinner } from '../../utils/game-utils';

export const gameFeatureKey = 'game';

export interface GameState {
  gameBoard: Square[];
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  draws: number;
}

export const initialState: GameState = {
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

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state) => ({
    ...state,
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    winner: null,
    isDraw: false,
  })),
  on(makeMove, (state, { position }) => {
    // If the square is already taken, do nothing
    if (state.gameBoard[position].gamePiece !== '') {
      return state;
    }

    const newBoard = state.gameBoard.map((square, index) =>
      index === position
        ? { ...square, gamePiece: state.currentPlayer.piece }
        : square
    );

    const winningPositions = calculateWinner(newBoard);

    let winner = null;
    let player1 = { ...state.player1 };
    let player2 = { ...state.player2 };
    let isDraw = false;
    let draws = state.draws;

    if (winningPositions) {
      if (state.currentPlayer.piece === player1.piece) {
        player1 = { ...player1, wins: player1.wins + 1 };
        winner = player1;
      } else {
        player2 = { ...player2, wins: player2.wins + 1 };
        winner = player2;
      }

      // Highlight the squares that resulted in the win, not all for the winning player
      newBoard.forEach((square, index) => {
        if (winningPositions.includes(index)) {
          newBoard[index] = { ...square, isWinner: true };
        }
      });
    } else if (newBoard.every((square) => square.gamePiece !== '')) {
      isDraw = true;
      draws++;
    }

    // (state.currentPlayerIndex + 1) % 2
    const nextPlayer = state.currentPlayer.piece === 'X' ? player2 : player1;

    return {
      ...state,
      gameBoard: newBoard,
      currentPlayer: nextPlayer,
      player1,
      player2,
      winner,
      isDraw,
      draws,
    };
  }),
  on(endGame, (state, { winner }) => ({ ...state, winner }))
);
