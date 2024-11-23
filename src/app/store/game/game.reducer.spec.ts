import { gameReducer, GameState } from './game.reducer';
import {
  startGame,
  switchGameMode,
  resetDraws,
  updateDraws,
  switchGameDifficulty,
} from './game.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { PlayerState } from '../player/player.reducer';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

let initialGameStateMock: GameState;
let initialPlayerStateMock: PlayerState;

beforeEach(() => {
  initialGameStateMock = getInitialGameStateMock();
  initialPlayerStateMock = getInitialPlayerStateMock();
});

describe('gameReducer', () => {
  test('should return initial state when undefined state is provided', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialGameStateMock);
  });

  describe('startGame', () => {
    test('should set game mode when startGame action is dispatched', () => {
      const state = gameReducer(
        initialGameStateMock,
        startGame({ gameMode: initialGameStateMock.gameMode })
      );

      expect(state.gameMode).toBe(initialGameStateMock.gameMode);
    });
  });

  describe('switchGameMode', () => {
    test('should switch from two player to single player mode', () => {
      const state = gameReducer(initialGameStateMock, switchGameMode());
      expect(state.gameMode).toBe(GameModeEnum.SinglePlayer);
    });

    test('should switch from single player to two player mode', () => {
      const state = gameReducer(
        { ...initialGameStateMock, gameMode: GameModeEnum.SinglePlayer },
        switchGameMode()
      );
      expect(state.gameMode).toBe(GameModeEnum.TwoPlayer);
    });
  });

  describe('draws', () => {
    test('should reset draws count to zero', () => {
      const state = gameReducer(
        { ...initialGameStateMock, draws: 5 },
        resetDraws()
      );
      expect(state.draws).toBe(0);
    });

    test('should increment draws count by one', () => {
      const state = gameReducer(
        { ...initialGameStateMock, draws: 0 },
        updateDraws()
      );
      expect(state.draws).toBe(1);
    });
  });

  describe('switchGameDifficulty', () => {
    test('should switch from easy to medium difficulty', () => {
      const state = gameReducer(
        { ...initialGameStateMock, gameDifficulty: GameDifficultyEnum.Easy },
        switchGameDifficulty()
      );
      expect(state.gameDifficulty).toBe(GameDifficultyEnum.Medium);
    });

    test('should switch from medium to hard difficulty', () => {
      const state = gameReducer(
        { ...initialGameStateMock, gameDifficulty: GameDifficultyEnum.Medium },
        switchGameDifficulty()
      );
      expect(state.gameDifficulty).toBe(GameDifficultyEnum.Hard);
    });

    test('should switch from hard to easy difficulty', () => {
      const state = gameReducer(
        { ...initialGameStateMock, gameDifficulty: GameDifficultyEnum.Hard },
        switchGameDifficulty()
      );
      expect(state.gameDifficulty).toBe(GameDifficultyEnum.Easy);
    });
  });
});
