import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectPlayers = createSelector(
  selectPlayerState,
  (state) => state.players
);

export const selectCurrentPlayer = createSelector(
  selectPlayerState,
  (state) => state.currentPlayer
);

export const selectCurrentPlayerIndex = createSelector(
  selectPlayerState,
  (state) => state.currentPlayerIndex
);
