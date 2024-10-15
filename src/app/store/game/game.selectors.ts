import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectGameBoard = createSelector(
  selectGameState,
  (state) => state.gameBoard
);

export const selectCurrentPlayer = createSelector(
  selectGameState,
  (state) => state.currentPlayer
);

export const selectWinner = createSelector(
  selectGameState,
  (state) => state.winner
);
