import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import {
  selectPlayers,
  selectCurrentPlayer,
  selectCurrentPlayerIndex,
} from './player.selectors';

describe('Player Selectors', () => {
  let initialPlayerStateMock: ReturnType<typeof getInitialPlayerStateMock>;

  beforeEach(() => {
    initialPlayerStateMock = getInitialPlayerStateMock();
  });

  test('should return all players from state', () => {
    const result = selectPlayers.projector(initialPlayerStateMock);

    expect(result).toStrictEqual(initialPlayerStateMock.players);
  });

  test('should return current player index from state', () => {
    const result = selectCurrentPlayerIndex.projector(initialPlayerStateMock);

    expect(result).toBe(initialPlayerStateMock.currentPlayerIndex);
  });

  test('should return current player based on current index', () => {
    const currentPlayerIndex = 0;

    const result = selectCurrentPlayer.projector(
      initialPlayerStateMock.players,
      currentPlayerIndex
    );

    expect(result).toStrictEqual(
      initialPlayerStateMock.players[currentPlayerIndex]
    );
  });
});
