import { switchPlayer } from './player.actions';
import { initialState, playerReducer } from './player.reducer';

describe('Player Reducer', () => {
  it('should return the initial state', () => {
    const state = playerReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle switchPlayer action', () => {
    const state = playerReducer(initialState, switchPlayer());
    expect(state.currentPlayerIndex).toBe(1);
    expect(state.currentPlayer).toEqual(state.players[1]);
  });

  it('should handle switchPlayer action when currentPlayerIndex is 0', () => {
    const state = playerReducer(
      { ...initialState, currentPlayerIndex: 0 },
      switchPlayer()
    );
    expect(state.currentPlayerIndex).toBe(1);
    expect(state.currentPlayer).toEqual(state.players[1]);
  });
});
