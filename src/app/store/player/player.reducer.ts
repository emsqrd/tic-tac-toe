import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player';
import { loadPlayers } from './player.actions';

export interface PlayerState {
  players: Player[];
}

export const initialState: PlayerState = {
  players: [
    { name: 'Player 1', piece: 'X', wins: 0, isCurrent: true, isWinner: false },
    {
      name: 'Player 2',
      piece: 'O',
      wins: 0,
      isCurrent: false,
      isWinner: false,
    },
  ],
};

export const playerReducer = createReducer(
  initialState,
  on(loadPlayers, () => initialState)
);
