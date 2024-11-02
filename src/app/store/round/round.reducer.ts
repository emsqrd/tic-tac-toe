import { createReducer, on } from '@ngrx/store';
import { RoundActions } from './round.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Square } from '../../models/square';

export const roundFeatureKey = 'round';

export interface RoundState {
  gameBoard: Square[];
  outcome: OutcomeEnum;
}

export const initialState: RoundState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
};

export const roundReducer = createReducer(
  initialState,
  on(RoundActions.startRound, (state) => {
    return {
      ...state,
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      outcome: OutcomeEnum.None,
    };
  }),
  on(RoundActions.makeMove, (state, { position, currentPlayer }) => {
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
  on(RoundActions.endRound, (state, { outcome, winningPositions }) => {
    let newBoard = state.gameBoard;

    if (outcome === OutcomeEnum.Win) {
      // Highlight the squares that resulted in the win, not all for the winning player
      newBoard = state.gameBoard.map((square, index) => {
        if (winningPositions?.includes(index)) {
          return { ...square, isWinner: true };
        }
        return square;
      });
    }

    return {
      ...state,
      gameBoard: newBoard,
      outcome,
    };
  })
);
