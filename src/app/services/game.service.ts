import { Injectable } from '@angular/core';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor() {}

  // Calculate the winner and return the winning positions
  calculateWinner(gameBoard: Square[]): number[] | null {
    for (let i = 0; i < this.winConditions.length; i++) {
      const [a, b, c] = this.winConditions[i];
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

  getRandomEmptySquare(gameBoard: Square[]): number {
    const emptySquares: number[] = [];
    gameBoard.forEach((square, index) => {
      if (square.gamePiece === '') {
        emptySquares.push(index);
      }
    });

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }

  makeMediumCpuMove(gameBoard: Square[]): number {
    // todo: leave this for hard difficulty
    // Take center if available
    // if (gameBoard[4].gamePiece === '') {
    //   return 4;
    // }

    // Check if CPU can win
    const cpuWinMove = this.findWinningMove(gameBoard, 'O');
    if (cpuWinMove !== -1) {
      return cpuWinMove;
    }

    // Check if human can win and block
    const humanWinMove = this.findWinningMove(gameBoard, 'X');
    if (humanWinMove !== -1) {
      return humanWinMove;
    }

    // Take a corner if available
    const cornerMove = this.findCornerMove(gameBoard);
    if (cornerMove !== -1) {
      return cornerMove;
    }

    // If no winning moves, make a random move
    return this.getRandomEmptySquare(gameBoard);
  }

  findCornerMove(gameBoard: Square[]): number {
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(
      (corner) => gameBoard[corner].gamePiece === ''
    );

    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    return -1;
  }

  // todo: it feels like this isn't always finding the winning move
  findWinningMove(gameBoard: Square[], gamePiece: string): number {
    for (const pattern of this.winConditions) {
      const [a, b, c] = pattern;
      const squares = [
        gameBoard[a].gamePiece,
        gameBoard[b].gamePiece,
        gameBoard[c].gamePiece,
      ];

      if (
        squares.filter((square) => square === gamePiece).length === 2 &&
        squares.filter((square) => square === '').length === 1
      ) {
        return pattern[squares.findIndex((square) => square === '')];
      }
    }

    return -1;
  }
}
