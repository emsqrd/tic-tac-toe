import { createAction, props } from '@ngrx/store';
import { GameModeEnum } from '../../enums/game-mode.enum';

// todo: update this to use action groups instead
export const startGame = createAction(
  '[Game] Start Game',
  props<{ gameMode: GameModeEnum }>()
);

export const endGame = createAction('[Game] End Game');

export const switchGameMode = createAction('[Game] Switch Game Mode');

export const resetDraws = createAction('[Game] Reset Draws');

export const updateDraws = createAction('[Game] Update Draws');
