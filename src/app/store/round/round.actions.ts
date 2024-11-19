import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

// todo: create different action groups for different types of actions
/*
  command actions - triggers effect only - i.e. make cpu move
  event actions with payload - triggers effect - i.e. attempt move
  result actions - updates state in reducer - i.e. start round
*/
export const RoundActions = createActionGroup({
  source: 'Round',
  events: {
    'Start Round': props<{ startingPlayerIndex: number }>(),
    'Start Turn': emptyProps(),
    'End Turn': emptyProps(),
    'End Round': props<{
      outcome: OutcomeEnum;
      winningPositions: number[] | null;
    }>(),
    'Set Processing Move': props<{ processingMove: boolean }>(),
    'Set Board Position': props<{ position: number; piece: string }>(),
    'Make Human Move': props<{ position: number }>(),
    'Make CPU Move': emptyProps(),
    'Switch Round Starting Player Index': emptyProps(),
  },
});
