import { createReducer, on } from '@ngrx/store';
import { Player } from '../../models/player';
import { switchPlayer, updatePlayerWins } from './player.actions';

export const playerFeatureKey = 'player';

export interface PlayerState {
  players: Player[];
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
  currentPlayerIndex: 0,
};

export const playerReducer = createReducer(
  initialState,
  on(switchPlayer, (state) => {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % 2;
    return {
      ...state,
      currentPlayerIndex: nextPlayerIndex,
    };
  }),
  on(updatePlayerWins, (state) => {
    const updatedPlayers = state.players.map((player, index) =>
      index === state.currentPlayerIndex
        ? { ...player, wins: player.wins + 1 }
        : player
    );

    return {
      ...state,
      players: updatedPlayers,
    };
  })
);
