import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { PlayerState } from './player.reducer';
import {
  selectPlayers,
  selectCurrentPlayer,
  selectCurrentPlayerIndex,
} from './player.selectors';

describe('Player Selectors', () => {
  let initialPlayerStateMock: PlayerState;

  beforeEach(() => {
    initialPlayerStateMock = getInitialPlayerStateMock();
  });

  it('should select the players', () => {
    const result = selectPlayers.projector(initialPlayerStateMock);
    expect(result).toEqual(initialPlayerStateMock.players);
  });

  it('should select the current player index', () => {
    const result = selectCurrentPlayerIndex.projector(initialPlayerStateMock);
    expect(result).toEqual(initialPlayerStateMock.currentPlayerIndex);
  });

  it('should select the current player', () => {
    const curentPlayerIndex = 0;
    const result = selectCurrentPlayer.projector(
      initialPlayerStateMock.players,
      curentPlayerIndex
    );
    expect(result).toEqual(initialPlayerStateMock.players[curentPlayerIndex]);
  });
});
