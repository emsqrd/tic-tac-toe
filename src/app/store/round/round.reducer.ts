import { createReducer, on } from '@ngrx/store';
import { RoundActions } from './round.actions';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Square } from '../../models/square';
import { Player } from '../../models/player';

export const roundFeatureKey = 'round';

export interface RoundState {
  gameBoard: Square[];
  outcome: OutcomeEnum;
  processingMove: boolean;
  roundStartingPlayerIndex: number;
}

export const initialState: RoundState = {
  gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
  outcome: OutcomeEnum.None,
  processingMove: false,
  roundStartingPlayerIndex: 0,
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
  on(RoundActions.setBoardPosition, (state, { position, piece }) => {
    const newBoard = state.gameBoard.map((square, index) =>
      index === position ? { ...square, gamePiece: piece } : square
    );

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
  }),
  on(RoundActions.switchRoundStartingPlayerIndex, (state) => {
    const nextroundStartingPlayerIndex =
      (state.roundStartingPlayerIndex + 1) % 2;
    return {
      ...state,
      roundStartingPlayerIndex: nextroundStartingPlayerIndex,
    };
  }),
  on(RoundActions.resetRoundStartingPlayerIndex, (state) => {
    return {
      ...state,
      roundStartingPlayerIndex: 0,
    };
  })
);
