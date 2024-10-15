import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';

export const startGame = createAction('[Game] Start Game');
export const makeMove = createAction(
  '[Game] Make Move',
  props<{ position: number }>()
);
export const endGame = createAction(
  '[Game] End Game',
  props<{ winner: Player }>()
);
