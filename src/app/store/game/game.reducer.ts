import { createReducer, on } from '@ngrx/store';
import { Square } from '../../models/square';
import { endGame, makeMove, startGame } from './game.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';

export const gameFeatureKey = 'game';

export interface GameState {
  gameBoard: Square[];
  outcome: OutcomeEnum;
  draws: number;
}

export const initialState: GameState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
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
  on(makeMove, (state, { position, currentPlayer }) => {
    const newBoard = state.gameBoard.map((square, index) =>
      index === position
        ? { ...square, gamePiece: currentPlayer.piece }
        : square
    );

    return {
      ...state,
      gameBoard: newBoard,
    };
  }),
  on(endGame, (state, { outcome, winningPositions }) => {
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
  })
);
