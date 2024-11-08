import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectDraws = createSelector(
  selectGameState,
  (state: GameState) => state.draws
);

export const selectGameMode = createSelector(
  selectGameState,
  (state: GameState) => state.gameMode
);

export const selectGameDifficulty = createSelector(
  selectGameState,
  (state: GameState) => state.gameDifficulty
);
