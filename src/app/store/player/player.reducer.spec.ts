import { resetPlayers, setCpuPlayer, switchPlayer } from './player.actions';
import { playerReducer, PlayerState } from './player.reducer';
import { updatePlayerWins } from './player.actions';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';

describe('Player Reducer', () => {
  let initialPlayerStateMock: PlayerState;

  beforeEach(() => {
    initialPlayerStateMock = getInitialPlayerStateMock();
  });

  it('should return the initial state', () => {
    const state = playerReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialPlayerStateMock);
  });

  it('should handle resetPlayers action by resetting player wins to 0 and setting currentPlayerIndex to 0', () => {
    const state = playerReducer(initialPlayerStateMock, updatePlayerWins());
    const resetState = playerReducer(state, resetPlayers());

    expect(resetState.players[0].wins).toBe(0);
    expect(resetState.currentPlayerIndex).toBe(0);
  });

  it('should handle switchPlayer action', () => {
    const state = playerReducer(initialPlayerStateMock, switchPlayer());
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should handle switchPlayer action when currentPlayerIndex is 0', () => {
    const state = playerReducer(
      { ...initialPlayerStateMock, currentPlayerIndex: 0 },
      switchPlayer()
    );
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should handle updatePlayerWins action', () => {
    const state = playerReducer(initialPlayerStateMock, updatePlayerWins());
    expect(state.players[0].wins).toBe(1);
  });

  it('should handle updatePlayerWins action when currentPlayerIndex is 1', () => {
    const state = playerReducer(
      { ...initialPlayerStateMock, currentPlayerIndex: 1 },
      updatePlayerWins()
    );
    expect(state.players[1].wins).toBe(1);
  });

  it('should not update wins for the other player', () => {
    const state = playerReducer(
      { ...initialPlayerStateMock, currentPlayerIndex: 1 },
      updatePlayerWins()
    );
    expect(state.players[0].wins).toBe(0);
  });

  it('should handle setCpuPlayer action', () => {
    const cpuPlayer = initialPlayerStateMock.players[1];

    const state = playerReducer(
      initialPlayerStateMock,
      setCpuPlayer({ gamePiece: cpuPlayer.piece })
    );
    expect(state.players[1].isCpu).toBe(true);
  });
});
