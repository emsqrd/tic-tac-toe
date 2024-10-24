import { PlayerState } from './player.reducer';
import {
  selectPlayers,
  selectCurrentPlayer,
  selectCurrentPlayerIndex,
} from './player.selectors';

describe('Player Selectors', () => {
  const initialState: PlayerState = {
    players: [
      {
        name: 'Player 1',
        piece: 'X',
        wins: 0,
      },
      {
        name: 'Player 2',
        piece: 'O',
        wins: 0,
      },
    ],
    currentPlayerIndex: 0,
  };

  it('should select the players', () => {
    const result = selectPlayers.projector(initialState);
    expect(result).toEqual(initialState.players);
  });

  it('should select the current player index', () => {
    const result = selectCurrentPlayerIndex.projector(initialState);
    expect(result).toEqual(initialState.currentPlayerIndex);
  });

  it('should select the current player', () => {
    const curentPlayerIndex = 0;
    const result = selectCurrentPlayer.projector(
      initialState.players,
      curentPlayerIndex
    );
    expect(result).toEqual(initialState.players[curentPlayerIndex]);
  });
});
