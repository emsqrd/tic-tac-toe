import { Injectable } from '@angular/core';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private winConditions = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  private minimax(
    board: Square[],
    player: string
  ): { score: number; move?: number } {
    const availableMoves = this.getAvailableMoves(board);

    // Check terminal states
    if (this.checkWin(board, 'O')) return { score: 10 };
    if (this.checkWin(board, 'X')) return { score: -10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves: { score: number; move: number }[] = [];

    // Try all possible moves
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = { gamePiece: player, isWinner: false };

      const score = this.minimax(newBoard, player === 'O' ? 'X' : 'O').score;
      moves.push({ score, move });
    }

    // Maximize for CPU (O) and minimize for human (X)
    if (player === 'O') {
      const bestMove = moves.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev
      );
      return bestMove;
    } else {
      const bestMove = moves.reduce((prev, curr) =>
        curr.score < prev.score ? curr : prev
      );
      return bestMove;
    }
  }

  private checkWin(board: Square[], player: string): boolean {
    return this.winConditions.some((condition) =>
      condition.every((index) => board[index].gamePiece === player)
    );
  }

  private getAvailableMoves(board: Square[]): number[] {
    return board
      .map((square, index) => (square.gamePiece === '' ? index : -1))
      .filter((index) => index !== -1);
  }
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

  makeHardCpuMove(gameBoard: Square[]): number {
    const move = this.minimax(gameBoard, 'O').move;
    return move !== undefined ? move : this.getRandomEmptySquare(gameBoard);
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
