import { switchPlayer } from './player.actions';
import { initialState, playerReducer } from './player.reducer';
import { updatePlayerWins } from './player.actions';

describe('Player Reducer', () => {
  it('should return the initial state', () => {
    const state = playerReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle switchPlayer action', () => {
    const state = playerReducer(initialState, switchPlayer());
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should handle switchPlayer action when currentPlayerIndex is 0', () => {
    const state = playerReducer(
      { ...initialState, currentPlayerIndex: 0 },
      switchPlayer()
    );
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should handle updatePlayerWins action', () => {
    const state = playerReducer(initialState, updatePlayerWins());
    expect(state.players[0].wins).toBe(1);
  });

  it('should handle updatePlayerWins action when currentPlayerIndex is 1', () => {
    const state = playerReducer(
      { ...initialState, currentPlayerIndex: 1 },
      updatePlayerWins()
    );
    expect(state.players[1].wins).toBe(1);
  });

  it('should not update wins for the other player', () => {
    const state = playerReducer(
      { ...initialState, currentPlayerIndex: 1 },
      updatePlayerWins()
    );
    expect(state.players[0].wins).toBe(0);
  });
});
