import { createReducer, on } from '@ngrx/store';
import {
  switchGameMode,
  startGame,
  resetDraws,
  updateDraws,
} from './game.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';

export const gameFeatureKey = 'game';

export interface GameState {
  draws: number;
  gameMode: GameModeEnum;
}

export const initialState: GameState = {
  draws: 0,
  gameMode: GameModeEnum.TwoPlayer,
};

export const gameReducer = createReducer(
  initialState,
  on(startGame, (state, { gameMode }) => ({
    ...state,
    gameMode: gameMode,
  })),
  on(switchGameMode, (state) => {
    let newGameMode =
      state.gameMode === GameModeEnum.TwoPlayer
        ? GameModeEnum.SinglePlayer
        : GameModeEnum.TwoPlayer;

    return {
      ...state,
      gameMode: newGameMode,
    };
  }),
  on(resetDraws, (state) => {
    return {
      ...state,
      draws: 0,
    };
  }),
  on(updateDraws, (state) => {
    return {
      ...state,
      draws: state.draws + 1,
    };
  })
);
