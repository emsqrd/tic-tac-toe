import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';
import { OutcomeEnum } from '../../models/outcome.enum';

export const startGame = createAction('Start Game');
export const makeMove = createAction(
  'Make Move',
  props<{ player: Player; position: number }>()
);
export const endGame = createAction(
  'End Game',
  props<{ outcome: OutcomeEnum }>()
);
export const resetGame = createAction('Reset Game');
