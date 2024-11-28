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
  on(RoundActions.initializeRound, (state) => ({
    ...state,
    gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
  })),
  on(RoundActions.setProcessingState, (state, { isProcessing }) => ({
    ...state,
    processingMove: isProcessing,
  })),
  on(RoundActions.updateBoard, (state, { clear, position, piece }) => ({
    ...state,
    gameBoard: clear
      ? Array(9).fill({ gamePiece: '', isWinner: false })
      : state.gameBoard.map((square, index) =>
          index === position ? { ...square, gamePiece: piece } : square
        ),
  })),
  on(RoundActions.completeRound, (state, { outcome, winningPositions }) => ({
    ...state,
    gameBoard: state.gameBoard.map((square, index) => ({
      ...square,
      isWinner: winningPositions?.includes(index) ?? false,
    })),
    outcome,
  })),
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
