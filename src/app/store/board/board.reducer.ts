import { createReducer, on } from '@ngrx/store';
import { Square } from '../../models/square';
import { buildBoard as buildBoard, updateBoard } from './board.actions';
import { Player } from '../../models/player';

export interface BoardState {
  board: Square[];
}

export const initialState: BoardState = {
  board: Array(9).fill({ gamePiece: '', isWinner: false }),
};

const updateBoardPosition = (
  state: BoardState,
  currentPlayer: Player,
  position: number
): BoardState => {
  const newBoard = [...state.board];
  newBoard[position] = {
    gamePiece: currentPlayer.piece,
    isWinner: false,
  };

  return { board: newBoard };
};

export const boardReducer = createReducer(
  initialState,
  on(buildBoard, () => initialState),
  on(updateBoard, (state, { currentPlayer, position }) =>
    updateBoardPosition(state, currentPlayer, position)
  )
);
