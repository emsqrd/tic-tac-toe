import { createAction, props } from '@ngrx/store';
import { Player } from '../../models/player';

export const buildBoard = createAction('Build Board');
export const updateBoard = createAction(
  'Update Board',
  props<{ currentPlayer: Player; position: number }>()
);
