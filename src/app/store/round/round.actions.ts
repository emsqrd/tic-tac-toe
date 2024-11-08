import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

export const RoundActions = createActionGroup({
  source: 'Round',
  events: {
    'Start Round': emptyProps(),
    'Start Turn': emptyProps(),
    'End Turn': emptyProps(),
    'End Round': props<{
      outcome: OutcomeEnum;
      winningPositions: number[] | null;
    }>(),
    'Set Processing Move': props<{ processingMove: boolean }>(),
    'Attempt Move': props<{ position?: number }>(),
    'Make Move': props<{
      position?: number;
      currentPlayer: Player;
      gameDifficulty: GameDifficultyEnum;
    }>(),
  },
});
