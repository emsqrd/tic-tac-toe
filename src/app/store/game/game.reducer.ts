import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { endGame, switchPlayer, makeMove, startGame } from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';

export const gameFeatureKey = 'game';

export interface GameState {
  gameBoard: Square[];
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  outcome: OutcomeEnum;
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
  outcome: OutcomeEnum.None,
  draws: 0,
};

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state) => ({
    ...state,
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
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
  on(endGame, (state, { outcome, winningPositions }) => {
    let player1 = { ...state.player1 };
    let player2 = { ...state.player2 };
    let currentPlayer = { ...state.currentPlayer };
    let draws = state.draws;
    let newBoard = state.gameBoard;
    let newOutcome = outcome;

    if (newOutcome === OutcomeEnum.Win) {
      // Highlight the squares that resulted in the win, not all for the winning player
      newBoard = state.gameBoard.map((square, index) => {
        if (winningPositions?.includes(index)) {
          return { ...square, isWinner: true };
        }
        return square;
      });

      if (currentPlayer.piece === player1.piece) {
        player1 = { ...player1, wins: (player1.wins += 1) };
      } else {
        player2 = { ...player2, wins: (player2.wins += 1) };
      }
    } else if (newOutcome === OutcomeEnum.Draw) {
      draws++;
    }

    return {
      ...state,
      gameBoard: newBoard,
      player1,
      player2,
      currentPlayer,
      outcome: newOutcome,
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
