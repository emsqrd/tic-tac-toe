import { createAction } from '@ngrx/store';

export const resetPlayers = createAction('[Player] Reset Players');

export const switchPlayer = createAction('[Player] Switch Player');

export const updatePlayerWins = createAction('[Player] Update Player Wins');
