import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectPlayers = createSelector(
  selectPlayerState,
  (state) => state.players
);

export const selectCurrentPlayerIndex = createSelector(
  selectPlayerState,
  (state) => state.currentPlayerIndex
);

export const selectCurrentPlayer = createSelector(
  selectPlayers,
  selectCurrentPlayerIndex,
  (players, currentPlayerIndex) => players[currentPlayerIndex]
);
