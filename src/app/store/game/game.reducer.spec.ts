import { gameReducer, GameState } from './game.reducer';
import {
  startGame,
  switchGameMode,
  resetDraws,
  updateDraws,
} from './game.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { PlayerState } from '../player/player.reducer';

describe('Game Reducer', () => {
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
  });

  it('should return the initial state', () => {
    const state = gameReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialGameStateMock);
  });

  it('should handle startGame action', () => {
    const state = gameReducer(
      initialGameStateMock,
      startGame({ gameMode: initialGameStateMock.gameMode })
    );

    expect(state.gameMode).toEqual(initialGameStateMock.gameMode);
  });

  it('should handle switchGameMode action and switch game modes', () => {
    const state = gameReducer(initialGameStateMock, switchGameMode());
    expect(state.gameMode).toEqual(GameModeEnum.SinglePlayer);
  });

  it('should handle switchGameMode action and switch game modes back', () => {
    const state = gameReducer(
      { ...initialGameStateMock, gameMode: GameModeEnum.SinglePlayer },
      switchGameMode()
    );
    expect(state.gameMode).toEqual(GameModeEnum.TwoPlayer);
  });

  it('should handle resetDraws action', () => {
    const state = gameReducer(
      { ...initialGameStateMock, draws: 5 },
      resetDraws()
    );
    expect(state.draws).toEqual(0);
  });

  it('should handle updateDraws action and update the draw count', () => {
    const state = gameReducer(
      { ...initialGameStateMock, draws: 0 },
      updateDraws()
    );

    expect(state.draws).toEqual(1);
  });
});
