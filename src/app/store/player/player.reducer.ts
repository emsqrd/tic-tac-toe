import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player';
import { switchPlayer } from './player.actions';

export const playerFeatureKey = 'player';

export interface PlayerState {
  players: Player[];
  currentPlayer: Player;
  currentPlayerIndex: number;
}

export const initialState: PlayerState = {
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
  currentPlayer: {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
  },
  currentPlayerIndex: 0,
};

export const playerReducer = createReducer(
  initialState,
  on(switchPlayer, (state) => {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % 2;
    return {
      ...state,
      currentPlayer: state.players[nextPlayerIndex],
      currentPlayerIndex: nextPlayerIndex,
    };
  })
);
