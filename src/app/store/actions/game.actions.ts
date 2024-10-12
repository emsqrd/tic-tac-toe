import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';
import { OutcomeEnum } from '../../models/outcome.enum';

export const startGame = createAction('[Game] Start Game');
export const makeMove = createAction(
  '[Game] Make Move',
  props<{ player: Player; position: number }>()
);
export const endGame = createAction(
  '[Game] End Game',
  props<{ outcome: OutcomeEnum }>()
);
export const resetGame = createAction('[Game] Reset Game');
