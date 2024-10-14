import { Action, createReducer, on } from '@ngrx/store';
import { OutcomeEnum } from '../../models/outcome.enum';
import { Player } from '../../models/player';
import {
  endGame,
  makeMove as switchPlayer,
  resetGame,
  startGame,
} from './game.actions';
import { Square } from '../../models/square';

export interface GameState {
  currentPlayerIndex: number;
  outcome: OutcomeEnum;
}

export const initialState: GameState = {
  currentPlayerIndex: 0,
  outcome: OutcomeEnum.None,
};

const _gameReducer = createReducer(
  initialState,
  on(startGame, (state) => ({
    ...state,
    outcome: OutcomeEnum.None,
    currentPlayerIndex: 0,
  })),
  on(switchPlayer, (state, { player, position }) => {
    const newCurrentPlayerIndex = (state.currentPlayerIndex + 1) % 2;
    return {
      ...state,
      currentPlayerIndex: newCurrentPlayerIndex,
    };
  }),
  on(endGame, (state, { outcome }) => ({
    ...state,
    outcome,
  })),
  on(resetGame, () => initialState)
);

export function gameReducer(state: GameState | undefined, action: Action) {
  return _gameReducer(state, action);
}
