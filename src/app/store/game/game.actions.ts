import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { OutcomeEnum } from '../../enums/outcome.enum';

export const startGame = createAction('[Game] Start Game');
export const makeMove = createAction(
  '[Game] Make Move',
  props<{ position: number }>()
);
export const switchPlayer = createAction('[Game] Switch Player');
export const endGame = createAction(
  '[Game] End Game',
  props<{ outcome: OutcomeEnum; winningPositions: number[] | null }>()
);
