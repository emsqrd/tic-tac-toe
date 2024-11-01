import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoundState } from './round.reducer';

export const selectRoundState = createFeatureSelector<RoundState>('round');

export const selectGameBoard = createSelector(
  selectRoundState,
  (state) => state.gameBoard
);

export const selectOutcome = createSelector(
  selectRoundState,
  (state) => state.outcome
);
