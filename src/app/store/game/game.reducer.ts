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
};

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state) => ({
    ...state,
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    winner: null,
  })),
  on(makeMove, (state, { position }) => {
    const newBoard = state.gameBoard.map((square, index) =>
      index === position
        ? { ...square, gamePiece: state.currentPlayer.piece }
        : square
    );

    const winnerPiece = calculateWinner(newBoard);

    let winner = null;
    let player1 = { ...state.player1 };
    let player2 = { ...state.player2 };

    if (winnerPiece) {
      if (winnerPiece === player1.piece) {
        player1 = { ...player1, wins: player1.wins + 1 };
        winner = player1;
      } else {
        player2 = { ...player2, wins: player2.wins + 1 };
        winner = player2;
      }

      newBoard.forEach((square, index) => {
        if (winnerPiece === square.gamePiece) {
          newBoard[index] = { ...square, isWinner: true };
        }
      });
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
    };
  }),
  on(endGame, (state, { winner }) => ({ ...state, winner }))
);
