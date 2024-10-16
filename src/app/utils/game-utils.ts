import { Square } from '../models/square';

export const calculateWinner = (gameBoard: Square[]): string | null => {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (
      gameBoard[a].gamePiece &&
      gameBoard[a].gamePiece === gameBoard[b].gamePiece &&
      gameBoard[a].gamePiece === gameBoard[c].gamePiece
    ) {
      return gameBoard[a].gamePiece;
    }
  }
  return null;
};
