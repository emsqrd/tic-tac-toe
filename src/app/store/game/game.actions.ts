import { createAction, props } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';

export const startGame = createAction('[Game] Start Game');
export const attemptMove = createAction(
  '[Game] Attempt Move',
  props<{ position: number }>()
);
export const makeMove = createAction(
  '[Game] Make Move',
  props<{ position: number }>()
);
export const switchPlayer = createAction('[Game] Switch Player');
export const endGame = createAction(
  '[Game] End Game',
  props<{ outcome: OutcomeEnum; winningPositions: number[] | null }>()
);
