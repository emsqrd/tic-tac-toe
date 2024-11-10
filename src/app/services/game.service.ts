import { Injectable } from '@angular/core';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

@Injectable({
  providedIn: 'root',
})

// todo: rename GameService to RoundService
export class GameService {
  constructor() {}

  // Calculate the winner and return the winning positions
  calculateWinner(gameBoard: Square[]): number[] | null {
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
        return [a, b, c];
      }
    }
    return null;
  }

  determineOutcome(gameBoard: Square[]): OutcomeEnum {
    const winningPositions = this.calculateWinner(gameBoard);
    let outcome: OutcomeEnum = OutcomeEnum.None;

    if (winningPositions) {
      outcome = OutcomeEnum.Win;
    } else if (gameBoard.every((square) => square.gamePiece !== '')) {
      outcome = OutcomeEnum.Draw;
    }

    return outcome;
  }

  makeCpuMove(gameBoard: Square[]): number {
    const emptySquares: number[] = [];
    gameBoard.forEach((square, index) => {
      if (square.gamePiece === '') {
        emptySquares.push(index);
      }
    });

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }
}
