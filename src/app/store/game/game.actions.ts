import { createAction, props } from '@ngrx/store';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameModeEnum } from '../../enums/game-mode.enum';

export const startGame = createAction(
  '[Game] Start Game',
  props<{ gameMode: GameModeEnum }>()
);

export const startRound = createAction('[Game] Start Round');

export const endRound = createAction(
  '[Game] End Round',
  props<{ outcome: OutcomeEnum; winningPositions: number[] | null }>()
);

export const attemptMove = createAction(
  '[Game] Attempt Move',
  props<{ position: number; currentPlayer: Player }>()
);

export const makeMove = createAction(
  '[Game] Make Move',
  props<{ position?: number; currentPlayer: Player }>()
);

export const endGame = createAction('[Game] End Game');

export const switchGameMode = createAction('[Game] Switch Game Mode');

// * Adding this temporarily until deciding on how to handle rounds
export const resetDraws = createAction('[Game] Reset Draws');
