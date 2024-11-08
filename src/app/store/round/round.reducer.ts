import { createReducer, on } from '@ngrx/store';
import { RoundActions } from './round.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Square } from '../../models/square';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

export const roundFeatureKey = 'round';

export interface RoundState {
  gameBoard: Square[];
  outcome: OutcomeEnum;
  processingMove: boolean;
}

export const initialState: RoundState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
  processingMove: false,
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
  on(RoundActions.setProcessingMove, (state, { processingMove }) => {
    return {
      ...state,
      processingMove,
    };
  }),
  on(
    RoundActions.makeMove,
    (state, { position, currentPlayer, gameDifficulty }) => {
      let newBoard = state.gameBoard;

      // If no position is provided or game difficulty is easy, make a random move
      if (
        position === undefined &&
        gameDifficulty === GameDifficultyEnum.Easy
      ) {
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
    }
  ),
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
