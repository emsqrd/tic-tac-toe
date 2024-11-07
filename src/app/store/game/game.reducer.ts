import { createReducer, on } from '@ngrx/store';
import {
  switchGameMode,
  startGame,
  resetDraws,
  updateDraws,
  switchGameDifficulty,
} from './game.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

export const gameFeatureKey = 'game';

export interface GameState {
  draws: number;
  gameMode: GameModeEnum;
  gameDifficulty: GameDifficultyEnum;
}

export const initialState: GameState = {
  draws: 0,
  gameMode: GameModeEnum.TwoPlayer,
  gameDifficulty: GameDifficultyEnum.Easy,
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
  }),
  on(switchGameDifficulty, (state) => {
    // todo: find a better way to work through this
    let gameDifficulties = [
      GameDifficultyEnum.Easy,
      GameDifficultyEnum.Medium,
      GameDifficultyEnum.Hard,
    ];

    let currentDifficultyIndex = gameDifficulties.indexOf(state.gameDifficulty);

    let newDifficultyIndex: number = 0;

    switch (currentDifficultyIndex) {
      case 0:
        newDifficultyIndex = 1;
        break;
      case 1:
        newDifficultyIndex = 2;
        break;
      case 2:
        newDifficultyIndex = 0;
        break;
    }

    return {
      ...state,
      gameDifficulty: gameDifficulties[newDifficultyIndex],
    };
  })
);
