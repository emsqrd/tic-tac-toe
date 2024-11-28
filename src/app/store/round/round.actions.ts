import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { empty } from 'rxjs';
import { Square } from '../../models/square';

// todo: create different action groups for different types of actions
/*
  command actions - triggers effect only - i.e. make cpu move
  event actions with payload - triggers effect - i.e. attempt move
  result actions - updates state in reducer - i.e. start round
*/
export const RoundActions = createActionGroup({
  source: 'Round',
  events: {
    'Initialize Round': emptyProps(), // Change to emptyProps since we'll get startingPlayerIndex from state
    'Process CPU Move': props<{ boardState: Square[] }>(),
    'Process Human Move': props<{ position: number; piece: string }>(),
    'Update Board': props<{
      position?: number;
      piece?: string;
      clear?: boolean;
    }>(),
    'Evaluate Round Status': props<{ boardState: Square[] }>(),
    'Complete Round': props<{
      outcome: OutcomeEnum;
      winningPositions?: number[];
    }>(),
    'Set Processing State': props<{ isProcessing: boolean }>(),
    'Switch Round Starting Player Index': emptyProps(),
    'Reset Round Starting Player Index': emptyProps(),
  },
});
