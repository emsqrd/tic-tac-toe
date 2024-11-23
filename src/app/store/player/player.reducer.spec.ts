import {
  resetPlayers,
  setCpuPlayer,
  setCurrentPlayer,
  switchPlayer,
  updatePlayerWins,
} from './player.actions';
import { playerReducer, PlayerState } from './player.reducer';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';

describe('playerReducer', () => {
  let initialPlayerStateMock: PlayerState;

  beforeEach(() => {
    initialPlayerStateMock = getInitialPlayerStateMock();
  });

  test('returns initial state when undefined state is provided', () => {
    const state = playerReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialPlayerStateMock);
  });

  describe('resetPlayers', () => {
    test('resets player wins and current player index', () => {
      const state = playerReducer(initialPlayerStateMock, updatePlayerWins());
      const resetState = playerReducer(state, resetPlayers());

      expect(resetState.players[0].wins).toBe(0);
      expect(resetState.currentPlayerIndex).toBe(0);
    });
  });

  describe('switchPlayer', () => {
    test('switches to next player from index 0', () => {
      const state = playerReducer(
        { ...initialPlayerStateMock, currentPlayerIndex: 0 },
        switchPlayer()
      );
      expect(state.currentPlayerIndex).toBe(1);
    });

    test('switches to first player from index 1', () => {
      const state = playerReducer(
        { ...initialPlayerStateMock, currentPlayerIndex: 1 },
        switchPlayer()
      );
      expect(state.currentPlayerIndex).toBe(0);
    });
  });

  describe('updatePlayerWins', () => {
    test('increments wins for current player at index 0', () => {
      const state = playerReducer(
        { ...initialPlayerStateMock, currentPlayerIndex: 0 },
        updatePlayerWins()
      );
      expect(state.players[0].wins).toBe(1);
      expect(state.players[1].wins).toBe(0);
    });

    test('increments wins for current player at index 1', () => {
      const state = playerReducer(
        { ...initialPlayerStateMock, currentPlayerIndex: 1 },
        updatePlayerWins()
      );
      expect(state.players[1].wins).toBe(1);
      expect(state.players[0].wins).toBe(0);
    });
  });

  describe('setCpuPlayer', () => {
    test('sets player as CPU when matching game piece', () => {
      const cpuPlayer = initialPlayerStateMock.players[1];
      const state = playerReducer(
        initialPlayerStateMock,
        setCpuPlayer({ gamePiece: cpuPlayer.piece })
      );
      expect(state.players[1].isCpu).toBe(true);
    });
  });

  describe('setCurrentPlayer', () => {
    test('updates current player index', () => {
      const state = playerReducer(
        initialPlayerStateMock,
        setCurrentPlayer({ currentPlayerIndex: 1 })
      );
      expect(state.currentPlayerIndex).toBe(1);
    });
  });
});
