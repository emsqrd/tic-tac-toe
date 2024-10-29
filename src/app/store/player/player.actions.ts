import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';

export const resetPlayers = createAction('[Player] Reset Players');

export const switchPlayer = createAction('[Player] Switch Player');

export const updatePlayerWins = createAction('[Player] Update Player Wins');

export const setCpuPlayer = createAction(
  '[Player] Set CPU Player',
  props<{ gamePiece: string }>()
);
