import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectGameBoard = createSelector(
  selectGameState,
  (state) => state.gameBoard
);

export const selectDraws = createSelector(
  selectGameState,
  (state) => state.draws
);

export const selectOutcome = createSelector(
  selectGameState,
  (state) => state.outcome
);
