import { createReducer, on } from '@ngrx/store';
import { Square } from '../../models/square';
import {
  makeMove,
  switchGameMode,
  startGame,
  resetDraws,
  startRound,
  endRound,
} from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';

export const gameFeatureKey = 'game';

export interface GameState {
  gameBoard: Square[];
  outcome: OutcomeEnum;
  draws: number;
  gameMode: GameModeEnum;
}

export const initialState: GameState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
  draws: 0,
  gameMode: GameModeEnum.TwoPlayer,
};

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state, { gameMode }) => ({
    ...state,
    gameMode: gameMode,
  })),
  on(startRound, (state) => {
    return {
      ...state,
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      outcome: OutcomeEnum.None,
    };
  }),
  on(makeMove, (state, { position, currentPlayer }) => {
    let newBoard = state.gameBoard;

    // If no position is provided, make a random move
    if (position === undefined) {
      const emptySquares: number[] = [];
      state.gameBoard.forEach((square, index) => {
        if (square.gamePiece === '') {
          emptySquares.push(index);
        }
      });

      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      const randomEmptySquareIndex = emptySquares[randomIndex];

      newBoard = state.gameBoard.map((square, index) =>
        index === randomEmptySquareIndex
          ? { ...square, gamePiece: currentPlayer.piece }
          : square
      );
    } else {
      newBoard = state.gameBoard.map((square, index) =>
        index === position
          ? { ...square, gamePiece: currentPlayer.piece }
          : square
      );
    }

    return {
      ...state,
      gameBoard: newBoard,
    };
  }),
  on(endRound, (state, { outcome, winningPositions }) => {
    let draws = state.draws;
    let newBoard = state.gameBoard;

    if (outcome === OutcomeEnum.Win) {
      // Highlight the squares that resulted in the win, not all for the winning player
      newBoard = state.gameBoard.map((square, index) => {
        if (winningPositions?.includes(index)) {
          return { ...square, isWinner: true };
        }
        return square;
      });
    } else if (outcome === OutcomeEnum.Draw) {
      draws++;
    }

    return {
      ...state,
      gameBoard: newBoard,
      draws,
      outcome,
    };
  }),
  on(switchGameMode, (state) => {
    let newGameMode =
      state.gameMode === GameModeEnum.TwoPlayer
        ? GameModeEnum.SinglePlayer
        : GameModeEnum.TwoPlayer;

    return {
      ...state,
      gameMode: newGameMode,
    };
  }),
  on(resetDraws, (state) => {
    return {
      ...state,
      draws: 0,
    };
  })
);
