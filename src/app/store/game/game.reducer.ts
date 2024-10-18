import { createReducer, on, State } from '@ngrx/store';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { endGame, switchPlayer, makeMove, startGame } from './game.actions';

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

    return {
      ...state,
      gameBoard: newBoard,
    };
  }),
  on(endGame, (state, { winner, winningPositions }) => {
    let player1 = { ...state.player1 };
    let player2 = { ...state.player2 };
    let isDraw = false;
    let draws = state.draws;
    let newBoard = state.gameBoard;

    if (winner) {
      // Highlight the squares that resulted in the win, not all for the winning player
      newBoard = state.gameBoard.map((square, index) => {
        if (winningPositions?.includes(index)) {
          return { ...square, isWinner: true };
        }
        return square;
      });

      if (winner.piece === player1.piece) {
        player1 = { ...player1, wins: (player1.wins += 1) };
      } else {
        player2 = { ...player2, wins: (player2.wins += 1) };
      }
    } else {
      isDraw = true;
      draws++;
    }

    return {
      ...state,
      gameBoard: newBoard,
      player1,
      player2,
      winner,
      isDraw,
      draws,
    };
  }),
  on(switchPlayer, (state) => {
    // Switch players
    let currentPlayer = { ...state.currentPlayer };

    // (state.currentPlayerIndex + 1) % 2
    const nextPlayer =
      currentPlayer.piece === 'X' ? state.player2 : state.player1;

    return {
      ...state,
      currentPlayer: nextPlayer,
    };
  })
);
