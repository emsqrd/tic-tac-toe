import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';

export const RoundActions = createActionGroup({
  source: 'Round',
  events: {
    'Start Round': emptyProps(),
    'End Round': props<{
      outcome: OutcomeEnum;
      winningPositions: number[] | null;
    }>(),
    'Attempt Move': props<{ position: number; currentPlayer: Player }>(),
    'Make Move': props<{ position?: number; currentPlayer: Player }>(),
  },
});
