import { Action, createReducer, on } from '@ngrx/store';
import { OutcomeEnum } from '../../models/outcome.enum';
import { Player } from '../../models/player';
import {
  endGame,
  makeMove,
  resetGame,
  startGame,
} from '../actions/game.actions';
import { Square } from '../../models/square';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  board: Square[];
  outcome: OutcomeEnum;
  currentMove: number;
  draws: number;
}

export const initialState: GameState = {
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
  currentPlayerIndex: 0,
  board: Array(9).fill(null),
  outcome: OutcomeEnum.None,
  currentMove: 1,
  draws: 0,
};

const _gameReducer = createReducer(
  initialState,
  on(startGame, (state) => ({
    ...state,
    board: Array(9).fill({ gamePiece: '', isWinner: false }),
    outcome: OutcomeEnum.None,
    currentMove: 1,
    currentPlayerIndex: 0,
  })),
  on(makeMove, (state, { player, position }) => {
    const newBoard = [...state.board];
    const updatedPosition = {
      ...newBoard[position],
      gamePiece: player.piece,
    };
    newBoard[position] = updatedPosition;
    const newCurrentPlayerIndex = (state.currentPlayerIndex + 1) % 2;
    return {
      ...state,
      board: newBoard,
      currentPlayerIndex: newCurrentPlayerIndex,
      currentMove: state.currentMove + 1,
    };
  }),
  on(endGame, (state, { outcome }) => ({
    ...state,
    outcome,
  })),
  on(resetGame, (state) => initialState)
);

export function gameReducer(state: GameState | undefined, action: Action) {
  return _gameReducer(state, action);
}
