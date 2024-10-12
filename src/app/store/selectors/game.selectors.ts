import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectPlayers = createSelector(
  selectGameState,
  (state: GameState) => state.players
);

export const selectCurrentPlayer = createSelector(
  selectGameState,
  (state: GameState) => state.players[state.currentPlayerIndex]
);

export const selectBoard = createSelector(
  selectGameState,
  (state: GameState) => state.board
);

export const selectOutcome = createSelector(
  selectGameState,
  (state: GameState) => state.outcome
);
