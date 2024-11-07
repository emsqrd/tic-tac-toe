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
    const gameDifficulties = Object.values(GameDifficultyEnum);

    const currentDifficultyIndex = gameDifficulties.indexOf(
      state.gameDifficulty
    );

    const newDifficultyIndex =
      (currentDifficultyIndex + 1) % gameDifficulties.length;

    return {
      ...state,
      gameDifficulty: gameDifficulties[newDifficultyIndex],
    };
  })
);
