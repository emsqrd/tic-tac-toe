import { Player } from '../../models/player';
import { PlayerState } from '../player/player.reducer';

export const getInitialPlayerStateMock = (): PlayerState => ({
  players: [
    {
      name: 'Player 1',
      piece: 'X',
      wins: 0,
      isCpu: false,
    },
    {
      name: 'Player 2',
      piece: 'O',
      wins: 0,
      isCpu: false,
    },
  ],
  currentPlayerIndex: 0,
});
